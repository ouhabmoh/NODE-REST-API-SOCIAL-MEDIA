const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) =>{
    const {username, email, password} = req.body;
    

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await new User({
            username,
            email,
            password: hashedPassword
            });
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(err);
    }
    
});

//LOGIN
router.post("/login", async (req,res) =>{
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        !user && res.status(404).json("User not found");

        const validPassword = await bcrypt.compare(password, user.password);
        !validPassword && res.status(400).json("Wrong Password");

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(err);
    }


})

module.exports = router;