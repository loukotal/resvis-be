const express = require("express")
const jwtValidate = require("express-jwt")
const jwtSign = require("jsonwebtoken")
const { check, validationResult } = require("express-validator")
const { User } = require("../../models")

const { hashPassword, checkPassword } = require("./utils")

const router = express.Router()

router.get("/current/", [
    jwtValidate({secret: process.env.SECRET_KEY}),
], async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findOne({
            where:{
                id: userId
            },
            attributes: ["email", "firstName", "lastName"]
        })
        res.send(user)
    } catch(err) {
        res.status(400)
        res.send(err)
    }
})

router.patch("/current/", [
    jwtValidate({secret: process.env.SECRET_KEY}),
    check("lastName").isString(),
    check("firstName").isString()
], async (req, res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
    try {
        const userId = req.user.id
        const allowedAttrs = ["id", "firstName", "lastName"]
        const user = await User.findOne({
            where:{
                id: userId
            },
            attributes: allowedAttrs
        })
        
        await user.update({ ...req.body }, { fields: allowedAttrs })
        res.json(user)

    } catch(err) {
        res.status(400)
        res.json({detail: err.message})  
    }
})

router.post("/authenticate/", [
    check("email").isEmail(),
    check("password").isString()
],async (req, res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
    try {

        const user = await User.findOne({
            where: {
                email: req.body.email
            },
            attributes: ["id", "email", "password", "salt", "iterations"]
        })

        if (user === null) {
            res.status(404)
            throw new Error(`No user with ${req.body.email} found`)
        } else {
            const isSame = await checkPassword(user.password, user.salt, user.iterations, req.body.password)

            if (isSame) {
                const token = jwtSign.sign({id: user.id}, process.env.SECRET_KEY)
                res.status(200)
                res.json({accessToken: token})
            } else {
                res.status(400)
                throw new Error("Invalid password")
            }
        }
    } 
    catch(err) {
        res.json({detail: err.message})
    }    
})

router.post("/register/", [
    check("email").normalizeEmail().isEmail(),
    check("password").isString(),
    check("firstName").isString().isEmpty(),
    check("lastName").isString().isEmpty(),
], async (req, res) => {
    try {

        if(!req.body.email || !req.body.password) {
            res.status(400)
            throw new Error("Invalid request data")
        }
        
        const hashedPassword = await hashPassword(req.body.password)

        const user = await User.create({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashedPassword.hash,
            salt: hashedPassword.salt,
            iterations: hashedPassword.iterations
        })
        res.status(201)
        res.json({   
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
        })
    } 
    catch(err) {
        res.json({detail: err.message})
    }
})

module.exports = router