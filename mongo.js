const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://waichee1998:${password}@cluster0.bwlzd4q.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const person = new Person({
    name: personName,
    number: personNumber,
  })

  person.save().then(() => {
    console.log(`added ${personName} number ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
} else if(process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach (personDetails => {
      console.log(`${personDetails.name} ${personDetails.number}`)
    })
    mongoose.connection.close()
  })
}
