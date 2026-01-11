async function startInMemoryToMongoWorker({
    messagePool,
    MessageModel,
    intervalMs = 1000
}) {
    console.log('InMemory → Mongo Worker started');

    setInterval(async () => {
        try {
            const now = Date.now();

            const due = messagePool.getDueMessages(now);

            for (const msg of due) {
                await MessageModel.create({
                    message: msg.message,
                    scheduledAt: new Date(msg.timestamp)
                });

                messagePool.markDelivered(msg.id);

                console.log('Persisted to Mongo:', msg.message);
            }
        } catch (error) {
            console.error('InMemory → Mongo worker error:', error);
        }
    }, intervalMs);
}

module.exports = { startInMemoryToMongoWorker };
