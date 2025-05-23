import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from './Project'; // Added import
import { IColumn } from './Column';   // Added import

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  project: IProject['_id']; // Added project field
  column: IColumn['_id'];   // Added column field
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true,
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  column: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
    required: true,
  },
}, {
  timestamps: true
});

export default mongoose.model<ITask>('Task', TaskSchema); 