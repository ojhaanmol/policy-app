require('dotenv').config();

const { createApp } = require('./express');
const { connectDb } = require('./mongodb/connection');
const path = require('path');

const { Policy } = require('../interfaces-adapters/controllers/policy');

const {
    MongoGetPolicyByUserNameGateway
} = require('../interfaces-adapters/gateways/database/mongodb/policies/getPoliciesByUserName');

const {
    MongoPoliciesAggregatedByUserGateway
} = require('../interfaces-adapters/gateways/database/mongodb/policies/aggrigationByUser');

const {
    WorkerThreadCsvIngestion
} = require('../interfaces-adapters/gateways/worker_threads/uploadPolicyDocument');

const User = require('./mongodb/models/User');
const PolicyModel = require('./mongodb/models/Policy');

async function startServer() {
    try {

        await connectDb();

        const getPolicyByUserNameGateway =
            new MongoGetPolicyByUserNameGateway({
                UserModel: User,
                PolicyModel
            });

        const policiesAggregatedByUserGateway =
            new MongoPoliciesAggregatedByUserGateway({
                PolicyModel
            });
        
        const csvIngestionWorker =
            new WorkerThreadCsvIngestion({
                workerLocation: path.resolve(__dirname, './worker_threads/index')
            });

        const policyController = new Policy({
            getPolicyByUserNameGateway: ()=>getPolicyByUserNameGateway.execute(),
            policiesAggregatedByUserGateway: ()=>policiesAggregatedByUserGateway.execute(),
            csvIngestionWorker
        });
        
        const app = createApp({policyController});

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
