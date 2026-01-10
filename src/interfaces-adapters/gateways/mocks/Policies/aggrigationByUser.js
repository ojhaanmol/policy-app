
class ValidAggregatedPolicyGatewayMock {
    async execute() {
        return [
            {
                userId: 'USER-1',
                totalPolicies: 3,
                totalPremium: 4500,
                activePolicies: 2,
                expiredPolicies: 1
            },
            {
                userId: 'USER-2',
                totalPolicies: 1,
                totalPremium: 1200,
                activePolicies: 1,
                expiredPolicies: 0
            }
        ];
    }
}

class EmptyAggregatedPolicyGatewayMock {
    async execute() {
        return [];
    }
}

class CorruptAggregatedPolicyGatewayMock {
    async execute() {
        return [
            {
                userId: 'USER-1',
                totalPolicies: -1,
                totalPremium: 4500,
                activePolicies: 2,
                expiredPolicies: 1
            }
        ];
    }
}

class InvalidContractAggregatedPolicyGatewayMock {
    async execute() {
        return { userId: 'USER-1' };
    }
}

class FailingAggregatedPolicyGatewayMock {
    async execute() {
        throw new Error('Mongo aggregation failed');
    }
}

module.exports= {
    ValidAggregatedPolicyGatewayMock,
    EmptyAggregatedPolicyGatewayMock,
    CorruptAggregatedPolicyGatewayMock,
    InvalidContractAggregatedPolicyGatewayMock,
    FailingAggregatedPolicyGatewayMock,

}