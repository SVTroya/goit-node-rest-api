import {model, Schema} from 'mongoose'
import {handleSaveError, setUpdateSetting} from './hooks.js'

const contactsSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
    min: 2
  },
  email: {
    type: String,
    min: 6,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    match: /^\([0-9]{3}\)\s[0-9]{3}-[0-9]{4}$/,
    unique: true
  },
  favorite: {
    type: Boolean,
    default: false
  }
},
  {
    versionKey: false,
    timestamps: true
  })

contactsSchema.post("save", handleSaveError)
contactsSchema.pre("findOneAndUpdate", setUpdateSetting)
contactsSchema.post("findOneAndUpdate", handleSaveError);

export const Contacts = model('contact', contactsSchema)