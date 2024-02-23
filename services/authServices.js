import User from '../model/User.js'
import bcrypt from 'bcrypt'

async function signUp(data) {
  const {password} = data
  const hashPassword = await bcrypt.hash(password, 10)
  return User.create({...data, password: hashPassword})
}

function setToken(id, token = null) {
  return User.findByIdAndUpdate(id, {token})
}

export default {
  signUp,
  setToken
}