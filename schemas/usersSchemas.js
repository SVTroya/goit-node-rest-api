import Joi from 'joi'
import {emailRegex} from '../constants/regexs.js'

export const signUpSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required().messages({'string.pattern.base': `Incorrect e-mail format`}),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid('starter', 'pro', 'business')
})

export const signInSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required()
})

export const verifySchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
})