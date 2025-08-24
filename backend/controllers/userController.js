// User Controller - Corporate Pattern for User Management
// Purpose: Handle all user-related business logic and operations

/**
 * Corporate User Controller
 * Handles user registration, authentication, profile management
 * Follows enterprise patterns for security and validation
 */

// Temporary in-memory storage (will be replaced with database later)
let users = [
    { 
        id: 1, 
        username: 'admin', 
        email: 'admin@company.com', 
        role: 'admin',
        createdAt: new Date().toISOString()
    }
];

// Get all users (admin only in production)
export const getAllUsers = (req, res) => {
    try {
        console.log(`[USER] Get all users requested from IP: ${req.ip}`);
        
        // In production, add role-based access control here
        const sanitizedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
            // Never send passwords or sensitive data
        }));

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: sanitizedUsers,
            count: sanitizedUsers.length,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[USER ERROR - GET ALL]:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve users',
            message: error.message
        });
    }
};

// Get user by ID
export const getUserById = (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        console.log(`[USER] Get user ${userId} requested from IP: ${req.ip}`);

        // Validate ID format
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                message: 'User ID must be a valid number'
            });
        }

        // Find user
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: `User with ID ${userId} does not exist`
            });
        }

        // Return sanitized user data
        const sanitizedUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.status(200).json({
            success: true,
            message: 'User retrieved successfully',
            data: sanitizedUser
        });

    } catch (error) {
        console.error('[USER ERROR - GET BY ID]:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to retrieve user',
            message: error.message
        });
    }
};

// Create new user (registration)
export const createUser = (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        console.log(`[USER] Create user requested from IP: ${req.ip}`);

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                message: 'Username, email, and password are required',
                required: ['username', 'email', 'password']
            });
        }

        // Check if username already exists
        const existingUser = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() ||
            u.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                error: 'User already exists',
                message: 'Username or email already registered'
            });
        }

        // Create new user (in production, hash the password!)
        const newUser = {
            id: users.length + 1,
            username: username.trim(),
            email: email.trim().toLowerCase(),
            role: role,
            createdAt: new Date().toISOString()
            // password should be hashed here in production
        };

        users.push(newUser);

        // Return success response (never return password)
        const sanitizedUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: sanitizedUser
        });

    } catch (error) {
        console.error('[USER ERROR - CREATE]:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to create user',
            message: error.message
        });
    }
};

// Update user
export const updateUser = (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const updates = req.body;

        console.log(`[USER] Update user ${userId} requested from IP: ${req.ip}`);

        // Validate ID
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                message: 'User ID must be a valid number'
            });
        }

        // Find user
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: `User with ID ${userId} does not exist`
            });
        }

        // Update user (in production, validate each field)
        const updatedUser = {
            ...users[userIndex],
            ...updates,
            id: userId, // Prevent ID modification
            updatedAt: new Date().toISOString()
        };

        users[userIndex] = updatedUser;

        // Return sanitized updated user
        const sanitizedUser = {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: sanitizedUser
        });

    } catch (error) {
        console.error('[USER ERROR - UPDATE]:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message
        });
    }
};

// Delete user
export const deleteUser = (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);

        console.log(`[USER] Delete user ${userId} requested from IP: ${req.ip}`);

        // Validate ID
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID',
                message: 'User ID must be a valid number'
            });
        }

        // Find user
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: `User with ID ${userId} does not exist`
            });
        }

        // Remove user
        const deletedUser = users.splice(userIndex, 1)[0];

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: {
                id: deletedUser.id,
                username: deletedUser.username
            }
        });

    } catch (error) {
        console.error('[USER ERROR - DELETE]:', error.message);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
};
