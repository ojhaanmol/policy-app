class MongoGetPolicyByUserNameGateway {

    constructor({ UserModel, PolicyModel }) {

        this.UserModel = UserModel;
        this.PolicyModel = PolicyModel;
    
    }

    async execute(userName) {
        try {
            const user = await this.UserModel.findOne({
                firstName: userName
            }).lean();

            if (!user)
                return [];

            const policies = await this.PolicyModel.find({
                userId: user._id
            }).lean();

            return policies.map(policy => ({
                policyNumber: policy.policyNumber,
                policyStartDate: policy.policyStartDate,
                policyEndDate: policy.policyEndDate,
                policyCategoryCollectionId: policy.policyCategoryCollectionId,
                companyCollectionId: policy.companyCollectionId,
                userId: String(policy.userId)
            }));

        } catch (error) {
            throw error;
        }
    }
}

module.exports = { MongoGetPolicyByUserNameGateway };
