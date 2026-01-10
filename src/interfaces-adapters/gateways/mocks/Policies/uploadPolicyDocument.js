
class CsvIngestionWorker {
    async run(filePath) {
        throw new Error('Not implemented');
    }
}

class SuccessfulCsvWorkerMock {
    async run(filePath) {
        return;
    }
}

class FailingCsvWorkerMock {
    async run(filePath) {
        throw new Error('Worker thread crashed');
    }
}

module.exports= {
    CsvIngestionWorker,
    SuccessfulCsvWorkerMock,
    FailingCsvWorkerMock
}