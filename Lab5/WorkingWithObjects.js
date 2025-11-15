const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  };
  
  export default function WorkingWithObjects(app) {
    app.get("/lab5/assignment", (req, res) => {
      res.json(assignment);
    });
  
    app.get("/lab5/assignment/title/:newTitle", (req, res) => {
      assignment.title = req.params.newTitle;
      res.json(assignment);
    });
  
    app.get("/lab5/assignment/score/:newScore", (req, res) => {
      const score = parseInt(req.params.newScore);
      if (!isNaN(score)) assignment.score = score;
      res.json(assignment);
    });
  
    app.get("/lab5/assignment/completed/:completed", (req, res) => {
      const completed = req.params.completed === "true";
      assignment.completed = completed;
      res.json(assignment);
    });
  
    app.get("/lab5/assignment/description/:newDescription", (req, res) => {
      assignment.description = req.params.newDescription;
      res.json(assignment);
    });
  }
  