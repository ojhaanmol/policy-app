
class ValidPolicyGatewayMock {
    async execute(userNameEntity) {
        return [
            {
                policyNumber: 'PN-001',
                policyStartDate: '2024-01-01',
                policyEndDate: '2025-01-01',
                policyCategoryCollectionId: 'LOB-123',
                companyCollectionId: 'COMP-456',
                userId: 'USER-789'
            }
        ];
    }
}

class EmptyPolicyGatewayMock {
    async execute(userNameEntity) {
        return [];
    }
}

class CorruptPolicyGatewayMock {
    async execute(userNameEntity) {
        return [
            {
                policyNumber: null,
                policyStartDate: null,
                policyCategoryCollectionId: 'LOB-123',
                companyCollectionId: 'COMP-456',
                userId: 'USER-789'
            }
        ];
    }
}

class FailingPolicyGatewayMock {
    async execute(userNameEntity) {
        throw new Error('ECONNREFUSED: MongoDB down');
    }
}

class InvalidContractGatewayMock {
    async execute(userNameEntity) {
        return { policyNumber: 'PN-001' };
    }
}

module.exports= {
    ValidPolicyGatewayMock,
    EmptyPolicyGatewayMock,
    CorruptPolicyGatewayMock,
    FailingPolicyGatewayMock,
    InvalidContractGatewayMock,

}