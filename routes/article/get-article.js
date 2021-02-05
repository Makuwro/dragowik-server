const db = require("../../database");
//const bodyParser = require("body-parser");
//const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  app.get("/api/article/:articleName", (req, res) => {
    
    const ArticleName = req.params.articleName;
    const ArticleData = db.prepare("select * from Articles where name = (?)").get(ArticleName);
    
    if (!ArticleData) {
      res.status(404).json({error: "Article not found"});
      return;
    };
    
    res.json(ArticleData);
    
  });
  
};
