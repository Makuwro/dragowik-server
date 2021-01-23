const db = require("../../database");
const argon2 = require("argon2");

module.exports = (app) => {
  
  app.post("/api/user", async (req, res) => {
    
    const username = req.query.username;
    const password = req.header("password");
    const email = req.header("email");
    
    // Make sure we got the main stuff
    if (!username || !password || !email) {
      res.status(400).json({error: "Missing " + username ? (password ? "email address" : "password") : "username"});
      return;
    };
    
    // Make sure the username is available
    if (db.prepare("select exists(select 1 from Users where username=(?)").get(username)) {
      res.status(409).json({error: "Username already exists"});
      return;
    };
    
    // Encrypt the password
    const PasswordHash = await argon2.hash(password);
    
    // Create the user
    db.prepare("insert into Users (username, email, password) values (?, ?, ?)").run(username, email, PasswordHash);
    
    // Success!
    res.sendStatus(200);
    
  });
  
};