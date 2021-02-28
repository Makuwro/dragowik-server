const db = require("../../database");
//const bodyParser = require("body-parser");
//const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  function getArticle(template, req, res) {
    const ArticleName = req.params.articleName;
    var aOrT = template ? "Template" : "Article";
    const ArticleData = db.prepare("select * from " + aOrT + "s where name = (?)").get(ArticleName);
    
    if (!ArticleData) {
      res.status(404).json({error: aOrT + " not found"});
      return;
    };
    
    res.json(ArticleData);
  };
  
  app.get("/api/article/:articleName", (req, res) => {
    getArticle(false, req, res);
  });
  
  app.get("/api/template/:articleName", (req, res) => {
    getArticle(true, req, res);
  });
  
};
