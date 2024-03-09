import authServices from '../services/authServices.js'
import userServices from '../services/userServices.js'
import HttpError from '../helpers/HttpError.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {ctrlWrapper} from '../decorators/ctrlWrapper.js'
import dotenv from 'dotenv'
import path from 'path'
import {unlink} from 'fs/promises'
import gravatar from 'gravatar'
import Jimp from 'jimp'
import sendEmail from '../helpers/sendEmail.js'

dotenv.config()
const {JWT_SECRET, BASE_URL, PORT} = process.env

const avatarsDir = 'avatars'

async function signUp(req, res) {
  const {email} = req.body
  const user = await userServices.findUser({email})
  if (user) {
    throw HttpError(409, 'Email is already in use')
  }

  const verificationToken = crypto.randomUUID();
  const avatarURL = gravatar.url(email, {s: '250'})
  const newUser = await authServices.signUp({...req.body, avatarURL, verificationToken})

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${verificationToken}">Email verification link</a>`
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL
    }
  })
}

async function verify(req, res) {
  const { verificationToken } = req.params;
  const user = await userServices.findUser({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  await userServices.updateUser({ _id: user._id }, { verify: true, verificationToken: null });

  res.json({
    message: "Verification successful"
  })
}

async function resendVerifyEmail(req, res) {
  const { email } = req.body;
  const user = await userServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}:${PORT}/api/users/verify/${user.verificationToken}">CLick to verify email</a>`
  }

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent"
  })
}

async function signIn(req, res) {
  const {email, password} = req.body

  const user = await userServices.findUser({email})

  if (!user) {
    throw HttpError(401, 'Email or password invalid')
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  if (!await bcrypt.compare(password, user.password)) {
    throw HttpError(401, 'Email or password invalid')
  }

  const payload = {
    id: user._id
  }

  const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '23h'})
  await authServices.setToken(user._id, token)

  res.json({token, user: {email, subscription: user.subscription, avatarURL: user.avatarURL}})
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

async function changeAvatar(req, res) {
  const {_id} = req.user
  const {path: oldPath, filename} = req.file
  const newPath = path.join(path.resolve('public', avatarsDir), filename)
  Jimp.read(oldPath)
    .then((image) => {
      return image
        .cover(250, 250)
        .quality(60)
        .write(newPath);
    })
    .catch((err) => {
      console.error(err);
    })

  await unlink(oldPath)
  const avatarURL = path.join(avatarsDir, filename)
  const newUser = await userServices.changeAvatar(_id, avatarURL)

  res.json({avatarURL: newUser.avatarURL})
}

export default {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  getCurrent: ctrlWrapper(getCurrent),
  signOut: ctrlWrapper(signOut),
  changeSubscription: ctrlWrapper(changeSubscription),
  changeAvatar: ctrlWrapper(changeAvatar),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}