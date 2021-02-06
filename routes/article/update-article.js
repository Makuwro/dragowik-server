const db = require("../../database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  app.put("/api/article/:articleName", (req, res) => {
    
    const ArticleName = req.params.articleName;
    const ArticleData = db.prepare("select * from Articles where name = (?)").get(ArticleName);
    
    if (!ArticleData) {
      res.status(404).json({error: "Article not found"});
      return;
    };
    
    const Source = req.body.source;
    
    if (!Source) {
      res.status(400).json({error: "No content given"});
    };
    
    db.prepare("update Articles set source = (?) where name = (?)").run(Source, ArticleName);
    
    res.sendStatus(200);
    
  });
  
};
