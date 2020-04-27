const express = require("express")
const jwtValidate = require("express-jwt")
const { check, validationResult } = require("express-validator")
const { Restaurant } = require("../../models")
const visits = require("../visits/visits")
const router = express.Router()

router.get("/", jwtValidate({secret: process.env.SECRET_KEY}), async (req, res) => {
    const restaurants = await Restaurant.findAll({
        where: {
            UserId: req.user.id
        },
        attributes: ["name", "rating"]
    })
    res.status(200).json(restaurants)
})


router.post("/", [
    jwtValidate({secret: process.env.SECRET_KEY}),
    check("name").isString(),
], async (req, res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }

    try {
        const restaurant = await Restaurant.create({
            name: req.body.name,
            UserId: req.user.id,
            rating: 0
        })
        // res.status(201)
        res.status(201).json(restaurant)

    }
    catch(err) {
        res.status(400)
        res.json({detail: err.message})
    }
})


router.get("/:restaurantId/", jwtValidate({secret: process.env.SECRET_KEY}), async (req, res) => {

    const restaurant = await Restaurant.findOne({
        where: {
            id: req.params.restaurantId,
            UserId: req.user.id
        },
        attributes: ["id", "name", "rating"]
    })

    if (restaurant === null) {
        res.status(404).json({detail: "Restaurant not found"})
    } else {
        res.json(restaurant)
    }

})

router.patch("/:restaurantId/", [
    jwtValidate({secret: process.env.SECRET_KEY}),
    check("name").isString()
], async (req, res) => {
    // allow updating only the name
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }

    const restaurant = await Restaurant.findOne({
        where: {
            id: req.params.restaurantId,
            UserId: req.user.id
        },
        attributes: ["id", "name", "rating"]
    })

    if (restaurant === null) {
        res.status(404).json({detail: "Restaurant not found"})
    } else {
        restaurant.update({name: req.body.name}, {fields: ["name"]})
        res.json(restaurant)
    }

})

router.use("/:restaurantId/visits", visits)


module.exports = router
