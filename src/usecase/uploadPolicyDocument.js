
class UploadPolicyDocumentRequest {
    constructor({ filePath, originalName }) {
        if (typeof filePath !== 'string' || !filePath.trim()) {
            throw new Error('UPLOAD USECASE ERROR: filePath is required');
        }

        this.filePath = filePath;
        this.originalName = originalName || 'unknown';
    }
}

class UploadPolicyDocumentError extends Error {
    constructor(message, errorCode, cause) {
        super(message);
        this.name = 'UploadPolicyDocumentError';
        this.errorCode = errorCode;
        this.cause = cause;
    }
}


class UploadPolicyDocumentUseCase {
    constructor({ csvIngestionWorker }) {
        this.csvIngestionWorker = csvIngestionWorker;
    }

    async execute(payload) {
        try {
            const request = new UploadPolicyDocumentRequest(payload);

            await this.csvIngestionWorker.run(request.filePath);

            return {
                status: 'ACCEPTED',
                file: request.originalName
            };

        } catch (error) {
            throw new UploadPolicyDocumentError(
                'UPLOAD ERROR: unable to process document',
                'UPL',
                error
            );
        }
    }
}

module.exports={
    UploadPolicyDocumentRequest,
    UploadPolicyDocumentError,
    UploadPolicyDocumentUseCase,
}