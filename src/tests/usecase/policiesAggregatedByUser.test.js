const {
    AggregatedPolicyByUserEntity,
    PoliciesAggregatedByUserHandler,
    PoliciesAggregatedByUserError,
}= require("../../usecase/policiesAggregatedByUser");
const {
    ValidAggregatedPolicyGatewayMock,
    EmptyAggregatedPolicyGatewayMock,
    CorruptAggregatedPolicyGatewayMock,
    InvalidContractAggregatedPolicyGatewayMock,
    FailingAggregatedPolicyGatewayMock,
}= require("../../interfaces-adapters/gateways/mocks/Policies/aggrigationByUser")
describe('PoliciesAggregatedByUserHandler', () => {

    test('returns aggregated policy entities for valid data', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new ValidAggregatedPolicyGatewayMock().execute
        });

        const result = await handler.execute();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(2);

        expect(result[0]).toBeInstanceOf(AggregatedPolicyByUserEntity);
        expect(result[0].userId).toBe('USER-1');
        expect(result[0].totalPolicies).toBe(3);
    });

    test('returns empty array when no aggregated data exists', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new EmptyAggregatedPolicyGatewayMock().execute
        });

        const result = await handler.execute();

        expect(result).toEqual([]);
    });

    test('throws when aggregated data is corrupt', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new CorruptAggregatedPolicyGatewayMock().execute
        });

        await expect(
            handler.execute()
        ).rejects.toThrow();
    });

    test('throws when gateway violates contract (non-array)', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new InvalidContractAggregatedPolicyGatewayMock().execute
        });

        await expect(
            handler.execute()
        ).rejects.toThrow();
    });

    test('wraps infrastructure errors into PoliciesAggregatedByUserError', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new FailingAggregatedPolicyGatewayMock().execute
        });

        await expect(
            handler.execute()
        ).rejects.toBeInstanceOf(PoliciesAggregatedByUserError);
    });

    test('preserves root cause in PoliciesAggregatedByUserError', async () => {
        const handler = new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway: new FailingAggregatedPolicyGatewayMock().execute
        });

        try {
            await handler.execute();
        } catch (err) {
            expect(err.errorCode).toBe('PAU');
            expect(err.cause).toBeInstanceOf(Error);
            expect(err.cause.message).toContain('Mongo');
        }
    });

});
