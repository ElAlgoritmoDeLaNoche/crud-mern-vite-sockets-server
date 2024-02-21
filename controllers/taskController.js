const Task = require('../models/Task')
const fs = require('fs')
const path = require('path')

exports.getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find()
		res.status(200).json(tasks)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server Error' })
	}
}

exports.createTask = async (req, res) => {
	try {
		const { title, description } = req.body
		const imageUrl = req.file.path // Multer stores the uploaded file path in req.file.path
		const task = new Task({ title, description, imageUrl })
		await task.save()
		res.status(201).json(task)
	} catch (error) {
		console.error(error)
		res.status(500).json({ message: 'Server Error' })
	}
}

exports.updateTask = async (req, res) => {

	const { id } = req.params
	const { title, description } = req.body

	try {
		const updatedTask = await Task.findByIdAndUpdate(id, { title, description }, { new: true })
		res.status(200).json(updatedTask)
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
}

exports.deleteTask = async (req, res) => {
	const { id } = req.params;

	try {
		// Buscar la tarea por ID
		const task = await Task.findById(id);

		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}

		// Eliminar la imagen asociada si existe
		if (task.imageUrl) {
			fs.unlinkSync(path.join(__dirname, '..', task.imageUrl));
		}

		// Eliminar la tarea de la base de datos
		await Task.findByIdAndDelete(id);

		res.status(200).json({ message: 'Task deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server Error' });
	}
}