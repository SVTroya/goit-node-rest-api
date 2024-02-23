import {model, Schema} from 'mongoose'
import {emailRegex} from '../constants/regexs.js'
import {handleSaveError, setUpdateSetting} from './hooks.js'

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'E-mail is required'],
    unique: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
},
  {
    versionKey: false,
    timestamps: true
  })

userSchema.post('save', handleSaveError)
userSchema.pre('findOneAndUpdate', setUpdateSetting)
userSchema.post('findOneAndUpdate', handleSaveError)

const User = model('user', userSchema)

export default User;