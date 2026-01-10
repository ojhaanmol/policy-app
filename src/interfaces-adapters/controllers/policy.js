/**
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @typedef {(
 *   request: Request,
 *   response: Response
 * ) => Promise<void>} ControllerFunction
 */

const { PoliciesPresenters }= require("../presenters/policy")

const { PolicyHandler, PolicyHandlerError } = require("../../usecase/getPolicyByUserName");
const { PoliciesAggregatedByUserError, PoliciesAggregatedByUserHandler } = require("../../usecase/policiesAggregatedByUser");
const { UploadPolicyDocumentError, UploadPolicyDocumentUseCase}= require("../../usecase/uploadPolicyDocument");


class Policy{
    constructor(
        {
            getPolicyByUserNameGateway,
            policiesAggregatedByUserGateway,
            csvIngestionWorker
        }
    ){
        this.policyHandler= new PolicyHandler({
            getPolicyByUserNameGateway
        });

        this.policiesAggregatedByUser= new PoliciesAggregatedByUserHandler({
            policiesAggregatedByUserGateway
        });

        this.UploadPolicyDocumentUseCase= new UploadPolicyDocumentUseCase({
            csvIngestionWorker
        });

    }

    /**@type { ControllerFunction }*/
    async getPolicyByUserName(request, response){
        try {

            const { username }= request.query;

            const policies= await this.policyHandler.getPolicyByUserName( username );

            response.status(200).json( PoliciesPresenters.presentPolicies( policies ) );
        
        } catch (error) {
            
            if( error instanceof PolicyHandlerError && error.errorCode === 'PGE')
                response
                .json({ message: error.message })
                .sendStatus( 504 );

        }
    }

    /**@type { ControllerFunction }*/
    async getAggrigatedPolicyByUser(request, response){
        try {

            const aggrigations= await this.policiesAggregatedByUser.execute();

            response
            .json( PoliciesPresenters.presentPoliciesAggrigatedByUsers( aggrigations ) )
            .sendStatus(200);
            
        } catch (error) {

            if( error instanceof PoliciesAggregatedByUserError && error.errorCode === 'PAU')
                response
                .json({ message: error.message })
                .sendStatus( 504 );

        }
    }

    /**@type { ControllerFunction }*/
    async uploadPolicyDocument(request, response){
        try {
           const file = request.file;

            if (!file)
                response.json({
                    message: 'File is required'
                }).sendStatus(400);

            else {

                const result = await this.UploadPolicyDocumentUseCase.execute({
                    filePath: file.path,
                    originalName: file.originalname
                });

                response.json(result).sendStatus(202);

            }
        } catch (error) {

            if( error instanceof UploadPolicyDocumentError && error.errorCode === 'UPL')
                response.json( { message: error.message } ).sendStatus(504);

        }
    }
}


module.exports= {
    Policy,
}