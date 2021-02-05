const FolderNames = ["article", "user"]

module.exports = (app) => {
  
  for (var i = 0; FolderNames.length > i; i++) {
    const NormalizedPath = require("path").join(__dirname, FolderNames[i]);
    const Files = require("fs").readdirSync(NormalizedPath);
    for (var i = 0; Files.length > i; i++) {
      require("./" + FolderNames[i] + "/" + Files[i])(app);
    };
  };
  
};