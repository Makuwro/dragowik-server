const db = require("../../database");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fetch = require("node-fetch");

module.exports = (app) => {
  
  async function manageArticle(update, template, req, res) {
    
    // Verify the user 
    const SessionToken = req.header("sessionToken");
    const UserInfo = SessionToken ? db.prepare("select rowid, * from Users where sessionToken = (?)").get(SessionToken) : undefined;
    if (!SessionToken || !UserInfo) {
      res.status(SessionToken ? 401 : 400).json({error: (SessionToken ? "Invalid" : "Missing") + " token"});
      return;
    };
    
    // Now do some article checks
    const ArticleName = req.params.articleName;
    var tOrA = template ? "Template" : "Article";
    const ArticleData = update ? db.prepare("select * from " + tOrA + "s where name = (?)").get(ArticleName) : undefined;
    if (!ArticleData && update) {
      res.status(404).json({error: tOrA + " not found"});
      return;
    };
    
    console.log("ok");
    const Source = req.body.source;
    if (!Source) {
      res.status(400).json({error: "No content given"});
      return;
    };
    
    console.log("nice");
    
    // Update the article 
    const Contributors = update ? JSON.parse(ArticleData.contributors).filter(contributorId => {
      return contributorId !== UserInfo.rowid;
    }) : undefined;
    
    Contributors ? Contributors.unshift(UserInfo.rowid) : undefined;
    
    update ? db.prepare("update " + tOrA + "s set source = (?), lastUpdated = current_timestamp, contributors = (?) where name = (?)").run(Source, JSON.stringify(Contributors), ArticleName) : db.prepare("insert into " + tOrA + "s (name, source, contributors) values (?,?,?)").run(ArticleName, Source, JSON.stringify([UserInfo.rowid]));
    
    // Success!
    res.sendStatus(update ? 200 : 201);
    
  };
  
  app.put("/api/article/:articleName", async (req, res) => {
    await manageArticle(true, false, req, res);
  });
  
  app.post("/api/article/:articleName", async (req, res) => {
    await manageArticle(false, false, req, res);
  });
  
  app.put("/api/template/:articleName", async (req, res) => {
    await manageArticle(true, true, req, res);
  });
  
  app.post("/api/template/:articleName", async (req, res) => {
    await manageArticle(false, true, req, res);
  });
  
};
