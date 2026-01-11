class InMemoryPushDataGateway {
    constructor({ messagePool }) {
        this.messagePool = messagePool;
    }

    async processData(message, timestamp) {
        this.messagePool.add(message, timestamp);
    }
}

module.exports = { InMemoryPushDataGateway };
