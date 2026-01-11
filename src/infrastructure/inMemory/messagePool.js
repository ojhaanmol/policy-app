class InMemoryMessagePool {
    constructor() {
        this.pool = [];
    }

    add(message, timestamp) {
        this.pool.push({
            id: crypto.randomUUID(),
            message,
            timestamp,
            createdAt: Date.now(),
            delivered: false
        });
    }

    getDueMessages(now = Date.now()) {
        return this.pool.filter(
            m => !m.delivered && m.timestamp <= now
        );
    }

    markDelivered(id) {
        const msg = this.pool.find(m => m.id === id);
        if (msg) msg.delivered = true;
    }

    getAll() {
        return this.pool;
    }
}

module.exports = { InMemoryMessagePool };
