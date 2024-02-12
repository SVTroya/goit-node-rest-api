import {readFile, writeFile} from 'fs/promises'
import * as path from 'path'
import * as crypto from 'crypto'

const fileName = 'contacts.json'
const dirPath = 'db'
const contactsPath = path.resolve(dirPath, fileName)

async function listContacts() {
  return JSON.parse(await readFile(contactsPath, 'utf8'))
}

async function getContactById(contactId) {
  const contacts = await listContacts()
  return contacts?.find(contact => contact.id === contactId) || null
}

async function removeContact(contactId) {
  const contacts = await listContacts()

  const index = contacts?.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  const [deletedContact] = contacts.splice(index, 1)
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8')
  return deletedContact
}

async function addContact(data) {
  const contacts = await listContacts()
  const newContact = {id: crypto.randomUUID(), ...data}
  contacts?.push(newContact)
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8')
  return newContact
}

async function updateContact(contactId, data) {
  const contacts = await listContacts()

  const index = contacts?.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  const updatedContact = {...contacts[index], ...data}
  contacts[index] = updatedContact
  await writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8')
  return updatedContact
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
}