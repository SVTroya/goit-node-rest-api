import authServices from '../services/authServices.js'
import userServices from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {ctrlWrapper} from '../decorators/ctrlWrapper.js'
import dotenv from 'dotenv'

dotenv.config()
const {JWT_SECRET} = process.env

async function signUp(req, res) {
  const {email} = req.body
  const user = await userServices.findUser({email})
  if (user) {
    throw HttpError(409, 'Email is already in use')
  }

  const newUser = await authServices.signUp(req.body)

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription
    }
  })
}

async function signIn(req, res) {
  const {email, password} = req.body

  const user = await userServices.findUser({email})

  if (!user) {
    throw HttpError(401, 'Email or password invalid')
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw HttpError(401, 'Email or password invalid')
  }

  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '23h'})
  await authServices.setToken(user._id, token)

  res.json({token, user: {email, subscription: user.subscription}})
}

async function getCurrent(req, res) {
  const {email, username} = req.user
  res.json({email, username})
}

async function signOut(req, res) {
  const {_id} = req.user
  await authServices.setToken(_id)

  res.status(204).json({message: 'No Content'})
}

async function changeSubscription(req, res) {
  const {_id} = req.user
  const {subscription: newSubscription} = req.body
  const {email, subscription} = await userServices.changeSubscription(_id, newSubscription)

  res.json({user: {email, subscription}})
}

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  changeSubscription: ctrlWrapper(changeSubscription)
}