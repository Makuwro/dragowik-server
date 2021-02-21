const db = require("../../database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fetch = require("node-fetch");

module.exports = (app) => {
  
  async function manageArticle(update, req, res) {
    
    // Verify the user 
    const SessionToken = req.header("sessionToken");
    const UserInfo = SessionToken ? db.prepare("select rowid, * from Users where sessionToken = (?)").get(SessionToken) : undefined;
    if (!SessionToken || !UserInfo) {
      res.status(SessionToken ? 401 : 400).json({error: (SessionToken ? "Invalid" : "Missing") + " token"});
      return;
    };
    
    // Now do some article checks
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
    
    // Update the article 
    const Contributors = update ? JSON.parse(ArticleData.contributors).filter(contributorId => {
      return contributorId !== UserInfo.rowid;
    }) : undefined;
    
    Contributors ? Contributors.unshift(UserInfo.rowid) : undefined;
    
    update ? db.prepare("update Articles set source = (?), lastUpdated = current_timestamp, contributors = (?) where name = (?)").run(Source, JSON.stringify(Contributors), ArticleName) : db.prepare("insert into Articles (name, source, contributors) values (?,?,?)").run(ArticleName, Source, JSON.stringify([UserInfo.rowid]));
    
    // Success!
    res.sendStatus(update ? 200 : 201);
    
  };
  
  app.put("/api/article/:articleName", async (req, res) => {
    await manageArticle(true, req, res);
  });
  
  app.post("/api/article/:articleName", async (req, res) => {
    await manageArticle(false, req, res);
  });
  
};
