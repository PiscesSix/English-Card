const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')
const mongoClient = require('mongoose')


mongoClient.connect("mongodb://127.0.0.1:27017/englishDB")
    .then(() => console.log('Connected database from mongodb'))
    .catch(() => console.log('Error in connecting database from mongodb'))

const app = express()

const userRoute = require('./routes/user')

app.use(morgan('dev'))
app.use(bodyParser.json())

app.use('/users', userRoute)

app.use((req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    return res.status(status).json({
        error: {
            message: error.message
        }
    })
})

app.use('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Server is Okkk and running...'
    })
})

const port = app.get('port') || 3000
app.listen(port, () => {
    console.log("Server is running...")
})