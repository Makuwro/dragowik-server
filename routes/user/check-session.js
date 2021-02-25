const db = require("../../database");
const argon2 = require("argon2");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  app.get("/api/user/session", jsonParser, async (req, res) => {
    
    const SessionToken = req.header("sessionToken");
    
    // Make sure we got the main stuff
    if (!SessionToken) {
      res.status(400).json({error: "Missing token"});
      return;
    };
    
    // Make sure session exists
    const User = db.prepare("select rowid, * from Users where sessionToken = (?)" + (req.query.id ? " and rowid = (?)" : "")).get(SessionToken, req.query.id ? req.query.id : undefined);
    if (!User || (req.query.username && User.rowid !== req.query.id)) {
      res.status(User ? 403 : 404).json({error: "Invalid token"});
      return;
    };
    
    // Success!
    res.sendStatus(200);
    
  });
  
};