// User Routes - Corporate Routing Pattern  
// Purpose: Define user management endpoints that use user controller

import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    createUser, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const router = express.Router();

/**
 * User Management Routes
 * RESTful API design following corporate standards
 */

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

// Additional user routes for specific actions
router.get('/:id/profile', getUserById); // Alias for getting user profile

export default router;
