import {Contact} from '../model/Сontact.js'

function getContactsByFilter(filter, query = {}) {
  return Contact.find(filter, '-createdAt -updatedAt', query)
}

function getContactsCountByFilter(filter) {
  return Contact.countDocuments(filter)
}

function getContactByFilter(filter) {
  return Contact.findById(filter, '-createdAt -updatedAt')
}

function removeContactByFilter(filter) {
  return Contact.findOneAndDelete(filter)
}

function addContact(data) {
  return Contact.create(data)
}

function updateContactByFilter(filter, data) {
  return Contact.findOneAndUpdate(filter, data)
}

export default {
  getContactsByFilter,
  getContactsCountByFilter,
  getContactByFilter,
  removeContactByFilter,
  addContact,
  updateContactByFilter
}