import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User'; // Assuming User model is in User.ts

export interface IProject extends Document {
  name: string;
  createdBy: IUser['_id']; // Reference to User's ObjectId
  // members?: IUser['_id'][]; // Optional members array
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This should match the model name 'User'
    required: true,
  },
  // members: [{ // Optional members array
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  // }],
}, {
  timestamps: true,
});

export default mongoose.model<IProject>('Project', ProjectSchema);
