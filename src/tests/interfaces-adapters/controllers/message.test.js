const { ScheduleMessageController } = require('../../../interfaces-adapters/controllers/message');

const { PushDataToPoolError } = require('../../../usecase/pushDataToPool');

const { SpyPushDataGatewayMock, FailingPushDataGatewayMock
} = require('../../../interfaces-adapters/gateways/mocks/Messages/pushToSchedulerPool');

function createMockResponse() {
    const res = {};
    res.json = jest.fn().mockReturnThis();
    res.sendStatus = jest.fn();
    res.status = jest.fn().mockReturnThis();
    return res;
}

describe('ScheduleMessageController', () => {

    test('schedules a message and returns 202', async () => {
        const spyGateway = new SpyPushDataGatewayMock();

        const controller = new ScheduleMessageController({
            processData: spyGateway.processData.bind(spyGateway)
        });

        const req = {
            body: {
                message: 'Hello',
                date: '2099-01-01',
                time: '10:00'
            }
        };

        const res = createMockResponse();

        await controller.schedule(req, res);

        expect(spyGateway.calls.length).toBe(1);
        expect(spyGateway.calls[0].message).toBe('Hello');
        expect(typeof spyGateway.calls[0].timestamp).toBe('number');


        expect(res.json).toHaveBeenCalledWith({
            status: 'SCHEDULED',
            message: 'Hello',
            date: '2099-01-01',
            time: '10:00'
        });

        expect(res.status).toHaveBeenCalledWith(202);
    });

    test('returns error message on PushDataToPoolError', async () => {

        const failingGateway = new FailingPushDataGatewayMock();

        const controller = new ScheduleMessageController({
            processData: failingGateway.processData.bind(failingGateway)
        });

        const req = {
            body: {
                message: 'Hello',
                date: '2099-01-01',
                time: '10:00'
            }
        };

        const res = createMockResponse();

        await controller.schedule(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: expect.stringContaining('PUSH DATA TO POOL ERROR')
        });

        expect(res.status).toHaveBeenCalledWith(504);
    });


});