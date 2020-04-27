const express = require("express")
const jwtValidate = require("express-jwt")
const { check, validationResult } = require("express-validator")
const { Visit } = require("../../models")


const router = express.Router({mergeParams: true})

router.get("/", jwtValidate({secret: process.env.SECRET_KEY}),async (req, res) => {
    try {
        const visits = await Visit.findAll({
            where: {
                RestaurantId: req.params.restaurantId,
                UserId: req.user.id
            }
        })
        res.json(visits)
    }
    catch(err) {
        res.status(400)
        res.json({detail: err.message})
    }
})


router.post("/", [
    jwtValidate({secret: process.env.SECRET_KEY}),
    check("review").isString(),
    check("rating").isDecimal({decimal_digits: 1, max: 5, min: 0}),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (req.body.rating > 5 || req.body.rating < 0) {
        return res.status(400).json({detail: "Rating must be between 0-5"})    
    }

    try {
        const visit = await Visit.create({
            UserId: req.user.id,
            RestaurantId: req.params.restaurantId,
            rating: req.body.rating,
            review: req.body.review
        })
        const restaurant = await visit.getRestaurant()
        const relatedVisits = await restaurant.getVisits()
        if (relatedVisits.length === 1) {
            restaurant.rating = req.body.rating
        } else {
            restaurant.rating = (Number(restaurant.rating) * (relatedVisits.length - 1) + Number(visit.rating)) / relatedVisits.length
        }
        restaurant.save()
        res.json(visit)
    }
    catch(err) {
        res.status(400)
        res.json({detail: err.message})
    }
})


module.exports = router