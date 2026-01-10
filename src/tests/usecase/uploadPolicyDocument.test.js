const {
    UploadPolicyDocumentError,
    UploadPolicyDocumentUseCase
} = require('../../usecase/uploadPolicyDocument');

const {SuccessfulCsvWorkerMock, FailingCsvWorkerMock}
= require('../../interfaces-adapters/gateways/mocks/Policies/uploadPolicyDocument')

describe('UploadPolicyDocumentUseCase', () => {

    test('accepts valid payload and delegates to worker', async () => {
        const worker = new SuccessfulCsvWorkerMock();
        const useCase = new UploadPolicyDocumentUseCase({
            csvIngestionWorker: worker
        });

        const result = await useCase.execute({
            filePath: '/tmp/policies.csv',
            originalName: 'policies.csv'
        });

        expect(result).toEqual({
            status: 'ACCEPTED',
            file: 'policies.csv'
        });
    });

    test('throws when filePath is missing', async () => {
        const useCase = new UploadPolicyDocumentUseCase({
            csvIngestionWorker: new SuccessfulCsvWorkerMock()
        });

        await expect(
            useCase.execute({ originalName: 'policies.csv' })
        ).rejects.toThrow();
    });

    test('throws when filePath is empty', async () => {
        const useCase = new UploadPolicyDocumentUseCase({
            csvIngestionWorker: new SuccessfulCsvWorkerMock()
        });

        await expect(
            useCase.execute({ filePath: '   ' })
        ).rejects.toThrow();
    });

    test('wraps worker failure in UploadPolicyDocumentError', async () => {
        const useCase = new UploadPolicyDocumentUseCase({
            csvIngestionWorker: new FailingCsvWorkerMock()
        });

        await expect(
            useCase.execute({
                filePath: '/tmp/policies.csv',
                originalName: 'policies.csv'
            })
        ).rejects.toBeInstanceOf(UploadPolicyDocumentError);
    });

    test('preserves root cause when worker fails', async () => {
        const useCase = new UploadPolicyDocumentUseCase({
            csvIngestionWorker: new FailingCsvWorkerMock()
        });

        try {
            await useCase.execute({
                filePath: '/tmp/policies.csv',
                originalName: 'policies.csv'
            });
        } catch (err) {
            expect(err.errorCode).toBe('UPL');
            expect(err.cause).toBeInstanceOf(Error);
            expect(err.cause.message).toContain('Worker thread');
        }
    });

});
