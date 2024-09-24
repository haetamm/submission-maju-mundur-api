import Joi from "joi";

const registerCustomerValidation = Joi.object({
    name: Joi.string().trim().max(25).required().regex(/^[a-zA-Z ]*$/),
    phone: Joi.string().trim().max(15).required(),
    address: Joi.string().trim().max(100).required(),
    username: Joi.string().trim().alphanum().min(4).max(100).required(),
    password: Joi.string().trim().min(6).max(12).required().regex(/^[a-zA-Z0-9]*$/),
});

const registerMerchantValidation = Joi.object({
    shopName: Joi.string().trim().max(100).required().regex(/^[a-zA-Z ]*$/),
    phone: Joi.string().trim().max(15).required(),
    address: Joi.string().trim().max(100).required(),
    username: Joi.string().trim().alphanum().min(4).max(100).required(),
    password: Joi.string().trim().min(6).max(12).required().regex(/^[a-zA-Z0-9]*$/),
});

const loginUserValidation = Joi.object({
    username: Joi.string().max(100).required(),
    password: Joi.string().max(100).required()
});

export {
    registerCustomerValidation,
    registerMerchantValidation,
    loginUserValidation,
}