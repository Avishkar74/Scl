// Health Routes - Corporate Routing Pattern
// Purpose: Define health check endpoints that use health controller

import express from 'express';
import { getHealthStatus, getDetailedMetrics } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Health Check Routes
 * Used by load balancers, monitoring systems, and DevOps teams
 */

// Basic health check - GET /api/health
router.get('/', getHealthStatus);

// Detailed metrics - GET /api/health/metrics  
router.get('/metrics', getDetailedMetrics);

// Additional health endpoints for different monitoring needs
router.get('/status', getHealthStatus); // Alternative endpoint
router.get('/ping', (req, res) => {
    // Ultra-lightweight ping endpoint
    res.status(200).json({ 
        status: 'pong', 
        timestamp: new Date().toISOString() 
    });
});

export default router;
