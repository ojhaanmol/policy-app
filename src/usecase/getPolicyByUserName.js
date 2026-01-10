
class PolicyHandler{
    constructor({getPolicyByUserNameGateway}){
        this.getPolicyByUserNameGateway= getPolicyByUserNameGateway;
    }

    async getPolicyByUserName(userName){

        return await this.getPolicyByUserNameGatewayWrapper( new UserNameEntity( userName ) )
    
    }

    async getPolicyByUserNameGatewayWrapper(user=new UserNameEntity()){
        try {
            const policies= await this.getPolicyByUserNameGateway(user.userName);

            if( !Array.isArray(policies) )
                throw new Error('GATEWAY CONTRACT ERROR: expected an array of policies');
            
            return policies.map( policy=> new PolicyEntity(policy) );
        } catch (error) {
            throw new PolicyHandlerError('POLICY GATEWAY ERROR: unable to fetch policy.', 'PGE', error);
        }
    }
}

class PolicyHandlerError extends Error{
    constructor(message, errorCode, cause){
        super(message);
        this.errorCode= errorCode;
        this.cause= cause;
    }
}

class UserNameEntity{
    constructor(userName){
        if(typeof userName !== 'string')
            throw new Error('USECASE ERROR: userName must bew a string');
        this.userName= String(userName);
    }
}

class PolicyEntity {
    constructor(entity) {
        if (!entity || typeof entity !== 'object') {
            throw new Error('POLICY ENTITY ERROR: entity must be an object');
        }

        this.policyNumber = PolicyEntity.validateString(
            entity.policyNumber,
            'policyNumber'
        );

        this.policyCategoryCollectionId = PolicyEntity.validateString(
            entity.policyCategoryCollectionId,
            'policyCategoryCollectionId'
        );

        this.companyCollectionId = PolicyEntity.validateString(
            entity.companyCollectionId,
            'companyCollectionId'
        );

        this.userId = PolicyEntity.validateString(
            entity.userId,
            'userId'
        );

        this.policyStartDate = PolicyEntity.validateDate(
            entity.policyStartDate,
            'policyStartDate'
        );

        this.policyEndDate = PolicyEntity.validateDate(
            entity.policyEndDate,
            'policyEndDate'
        );

        if (this.policyStartDate >= this.policyEndDate) {
            throw new Error(
                'POLICY ENTITY ERROR: policyStartDate must be before policyEndDate'
            );
        }
    }

    static validateString(value, fieldName) {
        if (typeof value !== 'string' || !value.trim()) {
            throw new Error(
                `POLICY ENTITY ERROR: ${fieldName} must be a non-empty string`
            );
        }
        return value.trim();
    }

    static validateDate(value, fieldName) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new Error(
                `POLICY ENTITY ERROR: ${fieldName} must be a valid date`
            );
        }
        return date;
    }
}


module.exports= {

    PolicyEntity,
    PolicyHandler,
    PolicyHandlerError,
    UserNameEntity,
}