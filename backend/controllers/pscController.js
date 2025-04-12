const PSC = require("../models/pscModel");
const fs = require("fs");
const csvParser = require("csv-parser");

exports.getAllPSC = async (req, res) => {
    const psc = await PSC.find({});
    
    res.status(200).json(psc);
};

async function initPSC() {
    await PSC.deleteMany({});

    const csvToSchemaMapping = {
        'OBEC': 'city',
        'OKRES': 'region',
        'PSC': 'postalCode'
    };
    
    // fs.createReadStream('./data/OBCE_edit.csv')
    fs.createReadStream('./data/obce-mesta-edit.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            const pscData = {};
            for (const [csvKey, schemaKey] of Object.entries(csvToSchemaMapping)) {
                pscData[schemaKey] = row[csvKey];
            }
            const psc = new PSC(pscData);
            psc.save()
                .then(() => console.log("Product saved:", row))
                .catch(err => console.log("Error saving product:", err.message));
        })
        .on('end', () => {
            console.log("Data has been inserted successfully.");
        }
    );
}

// initPSC().catch(err => console.error(err));