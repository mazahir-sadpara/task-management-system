import Task from "../models/Task.js";

// GET all tasks
export const getTasks = async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
};

// CREATE task
export const createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

// UPDATE task
export const updateTask = async (req, res) => {
  const updated = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
};

// DELETE task
export const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};
