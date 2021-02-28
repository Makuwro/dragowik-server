const db = require("../../database");
const argon2 = require("argon2");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

module.exports = (app) => {
  
  app.get("/api/user/session", jsonParser, async (req, res) => {
    
    var sessionToken = req.header("sessionToken");
    
    // Make sure we got the main stuff
    if (!sessionToken) {
      res.status(400).json({error: "Missing token"});
      return;
    };
    
    // Make sure session exists
    var userId = req.query.id;
    const UserQuery = db.prepare("select rowid, * from Users where sessionToken = (?)" + (userId ? " and rowid = (?)" : ""));
    var user = userId ? UserQuery.get(sessionToken, userId) : UserQuery.get(sessionToken);
    if (!user || (req.query.username && user.rowid !== userId)) {
      res.status(User ? 403 : 404).json({error: "Invalid token"});
      return;
    };
    
    // Success!
    res.sendStatus(200);
    
  });
  
};