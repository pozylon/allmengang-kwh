const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_MEASUREMENTS_TABLE_ID = process.env.AIRTABLE_MEASUREMENTS_TABLE_ID;
const AIRTABLE_UTILITY_BILLS_TABLE_ID = process.env.AIRTABLE_UTILITY_BILLS_TABLE_ID;

export async function addMeasurements(records) {
    try {
        const result = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_MEASUREMENTS_TABLE_ID}`, {
            method: "POST",
            timeout: 5000,
            headers: {
                "Authorization": `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: records.map(record => ({ fields: {
                    "Date": toISO8601String(record.date),
                    Charger: record.charger,
                    kWH: record.kwh
                } }))
            }),
        });
        if (result.status === 200) {
            return result.json();
        }
        console.warn(await result.json());
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getMeasurements() {
    try {
        const result = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_MEASUREMENTS_TABLE_ID}`, {
            timeout: 5000,
            headers: {
                "Authorization": `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        });
        if (result.status === 200) {
            const { records } = await result.json();
            return records.map(record => ({
                date: new Date(record.fields["Date"]),
                charger: record.fields["Charger"],
                kwh: record.fields["kWH"],
                id: record.id
            }));
        }
        console.warn(await result.json());
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function getUtilityBills() {
    try {
        const result = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_UTILITY_BILLS_TABLE_ID}`, {
            timeout: 5000,
            headers: {
                "Authorization": `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
        });
        if (result.status === 200) {
            const { records } = await result.json();
            return records.map(record => ({
                from: new Date(record.fields["Abrechnung von"]),
                to: new Date(record.fields["Abrechnung bis"]),
                costs: new Date(record.fields["Kosten Total"]),
                id: record.id
            }));
        }
        console.warn(await result.json());
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function patchUtilityBills(records) {
    try {
        const result = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_UTILITY_BILLS_TABLE_ID}`, {
            method: "PATCH",
            timeout: 5000,
            headers: {
                "Authorization": `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: records.map((record) => ({
                    id: record.id,
                    fields: {
                        Measurements: record.measurementIds
                    }
                }))
            }),
        });
        if (result.status === 200) {
            return result.json();
        }
        console.warn(await result.json());
        return null;
    } catch (e) {
        console.error(e);
        return null;
    }
}

function toISO8601String(date) {
    const isoDateString = date.toISOString().substring(0, 10);
    return isoDateString;
}