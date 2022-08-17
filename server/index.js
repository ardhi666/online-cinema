const express = require('express')
const app = express()
const port = 5000
const router = require('./src/routes')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')

require('dotenv').config()

app.use("/uploads", express.static("uploads"))
app.use(cors());
app.use(express.json())
app.use('/api/v1/', router)

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000' // define client origin if both client and server have different origin
    }
})

require('./src/socket')(io)


server.listen(port, console.log(`Server Running on port ${port}`))