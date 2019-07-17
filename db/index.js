const db = require('./models.js')

db.sync()
.then((data) => {
  console.log('Database Connected!', data)
})
.catch((error) => {
  console.log('There was a error with the database :( ', error)
})

