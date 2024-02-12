import contactsService from '../services/contactsServices.js'
import HttpError from '../helpers/HttpError.js'

export const getAllContacts = async (req, res) => {
  res.json(await contactsService.listContacts())
}

export const getOneContact = async (req, res) => {
  const {id} = req.params
  const result = await contactsService.getContactById(id)
  if (!result) {
    const error = HttpError(404)
    res.status(error.status).json({message: error.message})
  }

  res.json(result)
}

export const deleteContact = async (req, res) => {
  const {id} = req.params
  const result = await contactsService.removeContact(id)
  if (!result) {
    const error = HttpError(404)
    res.status(error.status).json({message: error.message})
  }

  res.json(result)
}

export const createContact = async (req, res) => {
  res.status(201).json(await contactsService.addContact(req.body))
}

export const updateContact = async (req, res) => {
  const {id} = req.params
  const result = await contactsService.updateContact(id, req.body)
  if (!result) {
    const error = HttpError(404)
    res.status(error.status).json({message: error.message})
  }

  res.json(result)
}
