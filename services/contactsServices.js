import {Contacts} from '../model/contacts.js'

async function listContacts() {
  return Contacts.find({})
}

async function getContactById(contactId) {
  return Contacts.findById(contactId)
}

async function removeContact(contactId) {
  return Contacts.findByIdAndDelete(contactId)
}

async function addContact(data) {
  return Contacts.create(data)
}

async function updateContact(contactId, data) {
  return Contacts.findByIdAndUpdate(contactId, data)
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}