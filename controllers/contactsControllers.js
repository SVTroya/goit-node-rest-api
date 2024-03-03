import contactsService from '../services/contactsServices.js'
import HttpError from '../helpers/HttpError.js'
import {ctrlWrapper} from '../decorators/ctrlWrapper.js'
import path from 'path'
import {rename} from 'fs/promises'

const contactsDir = 'contactsPhoto'

async function getAllContacts(req, res) {
  const {limit = 10, page = 1, favorite} = req.query
  const skip = (page - 1) * limit
  const filter = {owner: req.user._id}
  if (favorite) {
    filter.favorite = favorite
  }
  const result = await contactsService.getContactsByFilter(filter, {skip, limit})
  const total = await contactsService.getContactsCountByFilter(filter)
  res.json({total, result})
}

async function getOneContact(req, res) {
  const {id} = req.params
  const {_id: owner} = req.user
  const result = await contactsService.getContactByFilter({_id: id, owner})
  if (!result) {
    throw HttpError(404)
  }

  res.json(result)
}

async function deleteContact(req, res) {
  const {id} = req.params
  const {_id: owner} = req.user
  const result = await contactsService.removeContactByFilter({_id: id, owner})
  if (!result) {
    throw HttpError(404)
  }

  res.json(result)
}

async function createContact(req, res) {
  const user = req.body
  if (req.file) {
    const {path: oldPath, filename} = req.file
    const newPath = path.join(path.resolve('public', contactsDir), filename)
    await rename(oldPath, newPath)
    user.photo = path.join(contactsDir, filename)
  }

  user.owner = req.user
  const {_id, name, email, phone, favorite, photo} = await contactsService.addContact(user)

  res.status(201).json({_id, name, email, phone, favorite, photo})
}

async function updateContact(req, res) {
  const {id} = req.params
  const {_id: owner} = req.user
  const result = await contactsService.updateContactByFilter({_id: id, owner}, req.body)
  if (!result) {
    throw HttpError(404)
  }

  res.json(result)
}

async function updateStatusContact(req, res) {
  const {id} = req.params
  const result = await contactsService.updateContact(id, req.body)
  if (!result) {
    throw HttpError(404)
  }

  res.json(result)
}

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact)
}
