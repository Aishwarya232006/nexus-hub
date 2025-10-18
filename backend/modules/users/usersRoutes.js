const { Router } = require("express");
// Comment out middleware imports temporarily to test
// const createUserRules = require("./middlewares/create-rules");
// const updateUserRules = require("./middlewares/update-rules");
const UserModel = require("./users-model");

const usersRoute = Router();

// GET all users
usersRoute.get("/users", async (req, res) => {
  try {
    const users = await UserModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

// GET user by ID
usersRoute.get("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});

// CREATE new user - TEMPORARILY COMMENT OUT VALIDATION
usersRoute.post("/users", async (req, res) => {
  try {
    // Simple validation
    const { name, email, experienceLevel } = req.body;
    if (!name || !email || !experienceLevel) {
      return res.status(400).json({ 
        error: "Validation failed",
        message: "Name, email, and experience level are required" 
      });
    }
    
    const newUser = await UserModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// UPDATE user - TEMPORARILY COMMENT OUT VALIDATION
usersRoute.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await UserModel.updateUser(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE user
usersRoute.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await UserModel.deleteUser(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

module.exports = { usersRoute };