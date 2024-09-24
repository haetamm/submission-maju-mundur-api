import Joi from "joi";

const productValidation = Joi.object({
    name: Joi.string().trim().max(100).required(),
    price: Joi.number().min(1).required(),
    stock: Joi.number().min(1).required(),
});

export {
    productValidation,
}