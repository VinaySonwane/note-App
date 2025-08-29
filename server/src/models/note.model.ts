import mongoose, { Document, Schema, Types } from "mongoose";

export interface INote extends Document {
  user: Types.ObjectId;
  content: string;
}

const noteSchema: Schema<INote> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // This creates a reference to the User model
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote>("Note", noteSchema);
export default Note;
