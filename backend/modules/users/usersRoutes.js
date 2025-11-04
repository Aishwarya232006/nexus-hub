const { Router } = require("express");
const UserService = require("./users-service");
const createUserRules = require("./middlewares/create-rules");
const updateUserRules = require("./middlewares/update-rules");

const usersRoute = Router();

// Enhanced GET with search, sort, pagination
usersRoute.get("/users", async (req, res) => {
  try {
    const result = await UserService.getAllUsers(req.query);
    
    res.status(200).json({
      success: true,
      count: result.users.length,
      pagination: {
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        totalUsers: result.total,
        hasNext: result.currentPage < result.totalPages,
        hasPrev: result.currentPage > 1
      },
      data: result.users
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Failed to retrieve users" 
    });
  }
});

// GET user by ID
usersRoute.get("/users/:id", async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: "Error retrieving user" 
    });
  }
});

// CREATE user with validation
usersRoute.post("/users", createUserRules, async (req, res) => {
  try {
    const newUser = await UserService.createUser(req.body);
    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE user with validation
usersRoute.put("/users/:id", updateUserRules, async (req, res) => {
  try {
    const updatedUser = await UserService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE user
usersRoute.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await UserService.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete user"
    });
  }
});

module.exports = { usersRoute };