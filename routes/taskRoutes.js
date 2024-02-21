const express = require('express')
const router = express.Router()
const multer = require('multer')
const taskController = require('../controllers/taskController')

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname)
  },
})

const upload = multer({ storage })

// Ruta para obtener todas las tareas
router.get('/tasks', taskController.getAllTasks)

// Ruta para crear una nueva tarea
router.post('/tasks', upload.single('image'), taskController.createTask)

// Ruta para actualizar una tarea existente
router.put('/tasks/:id', taskController.updateTask)

// Ruta para eliminar una tarea
router.delete('/tasks/:id', taskController.deleteTask)

module.exports = router
