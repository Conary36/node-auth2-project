const router = require("express").Router();
const restricted = require("../auth/restricted-middleware.js"); //added
const Users = require("./users-model.js");

router.get("/", restricted, (req, res) => {
    //added restricted middleware
    //if(req.session && req.session.user){//Not needed due to restricted-middleware
    Users.find()
        .then((users) => {
            res.json(users);
        })
        .catch((err) => res.send(err));
    // }else{
    //   res.status(401).json({message: 'Your not logged in yet!'})
    // }
});

module.exports = router;
