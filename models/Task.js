const mongoose = require('mongoose')

// Definir el esquema de la tarea
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

// Crear el modelo de tarea
const Task = mongoose.model('Task', taskSchema)

// Exportar el modelo de tarea
module.exports = Task
