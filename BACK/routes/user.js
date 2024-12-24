import express from 'express';  
import bcrypt from 'bcrypt';
import User from '../models/user.js';

let router = express.Router();
router.put('/:id', async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.Admin){
        if(req.body.password){
            try{
                let salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }catch(err){
                return res.status(400).json(err)
            }
        }
        try{
            let user = await User.findByIdAndUpdate(req.params.id, {$set:req.body})
            res.status(200).json('Account has been updated')
        }catch(err){
            return res.status(400).json(err)
        }
    }else{
        return res.status(403).json('You can only update your account')
    }
})
router.delete('/:id',async(req, res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json('Account has been deleted')
        }catch(err){
            return res.status(400).json(err)
        }
    } else{
        return res.status(403).json('You can only delete your account')
    }
})

router.get('/:id', async(req, res)=>{
    try{
        let user = await User.findById(req.params.id)
        let {password, updateAt, ...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        return res.status(400).json(err)
    }
})

router.get('/', async(req, res)=>{
    let userId = req.query.userId
    let username = req.query.username
    try{
        let user =  userId ? await User.findById(userId) : await User.findOne({username: username})
        let {password, updateAt, ...other} = user._doc
        res.status(200).json(other)
    }catch(err){
        return res.status(400).json(err)
    }
})

router.put('/:id/follow',async (req, res) =>{
    if(req.body.userId !== req.params.id){
        try{
            let user = await User.findById(req.params.id)
            let currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{following:req.params.id}})
                res.status(200).json('User has been followed')
            }else{
                res.status(404).json('you already folllow this user')
            }
        }catch(err){
            res.status(404).json(err)
        }
    }else{
        res.status(403).json('You can only follow your friends')
    }
})

router.put('/:id/unfollow',async (req, res) =>{
    if(req.body.userId !== req.params.id){
        try{
            let user = await User.findById(req.params.id)
            let currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{following:req.params.id}})
                res.status(200).json('User has been unfollowed')
            }else{
                res.status(404).json('you dont folllow this user')
            }
        }catch(err){
            res.status(404).json(err)
        }
    }else{
        res.status(403).json('You cannot unfollow yourself')
    }
})

export default router;