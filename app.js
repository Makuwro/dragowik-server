const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cookieParser = require("cookie-parser");

// Set up middleware
app.use(express.json());
app.use(cookieParser());

// Set up the routes
require("./routes/loader")(app);

// Misc routes
app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log("The backend for Dragowik's up on port " + port + "!");
});