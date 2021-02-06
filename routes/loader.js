const FolderNames = ["article", "user"]

module.exports = (app) => {
  
  for (var i = 0; FolderNames.length > i; i++) {
    const NormalizedPath = require("path").join(__dirname, FolderNames[i]);
    const Files = require("fs").readdirSync(NormalizedPath);
    for (var x = 0; Files.length > x; x++) {
      require("./" + FolderNames[i] + "/" + Files[x])(app);
    };
  };
  
};