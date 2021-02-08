const db = require("../../database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  function manageArticle(update, req, res) {
    
    const ArticleName = req.params.articleName;
    const ArticleData = update ? db.prepare("select * from Articles where name = (?)").get(ArticleName) : undefined;
    
    if (!ArticleData && update) {
      res.status(404).json({error: "Article not found"});
      return;
    };
    
    const Source = req.body.source;
    
    if (!Source) {
      res.status(400).json({error: "No content given"});
    };
    
    update ? db.prepare("update Articles set source = (?), lastUpdated = current_timestamp where name = (?)").run(Source, ArticleName) : db.prepare("insert into Articles (name, source) values (?,?)").run(ArticleName, Source);
    
    res.sendStatus(update ? 200 : 201);
    
  };
  
  app.put("/api/article/:articleName", (req, res) => {
    manageArticle(true, req, res);
  });
  
  app.post("/api/article/:articleName", (req, res) => {
    manageArticle(false, req, res);
  });
  
};
