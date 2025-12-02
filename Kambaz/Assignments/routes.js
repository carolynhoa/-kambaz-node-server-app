import AssignmentsDao from "./dao.js";

export default function AssignmentRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to find assignments" });
    }
  };

  const createAssignment = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignment = {
        ...req.body,
        course: courseId,
      };
      const newAssignment = await dao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await dao.deleteAssignment(assignmentId);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete assignment" });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const status = await dao.updateAssignment(assignmentId, assignmentUpdates);
      res.json(status);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update assignment" });
    }
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignment);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}