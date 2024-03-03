import contactsControllers from '../controllers/contactsControllers.js'
import validateBody from '../helpers/validateBody.js'
import {createContactSchema, updateContactSchema, updateFavoriteSchema} from '../schemas/contactsSchemas.js'
import {isValidId} from '../middlewares/isValidId.js'
import {Router} from 'express'
import {authenticate} from '../middlewares/authenticate.js'
import {upload} from '../middlewares/upload.js'

const contactsRouter = Router()

contactsRouter.use(authenticate)

contactsRouter.get('/', contactsControllers.getAllContacts)

contactsRouter.get('/:id', isValidId, contactsControllers.getOneContact)

contactsRouter.delete('/:id', isValidId, contactsControllers.deleteContact)

contactsRouter.post('/', upload.single('photo'), validateBody(createContactSchema), contactsControllers.createContact)

contactsRouter.put('/:id', isValidId, validateBody(updateContactSchema), contactsControllers.updateContact)

contactsRouter.patch('/:id/favorite', isValidId, validateBody(updateFavoriteSchema), contactsControllers.updateContact)

export default contactsRouter
