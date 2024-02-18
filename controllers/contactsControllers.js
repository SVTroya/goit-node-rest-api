import contactsService from '../services/contactsServices.js'
import HttpError from '../helpers/HttpError.js'
import {ctrlWrapper} from '../decorators/ctrlWrapper.js'

async function getAllContacts(req, res) {
  const result = await contactsService.listContacts();
  res.json(result);
}

async function getOneContact(req, res) {
  const {id} = req.params
  const result = await contactsService.getContactById(id)
  if (!result) {
    throw HttpError(404);
  }

  res.json(result)
}

async function deleteContact(req, res) {
  const {id} = req.params
  const result = await contactsService.removeContact(id)
  if (!result) {
    throw HttpError(404)
  }

  res.json(result)
}

async function createContact(req, res) {
  res.status(201).json(await contactsService.addContact(req.body))
}

async function updateContact(req, res) {
  const {id} = req.params
  const result = await contactsService.updateContact(id, req.body)
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
}
