const cookieParser = require("cookie-parser");
const db = require("../../database");
const argon2 = require("argon2");
const crypto = require("crypto");

module.exports = (app) => {
  
  app.put("/api/user/session", cookieParser, async (req, res) => {
    
    const username = req.query.username;
    const password = req.header("password");
    
    // Make sure we got the main stuff
    if (!username || !password) {
      res.status(400).json({error: "Missing " + (username ? "password" : "username")});
      return;
    };
    
    // Make sure user exists
    const UserInfo = db.prepare("select * from Users where username=(?)").get(username);
    if (!UserInfo) {
      res.status(404).json({error: "User does not exist"});
      return;
    };
    
    // Verify password
    if (!await argon2.verify(UserInfo.password, password)) {
      res.status(403).json({error: "Wrong password"});
      return;
    };
    
    // Create session
    const SessionToken = crypto.randomBytes(30).toString("hex");
    db.prepare("update Users set sessionToken=(?) where username=(?)").run(SessionToken, username);
    res.cookie("DragowikSessionToken", SessionToken);
    
    // Success!
    res.sendStatus(200);
    
  });
  
};