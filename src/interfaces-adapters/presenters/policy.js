
class PoliciesPresenters{

    static presentPolicies(policies=[]){
        return {
            policies: policies.map(policy=>({

                policyEndDate: new Date(policy.policyEndDate).toISOString().split('T')[0],
                userId: policy.userId,
                companyCollectionId: policy.companyCollectionId,
                policyCategoryCollectionId: policy.policyCategoryCollectionId,
                policyNumber: policy.policyNumber,
                policyStartDate: new Date(policy.policyStartDate).toISOString().split('T')[0]

            }))
        };
    }

    static presentPoliciesAggrigatedByUsers( aggrigations=[] ){
        return {
            aggrigations: aggrigations.map( aggrigation=> ({

                userId:aggrigation.userId,
                totalPremium:aggrigation.totalPremium,
                totalPolicies:aggrigation.totalPolicies,
                expiredPolicies:aggrigation.expiredPolicies,
                activePolicies: aggrigation.activePolicies

            }))
        }
    }
}

module.exports= { PoliciesPresenters }