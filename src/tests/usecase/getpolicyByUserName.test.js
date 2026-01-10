const { PolicyHandler, PolicyEntity, PolicyHandlerError }= require('../../usecase/getPolicyByUserName');
const {
    ValidPolicyGatewayMock,
    EmptyPolicyGatewayMock,
    CorruptPolicyGatewayMock,
    FailingPolicyGatewayMock,
    InvalidContractGatewayMock,

}= require('../../interfaces-adapters/gateways/mocks/Policies')
describe('PolicyHandler – getPolicyByUserName', () => {

    test('returns PolicyEntity array for valid user', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new ValidPolicyGatewayMock().execute
        });

        const result = await handler.getPolicyByUserName('john');

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(PolicyEntity);
        expect(result[0].policyNumber).toBe('PN-001');
    });

    test('returns empty array when user has no policies', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new EmptyPolicyGatewayMock().execute
        });

        const result = await handler.getPolicyByUserName('john');

        expect(result).toEqual([]);
    });

    test('throws PolicyHandlerError when gateway fails', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new FailingPolicyGatewayMock()
        });

        await expect(
            handler.getPolicyByUserName('john')
        ).rejects.toBeInstanceOf(PolicyHandlerError);
    });

    test('preserves root cause in PolicyHandlerError', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new FailingPolicyGatewayMock().execute
        });

        try {
            await handler.getPolicyByUserName('john');
        } catch (err) {
            expect(err.errorCode).toBe('PGE');
            expect(err.cause).toBeInstanceOf(Error);
            expect(err.cause.message).toContain('MongoDB');
        }
    });

    test('throws when gateway returns corrupt policy data', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new CorruptPolicyGatewayMock().execute
        });

        await expect(
            handler.getPolicyByUserName('john')
        ).rejects.toThrow();
    });

    test('throws when gateway violates contract (non-array)', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new InvalidContractGatewayMock().execute
        });

        await expect(
            handler.getPolicyByUserName('john')
        ).rejects.toThrow();
    });

    test('throws when username is invalid', async () => {
        const handler = new PolicyHandler({
            getPolicyByUserNameGateway: new ValidPolicyGatewayMock().execute
        });

        await expect(
            handler.getPolicyByUserName(null)
        ).rejects.toThrow('USECASE ERROR');
    });

});
