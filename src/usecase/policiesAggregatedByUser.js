class AggregatedPolicyByUserEntity {
    constructor(entity) {
        if (!entity || typeof entity !== 'object') {
            throw new Error('AGGREGATE ENTITY ERROR: invalid entity');
        }

        this.userId = AggregatedPolicyByUserEntity.validateString(
            entity.userId,
            'userId'
        );

        this.totalPolicies = AggregatedPolicyByUserEntity.validateNumber(
            entity.totalPolicies,
            'totalPolicies'
        );

        this.totalPremium = AggregatedPolicyByUserEntity.validateNumber(
            entity.totalPremium,
            'totalPremium'
        );

        this.activePolicies = AggregatedPolicyByUserEntity.validateNumber(
            entity.activePolicies,
            'activePolicies'
        );

        this.expiredPolicies = AggregatedPolicyByUserEntity.validateNumber(
            entity.expiredPolicies,
            'expiredPolicies'
        );
    }

    static validateString(value, fieldName) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(
                `AGGREGATE ENTITY ERROR: ${fieldName} must be a non-empty string`
            );
        }
        return value.trim();
    }

    static validateNumber(value, fieldName) {
        if (typeof value !== 'number' || value < 0) {
            throw new Error(
                `AGGREGATE ENTITY ERROR: ${fieldName} must be a non-negative number`
            );
        }
        return value;
    }
}

class PoliciesAggregatedByUserHandler {
    constructor({ policiesAggregatedByUserGateway }) {
        this.policiesAggregatedByUserGateway =
            policiesAggregatedByUserGateway;
    }

    async execute() {
        try {
            const rawAggregates =
                await this.policiesAggregatedByUserGateway();

            if (!Array.isArray(rawAggregates)) {
                throw new Error(
                    'GATEWAY CONTRACT ERROR: expected array of aggregates'
                );
            }

            return rawAggregates.map(
                item => new AggregatedPolicyByUserEntity(item)
            );

        } catch (error) {
            throw new PoliciesAggregatedByUserError(
                'AGGREGATION ERROR: unable to aggregate policies by user',
                'PAU',
                error
            );
        }
    }
}

class PoliciesAggregatedByUserError extends Error {
    constructor(message, errorCode, cause) {
        super(message);
        this.name = 'PoliciesAggregatedByUserError';
        this.errorCode = errorCode;
        this.cause = cause;
    }
}

module.exports= {
    AggregatedPolicyByUserEntity,
    PoliciesAggregatedByUserHandler,
    PoliciesAggregatedByUserError,
}