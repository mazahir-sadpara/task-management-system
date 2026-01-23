import Task from "../models/Task.js";
import mongoose from "mongoose";

// Helper function to transform _id to id
const transformTask = (task) => {
  if (!task) return null;
  const taskObj = task.toObject ? task.toObject() : task;
  const { _id, ...rest } = taskObj;
  return { id: _id.toString(), ...rest };
};

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    const transformedTasks = tasks.map(transformTask);
    res.json(transformedTasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(transformTask(task));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const updated = await Task.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(transformTask(updated));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID format
    if (!id || id === "undefined" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const deleted = await Task.findByIdAndDelete(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
