import Joi from 'joi'

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/).messages({'string.pattern.base': `Phone number must have format '(123) 456-7890'.`}).required(),
  favorite: Joi.boolean()
})

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().email(),
  phone: Joi.string().regex(/^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/).messages({'string.pattern.base': `Phone number must have format '(123) 456-7890'.`}),
  favorite: Joi.boolean()
}).min(1).messages({'object.min': 'Body must have at least one field'})

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})