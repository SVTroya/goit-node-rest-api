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

export default {
  findUser,
  findUserById,
  changeSubscription
}