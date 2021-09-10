const mongoose = require('mongoose')

//services
const logger = require('../services/logger')

class HealthService {
    _mongo() {
        switch (mongoose.connection.readyState) {
            case 0: // disconnected
                return { healthy: false, message: 'disconnected' }
            case 1: // connected
                return { healthy: true, message: 'connected' }
            case 2: // connecting
                return { healthy: false, message: 'connecting' }
            case 3: // disconnecting
                return { healthy: false, message: 'disconnecting' }
            default: // unknown status
                return { healthy: false, message: 'status unknown' }
        }
    }

    healthy() {
        const checks = ["mongo"];
        const failed = [];

        for (const check of checks) {
            const res = this[`_${check}`]()

            if (!res.healthy) {
                failed.push({ name: check, message: res.message });
            }
        }

        if (failed.length > 0) {
            logger.warn({ failed }, `failed ${failed.length} health checks`)
            return false
        }

        return true;
    }
}


module.exports = new HealthService()
