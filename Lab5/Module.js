export default function Module(app) {
    let moduleObj = {
      id: "M101",
      name: "Intro to REST APIs",
      description: "Learning to create REST routes",
      course: "CS4550",
    };
  
    app.get("/lab5/module", (req, res) => {
      res.json(moduleObj);
    });
  
    app.get("/lab5/module/name", (req, res) => {
      res.send(moduleObj.name);
    });
  
    app.get("/lab5/module/name/:name", (req, res) => {
      moduleObj.name = req.params.name;
      res.json(moduleObj);
    });
  
    app.get("/lab5/module/description/:desc", (req, res) => {
      moduleObj.description = req.params.desc;
      res.json(moduleObj);
    });
  }
  