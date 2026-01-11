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

const { ScheduleMessageController } =
    require('../interfaces-adapters/controllers/message');

const User = require('./mongodb/models/User');
const PolicyModel = require('./mongodb/models/Policy');
const Message = require('./mongodb/models/Message');

const { startInMemoryToMongoWorker } =
    require('./inMemory/inMemoryToMongoWorker');

const { InMemoryMessagePool } = require('./inMemory/messagePool');

const { InMemoryPushDataGateway } = require('../interfaces-adapters/gateways/database/inMemory/pushDataGateway');

const { startCpuGuard } = require("./pidusage/cpuGuard");

startCpuGuard();

async function startServer() {
    try {
        
        await connectDb();
        
        const messagePool = new InMemoryMessagePool();
        
        const pushDataGateway = new InMemoryPushDataGateway({
            messagePool
        });

        startInMemoryToMongoWorker({
            messagePool,
            MessageModel: Message
        })
        
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

        const scheduleMessageController= new ScheduleMessageController({
            processData: pushDataGateway.processData.bind( pushDataGateway )
        });

        const app = createApp({policyController, scheduleMessageController});

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
