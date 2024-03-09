import {Router} from 'express'
import validateBody from '../helpers/validateBody.js'
import authControllers from '../controllers/authControllers.js'
import {signInSchema, signUpSchema, verifySchema} from '../schemas/usersSchemas.js'
import {authenticate} from '../middlewares/authenticate.js'
import {upload} from '../middlewares/upload.js'

const authRouter = Router()

authRouter.post('/register', validateBody(signUpSchema), authControllers.signUp)

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post("/verify", validateBody(verifySchema), authControllers.resendVerifyEmail);

authRouter.post('/login', validateBody(signInSchema), authControllers.signIn)

authRouter.get('/current', authenticate, authControllers.getCurrent)

authRouter.post('/logout', authenticate, authControllers.signOut)

authRouter.patch('/favorite', authenticate, authControllers.changeSubscription)

authRouter.patch('/avatars', upload.single('avatarURL'), authenticate, authControllers.changeAvatar)

export default authRouter