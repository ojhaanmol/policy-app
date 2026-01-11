const pidusage = require('pidusage');

const CPU_LIMIT = 70;
const CHECK_INTERVAL = 1000;

function startCpuGuard() {
    console.log('🛡️ CPU guard started');

    setInterval(async () => {
        try {
            const stats = await pidusage(process.pid);
            const cpu = stats.cpu;

            if (cpu >= CPU_LIMIT) {
                console.error(`High CPU ${cpu.toFixed(2)}%`);
                console.error('CPU limit exceeded — shutting down');
                process.exit(1);
            }

        } catch (err) {
            console.error('CPU monitor error:', err.message);
        }
    }, CHECK_INTERVAL);
}

module.exports = { startCpuGuard };
