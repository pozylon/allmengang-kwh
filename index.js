import * as airtable from './airtable.js'
import * as goE from './go-e.js'

async function main() {
    const newMeasurements = await goE.getTotalKWHCharged();
    await airtable.addMeasurements(newMeasurements);
    console.table(newMeasurements);

    const measurements = await airtable.getMeasurements();
    const utilityBills = await airtable.getUtilityBills();
    const updatedUtilityBills = await shakeItUp(utilityBills, measurements);
    await airtable.patchUtilityBills(updatedUtilityBills);
    console.table(updatedUtilityBills);
}

async function shakeItUp(utilityBills, measurements) {
    return utilityBills.map((utilityBill) => {
        const referenceDateFrom = utilityBill.from.getTime();
        const referenceDateTo = utilityBill.to.getTime();
        const measurementIds = measurements.filter(measurement => {
            const measureDate = measurement.date.getTime();
            return (measureDate >= referenceDateFrom && measureDate <= referenceDateTo);
        }).map(measurement => measurement.id);
        return {
            id: utilityBill.id,
            measurementIds
        };
    });
}

main().then((fullfilled) => process.exit(fullfilled ? 0 : 1))
