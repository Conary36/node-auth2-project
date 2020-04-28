const bcrypt = require("bcrypt");

const router = require("express").Router();

const Users = require("../users/users-model.js");
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

router.post("/register", (req, res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);

  user.password = hash;//Essential***

  Users.add(user)
    .then((item) => {
      res.status(201).json({ item });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database Error", error: err });
    });
});

router.post("/login", (req, res) => {
  const { username, password} = req.body;

  Users.findBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = username;
        const token = generateToken(user);
        res.status(200).json({ message: "Welcome!" });
        return token;
      } else {
        res.status(401).json({ message: "Info not matching" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error with database", error: err });
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.send("unable to logout");
    } else {
      res.send("logged out");
    }
  });
});

function generateToken(user){
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '2h'
  }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
