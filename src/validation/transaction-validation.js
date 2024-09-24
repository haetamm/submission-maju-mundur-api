import Joi from 'joi';

const transactionValidation = Joi.object({
    product: Joi.array().items(
        Joi.object({
            quantity: Joi.number().integer().min(1).required(), 
            price: Joi.number().integer().min(0).required(),   
            productId: Joi.string().trim().required()                   
        }).required()
    ).required() 
});



export { transactionValidation };
