
class ValidPushDataGatewayMock {
    async processData(message, timestamp) {
        return;
    }
}

class FailingPushDataGatewayMock {
    async processData(message, timestamp) {
        throw new Error('Redis / Queue down');
    }
}

class InvalidPushDataGatewayMock {
    async processData(message, timestamp) {
        if (typeof message !== 'string') {
            throw new Error('Invalid message type');
        }

        if (typeof timestamp !== 'number') {
            throw new Error('Invalid timestamp');
        }
    }
}

class SpyPushDataGatewayMock {
    constructor() {
        this.calls = [];
    }

    async processData(message, timestamp) {
        this.calls.push({ message, timestamp });
    }
}

module.exports= {
    ValidPushDataGatewayMock,
    FailingPushDataGatewayMock,
    InvalidPushDataGatewayMock,
    SpyPushDataGatewayMock,

}