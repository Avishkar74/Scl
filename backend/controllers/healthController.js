// Health Controller - Corporate Pattern for Server Status Management
// Purpose: Handle all health check related business logic

/**
 * Corporate Health Controller
 * Responsible for server health monitoring and status reporting
 * Used by load balancers, monitoring tools, and DevOps teams
 */

// Get basic server health status
export const getHealthStatus = (req, res) => {
    try {
        // Corporate health check logic
        const healthData = {
            status: 'healthy',
            message: 'Server is running fine right now',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(), // Server uptime in seconds
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
                unit: 'MB'
            }
        };

        // Log health check request (corporate monitoring)
        console.log(`[HEALTH] Health check requested from IP: ${req.ip}`);

        // Return successful health status
        res.status(200).json(healthData);

    } catch (error) {
        // Handle health check errors (critical for monitoring)
        console.error('[HEALTH ERROR]:', error.message);
        
        res.status(503).json({
            status: 'unhealthy',
            message: 'Server experiencing issues',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Get detailed server metrics (for admin/monitoring)
export const getDetailedMetrics = (req, res) => {
    try {
        const metrics = {
            server: {
                nodeVersion: process.version,
                platform: process.platform,
                architecture: process.arch,
                uptime: {
                    seconds: process.uptime(),
                    human: formatUptime(process.uptime())
                }
            },
            memory: process.memoryUsage(),
            environment: {
                nodeEnv: process.env.NODE_ENV || 'development',
                port: process.env.PORT || 5000,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            timestamp: new Date().toISOString()
        };

        console.log(`[METRICS] Detailed metrics requested from IP: ${req.ip}`);
        res.status(200).json(metrics);

    } catch (error) {
        console.error('[METRICS ERROR]:', error.message);
        res.status(500).json({
            error: 'Failed to retrieve metrics',
            message: error.message
        });
    }
};

// Helper function to format uptime in human-readable format
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
};
