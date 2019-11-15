require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()
console.log(process.env.API_TOKEN)
app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
  console.log('validate bearer token middleware')
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})

function handleGetMovie(req, res) {
  res.send('Hello, welcome to moviedex!')
}
    
app.get('/movie', handleGetMovie)

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})