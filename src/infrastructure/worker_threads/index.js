const { workerData, parentPort } = require('worker_threads');
const fs = require('fs');
const csv = require('csv-parser');
const { connectDb }= require('../mongodb/connection');

const User = require('../mongodb/models/User');
const Policy = require('../mongodb/models/Policy');
const Carrier = require('../mongodb/models/Carrier');
const LOB = require('../mongodb/models/LOB');

async function processCsv(filePath) {

    const stream = fs.createReadStream(filePath);

    const csvStream= stream.pipe(csv())

    for await (row of csvStream) try {

        const user = await User.findOneAndUpdate(
            { email: row.email },
            { firstName: row.firstname },
            { upsert: true, new: true }
        );

        const lob = await LOB.findOneAndUpdate(
            { categoryName: row.category_name },
            {},
            { upsert: true, new: true }
        );

        const carrier = await Carrier.findOneAndUpdate(
            { companyName: row.company_name },
            {},
            { upsert: true, new: true }
        );

        await Policy.create({
            policyNumber: row.policy_number,
            policyStartDate: new Date(row.policy_start_date),
            policyEndDate: new Date(row.policy_end_date),
            policyCategoryCollectionId: lob._id,
            companyCollectionId: carrier._id,
            userId: user._id
        });

    } catch (err) {console.error(err)
        stream.destroy();
    }

}

(async () => {
    try {
        const { filePath } = workerData;

        await connectDb();
        await processCsv(filePath);

        parentPort.postMessage({ status: 'SUCCESS' });
        process.exit(0);

    } catch (error) {
        parentPort.postMessage({
            status: 'ERROR',
            error: error.message
        });
        process.exit(1);
    }
})();
