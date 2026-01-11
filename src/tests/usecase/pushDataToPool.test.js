const {
    PushDataToPool,
    PushDataToPoolError
} = require('../../usecase/pushDataToPool');

const {
    FailingPushDataGatewayMock,
    SpyPushDataGatewayMock
} = require('../../interfaces-adapters/gateways/mocks/Messages/pushToSchedulerPool');

describe('PushDataToPool – Use Case', () => {

    test('sends message and timestamp to gateway', async () => {
        const spy = new SpyPushDataGatewayMock();

        const usecase = new PushDataToPool({
            processData: spy.processData.bind(spy)
        });

        await usecase.execute({
            message: 'Hello World',
            date: '2099-01-01',
            time: '10:00'
        });

        expect(spy.calls.length).toBe(1);
        expect(spy.calls[0].message).toBe('Hello World');
        expect(typeof spy.calls[0].timestamp).toBe('number');
    });

    test('wraps gateway error in PushDataToPoolError', async () => {
        const gateway = new FailingPushDataGatewayMock();

        const usecase = new PushDataToPool({
            processData: gateway.processData.bind(gateway)
        });

        await expect(
            usecase.execute({
                message: 'Hi',
                date: '2099-01-01',
                time: '10:00'
            })
        ).rejects.toBeInstanceOf(PushDataToPoolError);
    });

    test('invalid date throws before hitting gateway', async () => {
        const spy = new SpyPushDataGatewayMock();

        const usecase = new PushDataToPool({
            processData: spy.processData.bind(spy)
        });

        await expect(
            usecase.execute({
                message: 'Hi',
                date: '2020-01-01', // past date
                time: '10:00'
            })
        ).rejects.toThrow();

        expect(spy.calls.length).toBe(0);
    });

});
