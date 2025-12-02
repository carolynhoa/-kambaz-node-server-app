import ModulesDao from "./dao.js"; 

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);
  
  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      console.log("ROUTE: courseId from params =", courseId);
      const modules = await dao.findModulesForCourse(courseId);
      console.log("ROUTE: modules found =", modules);
      console.log("ROUTE: modules length =", modules?.length);
      res.json(modules);
    } catch (err) {
      console.error("ROUTE ERROR:", err);
      res.status(500).json({ message: "Failed to find modules" });
    }
  };

  const createModuleForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const module = {
        ...req.body,
        course: courseId,
      };
      const newModule = await dao.createModule(module);  
      res.json(newModule);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create module" });
    }
  };

  const deleteModule = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const status = await dao.deleteModule(moduleId);  
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete module" });
    }
  };

  const updateModule = async (req, res) => {
    try {
      const { moduleId } = req.params;
      const moduleUpdates = req.body;
      const status = await dao.updateModule(moduleId, moduleUpdates);  
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update module" });
    }
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/modules/:moduleId", updateModule);
  app.delete("/api/modules/:moduleId", deleteModule);
}