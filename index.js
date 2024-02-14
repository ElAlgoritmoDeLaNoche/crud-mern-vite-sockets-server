// backend/server.js

const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')

const taskController = require('./controllers/taskController')

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

// Configurar middleware
app.use(express.json())

// Configurar middleware para las rutas de las tareas
app.use('/api', taskRoutes)

// Configurar rutas
app.get('/api', (req, res) => {
  res.send('API está en funcionamiento')
})

// Configurar socket.io con opciones para permitir solicitudes desde un origen específico
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Opcional: métodos permitidos
  },
})

// Manejar eventos de socket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado')

  // Manejar evento para enviar un mensaje desde el cliente al servidor
  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido desde el cliente:', data)

    // Emitir el mensaje a todos los clientes conectados (broadcast)
    io.emit('mensaje', data)
  })

  // Manejar evento para crear una nueva tarea
  socket.on('crearTarea', async (data) => {
    try {
      const newTask = await taskController.createTask(data.title, data.description, data.dueDate, data.priority, data.completed, io)
      console.log('Tarea creada:', newTask)
    } catch (error) {
      console.error('Error al crear y guardar la tarea:', error)
      // Si ocurrió un error, puedes emitir un evento de error al cliente
      socket.emit('error', { message: 'Error al crear y guardar la tarea' })
    }
  })

  // Manejar evento para editar una tarea existente
  socket.on('editarTarea', async (data) => {
    try {
      const updatedTask = await taskController.updateTask(data, io); // Pasar el objeto completo de datos al controlador
      console.log('Tarea editada:', updatedTask);
    } catch (error) {
      console.error('Error al editar la tarea:', error);
      // Emitir un evento de error al cliente si ocurre un error
      socket.emit('error', { message: 'Error al editar la tarea' });
    }
  });

  // Manejar evento cuando un cliente se desconecta
  socket.on('disconnect', () => {
    console.log('Cliente desconectado')
  })
})

// Configurar el puerto del servidor
const PORT = process.env.PORT || 5002
server.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`)
})