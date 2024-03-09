
// for server side validation with help of joi
const Joi =require("joi");

module.exports.listingSchema= Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),//price never be negative
        image: Joi.string().allow("",null),//image emty or null is allowed


    }).required(),//means listing object is required
})


module.exports.reviewSchema= Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()

    }).required()
});