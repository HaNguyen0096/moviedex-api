require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const moviedex = require('./movies-data.json')

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

app.get('/movie', function handleGetMovie(req, res) {
  let response = moviedex;

  // filter our movie by genre if genre query param is present
  if (req.query.genre) {
    response = response.filter(movie =>
      // case insensitive searching
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    )
  }

  // filter our movie by country if type country param is present
  if (req.query.country) {
    response = response.filter(movie =>
        movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    )
  }

  // filter our movie by avg vote if type avg_vote param is present
  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    )
  }

  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})