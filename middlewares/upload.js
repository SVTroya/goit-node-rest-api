import path from 'path'
import multer from 'multer'
import HttpError from '../helpers/HttpError.js'

const destination = path.resolve('temp')

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const fileName = `${uniquePrefix}-${file.originalname}`
    callback(null, fileName)
  }
})

const limit = {
  filesize: 1024 * 1024 * 5
}

function fileFilter(req, file, callback) {
  const extension = file.originalname.split('.').pop()
  if (extension === 'exe') {
    return callback(HttpError(400, '.exe extension is not allow'))
  }

  const allowed = ['png', 'jpg', 'jpeg', 'webp', 'bmp']
  if (!allowed.includes(extension)) {
    return callback(HttpError(400, `.${extension} extension is not allow`))
  }

    callback(null, true)
}

export const upload = multer({
  storage,
  limit,
  fileFilter
})