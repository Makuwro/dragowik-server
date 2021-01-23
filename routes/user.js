module.exports = (app) => {
  
  const NormalizedPath = require("path").join(__dirname, "user");
  const Files = require("fs").readdirSync(NormalizedPath);
  for (var i = 0; Files.length > i; i++) {
    require("./user/" + Files[i])(app);
  };
  
};