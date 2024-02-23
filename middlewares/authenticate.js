import HttpError from '../helpers/HttpError.js'
import jwt from 'jsonwebtoken'
import userServices from '../services/userServices.js'
import dotenv from 'dotenv'

dotenv.config()
const {JWT_SECRET} = process.env

export async function authenticate(req, res, next) {
  const {authorization} = req.headers
  if (!authorization) {
    return next(HttpError(401, 'Not authorized'))
  }

  const [bearer, token] = authorization.split(' ')
  if (bearer !== 'Bearer') {
    return next(HttpError(401, 'Not authorized'))
  }

  try {
    const {id} = jwt.verify(token, JWT_SECRET)
    const user = await userServices.findUserById(id)
    if (!user || !user.token) {
      return next(HttpError(401, 'Not authorized'))
    }
    req.user = user
    next()
  } catch (error) {
    return next(HttpError(401, error.message))
  }
}