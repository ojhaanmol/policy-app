class MongoPoliciesAggregatedByUserGateway {
    constructor({ PolicyModel }) {
        this.PolicyModel = PolicyModel;
    }

    async execute() {
        try {
            const now = new Date();

            const results = await this.PolicyModel.aggregate([
                {
                    $group: {
                        _id: '$userId',
                        totalPolicies: { $sum: 1 },
                        totalPremium: { $sum: '$premium_amount' },
                        activePolicies: {
                            $sum: {
                                $cond: [
                                    { $gte: ['$policy_end_date', now] },
                                    1,
                                    0
                                ]
                            }
                        },
                        expiredPolicies: {
                            $sum: {
                                $cond: [
                                    { $lt: ['$policy_end_date', now] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        userId: { $toString: '$_id' },
                        totalPolicies: 1,
                        totalPremium: 1,
                        activePolicies: 1,
                        expiredPolicies: 1
                    }
                }
            ]);

            return Array.isArray(results) ? results : [];

        } catch (error) {
            throw error;
        }
    }
}

module.exports = { MongoPoliciesAggregatedByUserGateway };
