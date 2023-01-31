const CHARGERS = JSON.parse(process.env.CHARGERS);

export async function getTotalKWHCharged() {
    const rows = await Promise.all(Object.entries(CHARGERS).map(async ([charger, cloudToken]) => {
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
            date: new Date(),
            charger,
            kwh: parseInt(data.eto) / 10
        }
    }));

    return rows;
}