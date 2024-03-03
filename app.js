import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import contactsRouter from './routes/contactsRouter.js'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/authRouter.js'

/*
async function convertDiceList() {
  try {
    const file = await readFile(path.resolve('db', 'dice.txt'), 'utf8')
    const list = file.split('\n').map(el => el.trim().replace('add(DiceFace(', '').replace('))', '').replace('R.drawable.', ''))
    const jsonFile = []
    let faces = []
    let die_number = 0
    let die_type = 'base'
    list.forEach(el => {
      const [typeNumber, die_number_el, img] = el.split(', ')
      const die_number_c = Number(die_number_el)
      if (die_number !== die_number_c) {
        jsonFile.push({die_type, faces})
        faces = []
        die_number = die_number_c
      }

      switch (typeNumber) {
        case '0':
          die_type = 'base'
          break
        case '1':
          die_type = 'river'
          break
        case '2':
          die_type = 'lake'
          break
        case '3':
          die_type = 'meteor'
          break
        case '4':
          die_type = 'lava'
          break
        case '5':
          die_type = 'forest'
          break
        case '6':
          die_type = 'trails'
          break
        case '7':
          die_type = 'canyon'
          break
        case '8':
          die_type = 'desert'
          break
      }
      faces.push(img + '.svg')

    })
    await writeFile(path.resolve('db', 'dice.json'), JSON.stringify(jsonFile, null, 2), 'utf8')
  } catch (err) {
    console.log(err)
    return null
  }
}

await convertDiceList()
*/


dotenv.config()
const {DB_HOST, PORT} = process.env

const app = express()

app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/users', authRouter)
app.use('/api/contacts', contactsRouter)

app.use((_, res) => {
  res.status(404).json({message: 'Route not found'})
})

app.use((err, req, res, next) => {
  const {status = 500, message = 'Server error'} = err
  res.status(status).json({message})
})


mongoose.connect(DB_HOST)
  .then(() => {
    console.log('Database connection successful')
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`)
    })
  })
  .catch(error => {
    console.log(error.message)
    process.exit(1)
  })

