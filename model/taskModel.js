import mongoose from 'mongoose';

const taskSchema = mongoose.Schema({
  title: { type: String },
  checked: { type: Boolean },
});

const taskModel = mongoose.model('task', taskSchema);

export default taskModel;
