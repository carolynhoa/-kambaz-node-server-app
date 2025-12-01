import model from "./model.js"; 
import { v4 as uuidv4 } from "uuid";


export default function UsersDao() {


  const createUser = async (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return await model.create(newUser);
  };

  const findAllUsers = async () => {
    try {
      return await model.find();
    } catch (err) {
      throw new Error("Error fetching users: " + err.message);
    }
  };

  const findUserById = async (userId) => {
    try {
      return await model.findById(userId);
    } catch (err) {
      throw new Error("Error fetching user by ID: " + err.message);
    }
  };

  const findUserByUsername = async (username) => {
    try {
      return await model.findOne({ username });
    } catch (err) {
      throw new Error("Error fetching user by username: " + err.message);
    }
  };

  const findUserByCredentials = async (username, password) => {
    try {
      return await model.findOne({ username, password });
    } catch (err) {
      throw new Error("Error fetching user by credentials: " + err.message);
    }
  };

  const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });


  const deleteUser = (userId) => model.findByIdAndDelete( userId );



  const findUsersByRole = async (role) => {
    try {
      return await model.find({ role });
    } catch (err) {
      throw new Error("Error fetching users by role: " + err.message);
    }
  };

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };


  
  
  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}
