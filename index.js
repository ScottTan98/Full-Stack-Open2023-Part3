const express = require('express')
const app = express()

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

let phonebook = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]
  
app.get('/api/persons', (req, res) => {
    res.json(phonebook)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phonebook.find(person => person.id === id)
    if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(person => person.id !== id)

    res.status(204).end()
})


const generateId = (() => Math.floor(Math.random() * 1000 ))

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })
      } else if (phonebook.find(person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'Name must be unique' 
          })
      }
    
    const person = {
        id: generateId(),
        name: body.name, 
        number: body.number
    }

    phonebook = phonebook.concat(person)
    res.json(person)
})


app.get('/info', (req, res) => {
    let info = `<p>Phonebook has info for ${phonebook.length} people </p>`
    info += new Date()
    res.send(info)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})