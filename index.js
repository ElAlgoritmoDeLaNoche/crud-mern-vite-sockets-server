// backend/server.js

const express = require('express')
const http = require('http')
const mongoose = require('mongoose')
const cors = require('cors')

// Importar las rutas de las tareas
const taskRoutes = require('./routes/taskRoutes')

// Configurar el servidor Express
const app = express()
const server = http.createServer(app)

// Configurar conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mern_socket')

mongoose.connection.on('connected', () => {
  console.log('Conexión a MongoDB establecida')
})

// Usar el middleware de CORS para permitir solicitudes desde cualquier origen
app.use(cors())

app.use('/uploads', express.static('uploads'))

// Configurar middleware
app.use(express.json())

// Configurar middleware para las rutas de las tareas
app.use('/api', taskRoutes);

// Configurar rutas
app.get('/api', (req, res) => {
  res.send('API está en funcionamiento')
})

// Configurar el puerto del servidor
const PORT = process.env.PORT || 5002
server.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`)
})
