import { Request, Response } from 'express';
import Project from '../models/Project'; // Assuming Project model path
import User from '../models/User'; // Assuming User model path, for createdBy population

// --- Create a new Project ---
export const createProject = async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user?.id; // From protect middleware

  if (!name) {
    return res.status(400).json({ message: 'Project name is required.' });
  }

  if (!userId) {
    // This case should ideally be prevented by the protect middleware
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const newProject = new Project({
      name,
      createdBy: userId,
    });

    const savedProject = await newProject.save();
    // Optionally populate createdBy if you need user details immediately
    // const populatedProject = await Project.findById(savedProject._id).populate('createdBy', 'username email');
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error while creating project.' });
  }
};

// --- Get all Projects for the logged-in user ---
export const getProjects = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const projects = await Project.find({ createdBy: userId })
      .populate('createdBy', 'username email') // Populate with username and email
      .sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error while fetching projects.' });
  }
};

// --- Get a single Project by ID ---
export const getProjectById = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId })
      .populate('createdBy', 'username email'); // Populate for context

    if (!project) {
      // Could be due to not found or not owned by user
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project by ID:', error);
    if (error instanceof Error && error.name === 'CastError') { // Mongoose CastError for invalid ObjectId
        return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    res.status(500).json({ message: 'Server error while fetching project.' });
  }
};

// --- Update a Project ---
export const updateProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const { name } = req.body;
  const userId = req.user?.id;

  if (!name) {
    return res.status(400).json({ message: 'Project name is required for update.' });
  }
  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    project.name = name;
    const updatedProject = await project.save();
    // const populatedProject = await Project.findById(updatedProject._id).populate('createdBy', 'username email');
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    res.status(500).json({ message: 'Server error while updating project.' });
  }
};

// --- Delete a Project ---
export const deleteProject = async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated.' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, createdBy: userId });

    if (!project) {
      return res.status(404).json({ message: 'Project not found or access denied.' });
    }

    // Note: Add logic here to delete associated Columns and Tasks if necessary
    // For now, just deleting the project itself.
    // Example:
    // await Column.deleteMany({ project: projectId });
    // await Task.deleteMany({ project: projectId });

    await project.deleteOne(); // Use deleteOne() on the document

    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    console.error('Error deleting project:', error);
    if (error instanceof Error && error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    res.status(500).json({ message: 'Server error while deleting project.' });
  }
};
