const db = require("../../database");
const path = require("path");
const {existsSync} = require("fs");

module.exports = (app) => {
  
  app.get("/api/user/avatar", async (req, res) => {
    
    const UserId = req.query.id;
    const Username = req.query.username;
    const UserInfo = UserId || Username ? db.prepare("select rowid as id, username from Users where " + (UserId ? "rowid" : "username") + " = (?)").get(UserId ? Number(UserId) : Username) : undefined;
    
    // Make sure we got the main stuff
    if ((!UserId && !Username) || !UserInfo) {
      res.status(UserId || Username ? 404 : 400).json({error: (UserId || Username ? "Unknown" : "Missing") + " user"});
      return;
    };
    
    // Success!
    const AvatarLocation = "./avatars/User_" + UserInfo.id + ".png";
    res.sendFile(path.resolve(existsSync(AvatarLocation) ? AvatarLocation : "./avatars/default.png"));
    
  });
  
};