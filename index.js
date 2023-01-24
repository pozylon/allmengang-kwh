import * as dotenv from 'dotenv'

dotenv.config();

const AIRTABLE_ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;
const AIRTABLE_BASE_ID = 'appYTggkCoiSlmC36';
const AIRTABLE_TABLE_ID = 'tbl7jsyUrCZJZjAza';
const CHARGERS = JSON.parse(process.env.CHARGERS);

async function main() {
    const rows = await downloadTotalKWHChargedFromGoE();
    console.table(rows);
    await addActivityRowsToAirtable(rows);
}

async function downloadTotalKWHChargedFromGoE() {
    const rows = await Promise.all(Object.entries(CHARGERS).map(async ([Charger, cloudToken]) => {
        const result = await fetch(`https://api.go-e.co/api_status?token=${cloudToken}`, {
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const { success, data, ...rest } = await result.json();
        if (!success) {
            console.error(rest);
            throw new Error("Could not get Data from Charger")
        }
        return {
            "Date": toISO8601String(new Date()),
            Charger,
            kWH: parseInt(data.eto) / 10
        }
    }));

    return rows;
}

async function addActivityRowsToAirtable(records) {
    try {
        const result = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`, {
            method: "POST",
            timeout: 5000,
            headers: {
                "Authorization": `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                records: records.map(record => ({ fields: record }))
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

main().then((fullfilled) => process.exit(fullfilled ? 0 : 1))
