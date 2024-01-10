const { restart } = require('nodemon')
const { Users, Thoughts } = require('../models');

// Aggregate function to get the number of Userss overall

// Aggregate function for getting the overall grade using $avg

  

module.exports = {
  // Get all Userss
  async getThoughts(req, res) {
    try {
      const Userss = await Users.find();

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
  // Get a single Users
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
  // create a new Users
  async createThought(req, res) {
    try {
      const Users = await Users.create(req.body);
      res.json(Users);
    } catch (err) {
      res.status(500).json(err);
    }
  },




  
  // Delete a Users and remove them from the Thoughts
  async deleteUsers(req, res) {
    try {
      const Users = await Users.findOneAndRemove({ _id: req.params.UsersId });

      if (!Users) {
        return res.status(404).json({ message: 'No such Users exists' });
      }

      const Thoughts = await Thoughts.findOneAndUpdate(
        { Userss: req.params.UsersId },
        { $pull: { Userss: req.params.UsersId } },
        { new: true }
      );

      if (!Thoughts) {
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
