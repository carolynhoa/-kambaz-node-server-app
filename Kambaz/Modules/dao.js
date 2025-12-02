import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  
  async function findModulesForCourse(courseId) {  
    console.log("DAO: Searching for modules with course =", courseId);
    const result = await model.find({ course: courseId }); 
    console.log("DAO: Found modules =", result);  
    console.log("DAO: Count =", result?.length);  
    return result;
  }

  async function createModule(module) {  
    const newModule = { ...module, _id: uuidv4() };
    return await model.create(newModule); 
  }

  async function deleteModule(moduleId) {  
    return await model.deleteOne({ _id: moduleId });  
  }

  async function updateModule(moduleId, moduleUpdates) { 
    return await model.updateOne({ _id: moduleId }, { $set: moduleUpdates });  
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule,
  };
}