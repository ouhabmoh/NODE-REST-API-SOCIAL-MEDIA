const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    if(req.body.userId === id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }catch(error){
                res.status(500).json(err);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(id, {
                $set : req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (error) {
            res.status(500).json(err);
        }

    }else{
        return res.status(403).json("you can update only your account");
    }
})
//delete user

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    if(req.body.userId === id || req.body.isAdmin){
        
        try {
            const user = await User.findByIdAndRemove(id);
            res.status(200).json("Account has been deleted");
        } catch (error) {
            console.log(error)
            res.status(500).json(error);
        }

    }else{
        return res.status(403).json("you can delete only your account");
    }
})

//get a user

router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }catch (err){
        res.status(500).json(err);
    }
})

//follow a user

router.put("/:id/follow", async (req, res) =>{
    const id = req.params.id
    const currentUserId = req.body.userId;
    if(currentUserId !== id){
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(currentUserId);
            if(!user.followers.includes(currentUserId)){
                await user.updateOne({$push:{followers:currentUserId}});
                await currentUser.updateOne({$push : {followings:id}});
                user.save();
                currentUser.save();
                res.status(200).json("user has been followed");
            }else{
                res.status(403).json("you already follow this user");
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you cant follow yourself");
    }
})

//unfollow a user
router.put("/:id/follow", async (req, res) =>{
    const id = req.params.id
    const currentUserId = req.body.userId;
    if(currentUserId !== id){
        try {
            const user = await User.findById(id);
            const currentUser = await User.findById(currentUserId);
            if(user.followers.includes(currentUserId)){
                await user.updateOne({$pull:{followers:currentUserId}});
                await currentUser.updateOne({$pull : {followings:id}});
                user.save();
                currentUser.save();
                res.status(200).json("user has been Unfollowed");
            }else{
                res.status(403).json("you dont follow this user");
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("you cant follow yourself");
    }
})
module.exports = router;