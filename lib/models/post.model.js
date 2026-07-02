import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    tags: [{ type: String, required: true, lowescase: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    published: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

const postModel = mongoose.models.Post || mongoose.model('Post', postSchema);
export default postModel;
