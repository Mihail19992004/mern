const express = require('express')
const config = require('config')
const router = require('./routes/auth.routes')
const mongoose = require('mongoose')
const app = express()
const PORT = config.get('port') || 5000
app.use('/api/auth', router)
async function start() {
    try {
       await mongoose.connect(config.get('mongoUri'), {
           useUnifiedTopology: true,
           useNewUrlParser: true,
           useCreateIndex: true
       })
        app.listen(PORT, ()=> console.log(`started on port ${PORT}`))
    } catch (e) {
        console.log('server error', e.message)
        process.exit(1)
    }
}
start()