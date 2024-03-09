import {model, Schema} from 'mongoose'
import {handleSaveError, setUpdateSetting} from './hooks.js'
import {emailRegex, phoneRegex} from '../constants/regexs.js'

const contactSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Set name for contact'],
      min: 2
    },
    email: {
      type: String,
      match: emailRegex,
      required: [true, 'Set email for contact']
    },
    phone: {
      type: String,
      required: [true, 'Set phone number for contact'],
      match: phoneRegex
    },
    favorite: {
      type: Boolean,
      default: false
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, 'Owner is required']
    },
    photo: {
      type: String,
      default: null
    }
  },
  {
    versionKey: false,
    timestamps: true
  })

contactSchema.post('save', handleSaveError)
contactSchema.pre('findOneAndUpdate', setUpdateSetting)
contactSchema.post('findOneAndUpdate', handleSaveError)

export const Contact = model('contact', contactSchema)