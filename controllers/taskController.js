const Task = require('../models/Task')

// Controlador para obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Controlador para crear una nueva tarea
exports.createTask = async (title, description, dueDate, priority, completed, io) => {
  try {
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      completed: completed || false,
    })

    const newTask = await task.save()
    io.emit('tareaCreada', newTask)
    return newTask
  } catch (error) {
    console.error('Error al crear y guardar la tarea:', error)
    throw new Error('Error al crear y guardar la tarea')
  }
}

// Controlador para actualizar una tarea existente
exports.updateTask = async (data, io) => {
  try {
    const { id, title, description } = data;
    const task = await Task.findByIdAndUpdate(id, { title, description }, { new: true });

    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    io.emit('tareaEditada', task);
    console.log('Tarea editada:', task);
    return task;
  } catch (error) {
    console.error('Error al editar la tarea:', error);
    throw new Error('Error al editar la tarea');
  }
};

// Controlador para eliminar una tarea
exports.deleteTask = async (req, res) => {

}
