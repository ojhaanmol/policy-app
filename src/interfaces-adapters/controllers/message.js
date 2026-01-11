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

const { PushDataToPool, PushDataToPoolError }= require("../../usecase/pushDataToPool");

class ScheduleMessageController {

    constructor({ processData }) {
        this.pushDataToPoolUseCase = new PushDataToPool( { processData } )
    }

    /**@type { ControllerFunction }*/
    async schedule(request, response) {
        try {
            const { message, date, time } = request.body;

            await this.pushDataToPoolUseCase.execute({
                message,
                date,
                time
            });

            response
            .status(202)
            .json({
                status: 'SCHEDULED',
                message,
                date,
                time
            })

        } catch (error) {console.error(error.cause)

            if(error instanceof PushDataToPoolError)
                response
                .status(504)
                .json({ message: error.message })

        }
    }
}

module.exports = { ScheduleMessageController };
