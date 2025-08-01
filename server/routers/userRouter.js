const express = require("express");
const userService = require("../services/userService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filters = req.query;
    const users = await userService.getAllUsers(filters);
    console.log("GET request to /users succesful", users);
    res.json(users);
  } catch (error) {
    console.error("GET /users error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("GET /users/:id error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const userObj = req.body;
    const newUser = await userService.addUser(userObj);
    res.status(201).json(`The new ID: ${newUser.id}`);
  } catch (error) {
    console.error("POST /users error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dataObj = req.body;
        const updatedUser = await userService.updateUser(id, dataObj);
        if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
        }
        res.json(`The updated ID: ${updatedUser.id}`);
    } catch (error) {
        console.error("PUT /users/:id error:", error);
        res.status(500).json({ error: error.message });
    }
    });

router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const dataObj = req.body;
        const updatedUser = await userService.updateUser(id, dataObj);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(`The updated ID: ${updatedUser.id}`);
    } catch (error) {
        console.error("PATCH /users/:id error:", error);
        res.status(500).json({ error: error.message });
    }
}
);

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await userService.deleteUser(id);
        if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
        }
        res.json(`The deleted ID: ${deletedUser.id}`);
    } catch (error) {
        console.error("DELETE /users/:id error:", error);
        res.status(500).json({ error: error.message });
    }
    }
);
module.exports = router;
