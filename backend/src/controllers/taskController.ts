import { Request, Response } from 'express';
import Task from '../models/Task';
import Project from '../models/Project';
import Column from '../models/Column';
import mongoose from 'mongoose'; // For ObjectId validation

// --- Create a new Task ---
export const createTask = async (req: Request, res: Response) => {
  const { projectId, columnId } = req.params;
  const { title, description, dueDate, priority, status } = req.body; // Added status
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(columnId)) {
    return res.status(400).json({ message: 'Invalid Project or Column ID format.' });
  }
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required for the task.' });
  }
  // Optional: Add validation for status enum if applicable here

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found in this project.' });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status, // Added status
      project: projectId,
      column: columnId,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Task validation failed.', details: error.message });
    }
    res.status(500).json({ message: 'Server error while creating task.' });
  }
};

// --- Get all Tasks for a Column ---
export const getTasksForColumn = async (req: Request, res: Response) => {
  const { projectId, columnId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(columnId)) {
    return res.status(400).json({ message: 'Invalid Project or Column ID format.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found in this project.' });
    }

    const tasks = await Task.find({ project: projectId, column: columnId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks for column:', error);
    res.status(500).json({ message: 'Server error while fetching tasks.' });
  }
};

// --- Get a single Task by ID ---
export const getTaskInColumn = async (req: Request, res: Response) => {
  const { projectId, columnId, taskId } = req.params; 
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId) || 
      !mongoose.Types.ObjectId.isValid(columnId) || 
      !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: 'Invalid Project, Column, or Task ID format.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    // Explicit column check although task query also checks it
    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found in this project (verification step).' });
    }

    const task = await Task.findOne({ _id: taskId, column: columnId, project: projectId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found in this column/project.' });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error while fetching task.' });
  }
};

// --- Update a Task ---
export const updateTask = async (req: Request, res: Response) => {
  const { projectId, columnId, taskId } = req.params;
  const { title, description, dueDate, priority, status, columnId: newColumnId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
  if (!mongoose.Types.ObjectId.isValid(projectId) || 
      !mongoose.Types.ObjectId.isValid(columnId) || 
      !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: 'Invalid Project, Column, or Task ID format.' });
  }
  if (newColumnId && !mongoose.Types.ObjectId.isValid(newColumnId)) {
    return res.status(400).json({ message: 'Invalid new Column ID format for moving task.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(403).json({ message: 'Access denied to project. Cannot update task.' });
    }

    let task = await Task.findOne({ _id: taskId, project: projectId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found in this project.' });
    }
    
    // Verify that the task is currently in the column specified by the URL parameter `columnId`
    if (task.column.toString() !== columnId) {
       return res.status(400).json({ message: `Task's current column (${task.column}) does not match the column ID in the URL path (${columnId}). Update from correct path or use move operation.` });
    }

    // Handle task movement to a new column
    if (newColumnId && newColumnId.toString() !== task.column.toString()) {
      const targetColumn = await Column.findOne({ _id: newColumnId, project: projectId });
      if (!targetColumn) {
        return res.status(404).json({ message: 'Target column for move operation not found in this project.' });
      }
      task.column = targetColumn._id; // Update column reference
    }

    // Update other properties
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate; 
    if (priority !== undefined) task.priority = priority; 
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error instanceof Error && error.name === 'ValidationError') {
        return res.status(400).json({ message: 'Task validation failed.', details: error.message });
    }
    res.status(500).json({ message: 'Server error while updating task.' });
  }
};

// --- Delete a Task ---
export const deleteTask = async (req: Request, res: Response) => {
  const { projectId, columnId, taskId } = req.params; 
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }
   if (!mongoose.Types.ObjectId.isValid(projectId) || 
       !mongoose.Types.ObjectId.isValid(columnId) ||
       !mongoose.Types.ObjectId.isValid(taskId)) { 
    return res.status(400).json({ message: 'Invalid Project, Column or Task ID format.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(403).json({ message: 'Access denied to project. Cannot delete task.' });
    }

    const task = await Task.findOne({ _id: taskId, project: projectId, column: columnId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found in the specified project and column.' });
    }
    
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error while deleting task.' });
  }
};