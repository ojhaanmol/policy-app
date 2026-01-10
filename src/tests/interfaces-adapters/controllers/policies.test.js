const { Policy,  } = require('../../../interfaces-adapters/controllers/policy');
const { PoliciesPresenters }= require("../../../interfaces-adapters/presenters/policy")
const { PolicyHandlerError } = require('../../../usecase/getPolicyByUserName');
const {
    ValidPolicyGatewayMock,
    FailingPolicyGatewayMock 
}= require("../../../interfaces-adapters/gateways/mocks/Policies");

function createRes() {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        sendStatus: jest.fn()
    };
}
describe('Policy Controller – getPolicyByUserName', () => {

    const mockGateway = {
        execute: jest.fn()
    };

    afterEach(() => {
        jest.clearAllMocks();
    });


    test('returns 200 and presented policies on success', async () => {
        mockGateway.execute.mockResolvedValue([
            {
                policyNumber: 'PN-1',
                policyStartDate: '2024-01-01',
                policyEndDate: '2025-01-01',
                policyCategoryCollectionId: 'LOB-1',
                companyCollectionId: 'COMP-1',
                userId: 'USER-1'
            }
        ]);

        const gateway= new ValidPolicyGatewayMock().execute
        const controller = new Policy({
            getPolicyByUserNameGateway: gateway
        });

        const req = { query: { username: 'john' } };
        const res = createRes();
        const next = jest.fn();

        await controller.getPolicyByUserName(req, res, next);

        const policiesPresent= PoliciesPresenters.presentPolicies( await gateway() );

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith( policiesPresent );
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 504 when PolicyHandlerError(PGE) occurs', async () => {
        mockGateway.execute.mockRejectedValue(
            new PolicyHandlerError(
                'Gateway failure',
                'PGE',
                new Error('DB timeout')
            )
        );

        const controller = new Policy({
            getPolicyByUserNameGateway: new FailingPolicyGatewayMock().execute
        });

        const req = { query: { username: 'john' } };
        const res = createRes();
        const next = jest.fn();

        await controller.getPolicyByUserName(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(504);
        expect(res.json).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

});

const { ValidAggregatedPolicyGatewayMock } = require("../../../interfaces-adapters/gateways/mocks/Policies/aggrigationByUser");
const { PoliciesAggregatedByUserError } = require("../../../usecase/policiesAggregatedByUser");

describe('Policy Controller – getAggregatedPolicyByUser', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns 200 with aggregated policies', async () => {
        const aggregatedGateway = {
            execute: jest.fn().mockResolvedValue([
                {
                    userId: 'USER-1',
                    totalPremium: 4500,
                    totalPolicies: 3,
                    activePolicies: 2,
                    expiredPolicies: 1
                },
                {
                    userId: 'USER-2',
                    totalPremium: 1200,
                    totalPolicies: 1,
                    activePolicies: 1,
                    expiredPolicies: 0
                }
            ])
        };

        const controller = new Policy({
            getPolicyByUserNameGateway: { execute: jest.fn() },
            policiesAggregatedByUserGateway: new ValidAggregatedPolicyGatewayMock().execute
        });

        const aggrigationCompare= await new ValidAggregatedPolicyGatewayMock().execute()

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await controller.getAggrigatedPolicyByUser(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            PoliciesPresenters.presentPoliciesAggrigatedByUsers( aggrigationCompare )
        );

        expect(next).not.toHaveBeenCalled();
    });

    test('returns 504 when PoliciesAggregatedByUserError (PAU) occurs', async () => {
        const aggregatedGateway = {
            execute: jest.fn().mockRejectedValue(
                new PoliciesAggregatedByUserError(
                    'Aggregation failed',
                    'PAU',
                    new Error('Mongo error')
                )
            )
        };

        const controller = new Policy({
            getPolicyByUserNameGateway: { execute: jest.fn() },
            policiesAggregatedByUserGateway: aggregatedGateway.execute
        });

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await controller.getAggrigatedPolicyByUser(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(504);
        expect(res.json).toHaveBeenCalledWith({
            message: 'AGGREGATION ERROR: unable to aggregate policies by user',
        });

        expect(next).not.toHaveBeenCalled();
    });

});

const { UploadPolicyDocumentError }= require("../../../usecase/uploadPolicyDocument")
describe('Policy Controller – uploadPolicyDocument', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('returns 400 when file is missing', async () => {
        const controller = new Policy({
            getPolicyByUserNameGateway: {},
            policiesAggregatedByUserGateway: {},
            csvIngestionWorker: {}
        });

        const req = {};
        const res = createRes();
        const next = jest.fn();

        await controller.uploadPolicyDocument(req, res, next);

        expect(res.sendStatus).toHaveBeenCalledWith(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 202 when file is uploaded successfully', async () => {
        const mockExecute = jest.fn().mockResolvedValue({
            status: 'ACCEPTED',
            file: 'policies.csv'
        });

        const controller = new Policy({
            getPolicyByUserNameGateway: {},
            policiesAggregatedByUserGateway: {},
            csvIngestionWorker: {
                run: jest.fn()
            }
        });

        controller.UploadPolicyDocumentUseCase.execute = mockExecute;

        const req = {
            file: {
                path: '/tmp/policies.csv',
                originalname: 'policies.csv'
            }
        };

        const res = createRes();
        const next = jest.fn();

        await controller.uploadPolicyDocument(req, res, next);

        expect(mockExecute).toHaveBeenCalledWith({
            filePath: '/tmp/policies.csv',
            originalName: 'policies.csv'
        });

        expect(res.json).toHaveBeenCalledWith({
            status: 'ACCEPTED',
            file: 'policies.csv'
        });

        expect(res.sendStatus).toHaveBeenCalledWith(202);
        expect(next).not.toHaveBeenCalled();
    });

    test('returns 504 when UploadPolicyDocumentError (UPL) occurs', async () => {
        const uplError = new UploadPolicyDocumentError(
            'Upload failed',
            'UPL',
            new Error('Worker crashed')
        );

        const controller = new Policy({
            getPolicyByUserNameGateway: {},
            policiesAggregatedByUserGateway: {},
            csvIngestionWorker: {}
        });

        controller.UploadPolicyDocumentUseCase.execute =
            jest.fn().mockRejectedValue(uplError);

        const req = {
            file: {
                path: '/tmp/policies.csv',
                originalname: 'policies.csv'
            }
        };

        const res = createRes();
        const next = jest.fn();

        await controller.uploadPolicyDocument(req, res, next);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Upload failed'
        });

        expect(res.sendStatus).toHaveBeenCalledWith(504);
        expect(next).not.toHaveBeenCalled();
    });

});
