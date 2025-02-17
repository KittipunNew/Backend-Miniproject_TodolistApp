import taskModel from '../model/taskModel.js';

const taskList = async (req, res) => {
  try {
    const task = await taskModel.find({}).exec();
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

const addTask = async (req, res) => {
  try {
    const task = await taskModel(req.body).save();
    console.log(req.body);
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.body._id;
    const update = await taskModel
      .findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      })
      .exec();
    res.send(update);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

const deleteTask = async (req, res) => {
  try {
    const id = req.body._id;
    const remove = await taskModel.findOneAndDelete({ id }).exec();
    res.send(remove);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

export { addTask, taskList, updateTask, deleteTask };
