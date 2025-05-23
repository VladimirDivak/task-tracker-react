import { Request, Response } from 'express';
import Column from '../models/Column'; // Assuming Column model path
import Project from '../models/Project'; // Assuming Project model path
// import Task from '../models/Task'; // For future cascading deletes

// --- Create a new Column ---
export const createColumn = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { projectId } = req.params;
  const userId = req.user?.id;

  if (!name) {
    return res.status(400).json({ message: 'Column name is required.' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    // Verify project exists and is owned by user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    // Check column limit (max 10 per project)
    const columnCount = await Column.countDocuments({ project: projectId });
    if (columnCount >= 10) {
      return res.status(400).json({ message: 'Maximum 10 columns per project reached.' });
    }

    // Determine order (simple count for now, or find max order + 1)
    const order = columnCount; // Or: const maxOrderCol = await Column.findOne({ project: projectId }).sort({ order: -1 }); order = maxOrderCol ? maxOrderCol.order + 1 : 0;


    const newColumn = new Column({
      name,
      project: projectId,
      order,
    });

    const savedColumn = await newColumn.save();
    res.status(201).json(savedColumn);
  } catch (error) {
    console.error('Error creating column:', error);
    if (error instanceof Error && error.name === 'CastError' && (error as any).path === '_id') {
        return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    res.status(500).json({ message: 'Server error while creating column.' });
  }
};

// --- Get all Columns for a Project ---
export const getColumnsForProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    // Verify project exists and is owned by user
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    const columns = await Column.find({ project: projectId }).sort({ order: 'asc' });
    res.status(200).json(columns);
  } catch (error) {
    console.error('Error fetching columns for project:', error);
    if (error instanceof Error && error.name === 'CastError' && (error as any).path === '_id') {
        return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    res.status(500).json({ message: 'Server error while fetching columns.' });
  }
};

// --- Update a Column ---
export const updateColumn = async (req: Request, res: Response) => {
  const { projectId, columnId } = req.params;
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name) {
    return res.status(400).json({ message: 'Column name is required for update.' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(403).json({ message: 'Access denied to project.' });
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found in this project.' });
    }

    column.name = name;
    // Note: Updating order is not handled here.
    const updatedColumn = await column.save();
    res.status(200).json(updatedColumn);
  } catch (error) {
    console.error('Error updating column:', error);
    if (error instanceof Error && error.name === 'CastError') { // Catches invalid ObjectId for projectId or columnId
        return res.status(400).json({ message: 'Invalid ID format for project or column.' });
    }
    res.status(500).json({ message: 'Server error while updating column.' });
  }
};

// --- Delete a Column ---
export const deleteColumn = async (req: Request, res: Response) => {
  const { projectId, columnId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    // Verify project ownership
    const project = await Project.findOne({ _id: projectId, createdBy: userId });
    if (!project) {
      return res.status(403).json({ message: 'Access denied to project.' });
    }

    const column = await Column.findOne({ _id: columnId, project: projectId });
    if (!column) {
      return res.status(404).json({ message: 'Column not found in this project.' });
    }

    // TODO: Future - Handle tasks in the column being deleted.
    // e.g., await Task.deleteMany({ column: columnId });
    // Or move tasks to a default/archive column.

    await column.deleteOne();

    res.status(200).json({ message: 'Column deleted successfully.' });
  } catch (error) {
    console.error('Error deleting column:', error);
     if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format for project or column.' });
    }
    res.status(500).json({ message: 'Server error while deleting column.' });
  }
};
