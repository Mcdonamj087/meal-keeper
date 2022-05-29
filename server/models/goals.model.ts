import {Schema, model, ObjectId} from 'mongoose';

export interface IGoal {
  text: string;
  user: ObjectId | string;
  createdAt: string;
  updatedAt: string;
}

const goalSchema = new Schema<IGoal>(
  {
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // creates updatedAt and createdAt fields
  }
);

export default model<IGoal>('Goal', goalSchema);
