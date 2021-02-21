const db = require("../../database");
const path = require("path");
const multer = require("multer");
const AcceptedFileRegex = /\.(png|jpg|gif)$/gm;
var userIds = {};
const uploadAvatar = multer({ 
  storage: multer.diskStorage({
    destination: "avatars/",
    filename: (req, file, cb) => {
      cb(null, "User_" + userIds[req.header("sessionToken")] + file.originalname.match(AcceptedFileRegex)[0])
    }
  }),
  fileFilter: (req, file, cb) => {
    return cb(null, file.originalname.match(AcceptedFileRegex) ? true : false)
  }
}).single("avatar");

module.exports = (app) => {
  
  app.put("/api/user", async (req, res) => {
    
    const sessionToken = req.header("sessionToken");
    
    // Make sure we got the main stuff
    if (!sessionToken) {
      res.status(400).json({error: "Missing token"});
      return;
    };
    
    // Make sure session exists
    const UserId = db.prepare("select rowid as id from Users where sessionToken = (?)").get(sessionToken);
    if (!UserId) {
      res.status(400).json({error: "Invalid token"});
      return;
    };
    
    userIds[sessionToken] = UserId.id;
    uploadAvatar(req, res, (err) => {
      
      // Success
      res.sendStatus(200);
    
    });
    
  });
  
};