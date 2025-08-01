const userDB = require('../repositories/userDB');

const getAllUsers = (filters) => {
  return userDB.getAllUsers(filters);
}

const getUserById = (id) => {
  return userDB.getUserById(id);
}

const addUser = (obj) => {
  return userDB.addUser(obj);
}

const updateUser = (id, obj) => {
  return userDB.updateUser(id, obj);
}

const deleteUser = (id) => {
  return userDB.deleteUser(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
};