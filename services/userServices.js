import User from '../model/User.js'

function findUser(filter) {
  return User.findOne(filter)
}

function findUserById(id) {
  return User.findById(id)
}

function changeSubscription(id, subscription) {
  return User.findByIdAndUpdate(id, {subscription})
}

function changeAvatar(id, avatarURL) {
  return User.findByIdAndUpdate(id, {avatarURL})
}

function updateUser(filter, data) {
  return User.findOneAndUpdate(filter, data)
}

export default {
  findUser,
  findUserById,
  changeSubscription,
  changeAvatar,
  updateUser
}