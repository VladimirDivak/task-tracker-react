import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from './Project'; // Assuming Project model is in Project.ts

export interface IColumn extends Document {
  name: string;
  project: IProject['_id']; // Reference to Project's ObjectId
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ColumnSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project', // This should match the model name 'Project'
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IColumn>('Column', ColumnSchema);
