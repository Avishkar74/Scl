// Modern Express.js Server - Corporate Level Implementation with Controllers
import express from 'express'; // ES6 module syntax for modern Node.js
import dotenv from 'dotenv'; // For environment variable management

// Import corporate route modules
import healthRoutes from './routes/healthRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Middleware - Parse JSON requests (essential for APIs)
app.use(express.json()); // Replaces body-parser for JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Security middleware - Add basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME sniffing
    res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
    res.setHeader('X-XSS-Protection', '1; mode=block'); // XSS protection
    next(); // Continue to next middleware
});

// Request logging middleware (corporate best practice)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// === ROUTES ===

// API Routes using controllers (corporate pattern)
app.use('/api/health', healthRoutes); // Health check endpoints
app.use('/api/users', userRoutes);    // User management endpoints

// Root endpoint - API information
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Corporate Express API Server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            users: '/api/users',
            docs: 'Coming soon...'
        }
    });
});

// Legacy registration endpoint (keeping for backward compatibility)
app.get('/register', (req, res) => {
    res.status(200).json({
        message: 'Please use /api/users for user registration',
        redirectTo: '/api/users',
        method: 'POST',
        timestamp: new Date().toISOString()
    });
});

// === ERROR HANDLING ===

// 404 Handler - Catch all undefined routes (Express 4.x compatible)
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            '/',
            '/api/health',
            '/api/health/metrics',
            '/api/users',
            '/register'
        ],
        tip: 'Visit the available routes listed above',
        timestamp: new Date().toISOString()
    });
});

// Global error handler - Must be last middleware
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${new Date().toISOString()}:`, err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

// === SERVER STARTUP ===

// Use environment variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start server with proper error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 Express server running on port: ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
});

// Graceful shutdown handling (corporate requirement)
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Process terminated');
    });
});

export default app; // Export for testing purposes