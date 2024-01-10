const { restart } = require('nodemon')
const { Thoughts, Users } = require('../models');

// Aggregate function to get the number of Userss overall

// Aggregate function for getting the overall grade using $avg

  

module.exports = {
  // Get all Userss
  async getThoughts(req, res) {
    try {
      const thought = await Thoughts.find();

      const UsersObj = {
        Userss,
        headCount: await headCount(),
      };

      res.json(UsersObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getOneThought(req, res) {
    try {
      const Users = await Users.findOne({ _id: req.params.UsersId })
        .select('-__v');

      if (!Users) {
        return res.status(404).json({ message: 'No Users with that ID' })
      }

      res.json({
        Users,
        grade: await grade(req.params.UsersId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  
  // create a new thought
  async createThought(req, res) {
    try {
        const thought = await Thoughts.create(req.body)
        const userData = await Users.findOneAndUpdate(
            { _id: req.body.userId},
            { $push: { thoughts: thought._id}},
            { new: true}
        )
        res.json(thought)
    } catch (err) {
        res.status(500).json(err)
    }
},

async updateThought(req, res) {
    try {
        const thought = await Thoughts.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true }
        )
        if (!thought) {
            return res.status(404).json({ message: 'No thought found with that ID!' })
        }
        res.json(thought)
    } catch (err) {
        res.status(500).json(err)
    }
},
async deleteThought(req, res) {
  try {
      const thought = await Thoughts.findOneAndDelete({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true }
      )
      if (!thought) {
          return res.status(404).json({ message: 'No thought found with that ID!' })
      }
      res.json(thought)
  } catch (err) {
      res.status(500).json(err)
  }
},


async addReaction(req, res) {
  try {
    const reaction = await Users.findOneAndRemove({ _id: req.params.UsersId },
{ $addToSet: {reactions: req.body} }, 
{ runValidators: true, new: true }
    )
    if (!reaction) {
      return res.status(404).json({ message: 'No such Users exists' });
    }
    res.json(reaction)
  } catch (err) { 
    res.status(500).json(err)
  }
}, 


  // Delete a Users and remove them from the Thoughts
  async deleteReaction(req, res) {
    try {
      const reaction = await Users.findOneAndRemove({ _id: req.params.UsersId });

      if (!reaction) {
        return res.status(404).json({ message: 'No such Users exists' });
      }

      const reactionss = await Thoughts.findOneAndUpdate(
        { Userss: req.params.UsersId },
        { $pull: { Userss: req.params.UsersId } },
        { new: true }
      );

      if (!reactionss) {
        return res.status(404).json({
          message: 'Users deleted, but no Thoughtss found',
        });
      }

      res.json({ message: 'Users successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
