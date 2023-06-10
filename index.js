require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/people')



app.use(cors())
app.use(express.static('build'))

app.use(express.json())
const morgan = require('morgan')
app.use(morgan(function(tokens, req, res) {
    return [
        tokens.method(req,res),
        tokens.url(req,res), 
        tokens.status(req,res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        req.method === 'POST' ? JSON.stringify(req.body) : ''
    ].join(' ')
}))

// let phonebook = [
//     { 
//       id: 1,
//       name: "Arto Hellas", 
//       number: "040-123456"
//     },
//     { 
//       id: 2,
//       name: "Ada Lovelace", 
//       number: "39-44-5323523"
//     },
//     { 
//       id: 3,
//       name: "Dan Abramov", 
//       number: "12-43-234345"
//     },
//     { 
//       id: 4,
//       name: "Mary Poppendieck", 
//       number: "39-23-6423122"
//     }
// ]
  
app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
      res.json(people)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(personPhonebook => {
      res.json(personPhonebook)
    })
    .catch((error) => next(error))

})

app.delete('/api/persons/:id', (req, res, next) => {
    // const id = Number(req.params.id)
    // phonebook = phonebook.filter(person => person.id !== id)
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


// const generateId = (() => Math.floor(Math.random() * 1000 ))

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      } 
    const person = new Person({
        name: body.name, 
        number: body.number
    })

    person.save().then(savedPerson =>  {      
      res.json(savedPerson)
    })
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id 
  const personPhonebook = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(id, personPhonebook, {new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    Person.find({}).then(people => {
      let info = `<p>Phonebook has info for ${people.length} people </p>`
      info += new Date()
      res.send(info)
    }).catch(error => next(error))
  })


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    }
  
    next(error)
  }
  
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})