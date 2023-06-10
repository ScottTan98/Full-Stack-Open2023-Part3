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
  Person.findById(request.params.id)
    .then(personPhonebook => {
      res.json(personPhonebook)
    })
    .catch((error) => {
      res.status(404).end()
    })

})

app.delete('/api/persons/:id', (req, res) => {
    // const id = Number(req.params.id)
    // phonebook = phonebook.filter(person => person.id !== id)

    res.status(204).end()
})


// const generateId = (() => Math.floor(Math.random() * 1000 ))

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      } 
      // else if (phonebook.find(person => person.name === body.name)) {
      //   return res.status(400).json({ 
      //       error: 'Name must be unique' 
      //     })
      // }
    
    const person = new Person({
        name: body.name, 
        number: body.number
    })

    person.save().then(savedPerson =>  {      
      res.json(savedPerson)
    })
})


app.get('/info', (req, res) => {
    let info = `<p>Phonebook has info for ${phonebook.length} people </p>`
    info += new Date()
    res.send(info)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})