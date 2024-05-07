var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/:id", function (req, res, next) {
  res.send("respond with a resource");
});
router.get("/", function (req, res, next) {
  res.send("should not show all users");
});
router.post("/login", function (req, res, next) {
  res.send("login should have username and password");
});
module.exports = router;
