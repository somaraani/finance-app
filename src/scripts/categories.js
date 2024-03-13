import fs from 'fs';
import csv from 'csv-parser';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('Missing database url in .env');
}

// Connect to the database
const sql = postgres(process.env.DATABASE_URL);

/**
 * @param {string} str
 */
function parsePlaidName(str) {
    return str.toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

async function importCategories() {
    /**
     * @type {any[]}
     */
    const plaidCategories = [];

    /**
     * @type {any}
     */
    const added = {};

    // Parse the CSV file
    fs.createReadStream('./src/assets/plaid-categories.csv')
        .pipe(csv())
        .on('data', (data) => plaidCategories.push(data))
        .on('end', async () => {
            // Insert data into the database
            let lastId = 0;

            for (const plaidCategory of plaidCategories) {
                if(!added[plaidCategory['PRIMARY']]){
                    const result = await sql`
                        INSERT INTO finance.categories (name, plaid_category, description)
                        VALUES (${parsePlaidName(plaidCategory['PRIMARY'])}, ${plaidCategory['PRIMARY']}, ${plaidCategory['DESCRIPTION']})
                        ON CONFLICT (name) DO NOTHING
                        RETURNING id
                    `;

                    lastId = result[0].id;
                }


                const name = parsePlaidName(plaidCategory['DETAILED'].replace(plaidCategory['PRIMARY'] + '_', '')); 
                console.log(lastId, name)

                await sql`
                    INSERT INTO finance.subcategories (name, plaid_category, description, parent)
                    VALUES (${name}, ${plaidCategory['DETAILED']}, ${plaidCategory['DESCRIPTION']}, ${lastId})
                `
              
                added[plaidCategory['PRIMARY']] = true;
            }

            console.log('Import complete.');
            process.exit(0);
        });
}

importCategories();