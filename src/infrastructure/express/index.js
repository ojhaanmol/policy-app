const express = require('express');
const morgan = require('morgan');

const multer= require('multer')
const path= require('path')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/.volumes/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});


const upload = multer({ storage });

function createApp({policyController, scheduleMessageController}) {

    const app = express();

    app.use(express.json());

    app.use(morgan('dev'));

    app.get(
        '/v1/policies/by-username',
        policyController.getPolicyByUserName.bind(policyController)
    );

    app.get(
        '/v1/policies/aggregated-by-user',
        policyController.getAggrigatedPolicyByUser.bind(policyController)
    );

    app.post(
        '/v1/policies/upload',
        upload.single('file'),
        policyController.uploadPolicyDocument.bind(policyController)
    );

    app.post(
        '/v1/messages/schedule',
        express.json(),
        scheduleMessageController.schedule.bind(scheduleMessageController)
    );


    app.get('/health', (_, res) => {
        res.json({ status: 'ok' });
    });

    app.use((err, req, res, next) => {
        console.error(err);

        res.status(500).json({
            error: 'Internal Server Error'
        });
    });

    return app;
}

module.exports = { createApp };
