const { Todo, User } = require('../models');

const Joi = require('joi');

const todoSchema =  Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
});

// Create and Save a new Todo
const create = async (req, res) => {
    // Validate request
    const { error, value } = todoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findById(req.user.id);

    // Create a Todo
    const todo = new Todo({
        title: value.title,
        description: value.description,
        done: false,
        doneAt: null,
        user: user
    });

    // Save Todo in the database
    try {
        const data = await todo.save();
        res.status(201).json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Retrieve all Todos from the database.
const findAll = async (req, res) => {

    try {
        const user = await User.findById(req.user.id);

        let data;

        let { done, page, limit } = req.query;

        if (done) {
            data = await Todo.find({ user: user, done: done }).limit(limit * 1).skip((page - 1) * limit).exec();
        } else {
            data = await Todo.find({ user: user }).limit(limit * 1).skip((page - 1) * limit).exec();
        }

        res.status(200).json({ 
            success: true,
            page: page,
            limit: limit, 
            data : data,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Find a single Todo with an id
const findOne = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user.id);

    try {
        const data = await Todo.findOne({ _id: id });
        if (!data) {
            return res.status(404).json({ success: false, message: "Todo not found with id " + id });
        }
        if (data.user.toString() !== user._id.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Update a Todo by the id in the request
const update = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user.id);

    // Validate request
    const { error, value } = todoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const data = await Todo
            .findOneAndUpdate({ _id: id, user: user }, value, { new: true });
        if (!data) {
            return res.status(404).json({ success: false, message: "Todo not found with id " + id });
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

// Delete a Todo with the specified id in the request
const remove = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user.id);

    try {
        const data = await Todo
            .findOneAndRemove({ _id: id, user: user });
        if (!data) {
            return res.status(404).json({ success: false, message: "Todo not found with id " + id });
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const setDone = async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(req.user.id);

    try {
        const data = await Todo
            .findOneAndUpdate({ _id: id, user: user }, { done: true, doneAt: new Date() }, { new: true });
        if (!data) {
            return res.status(404).json({ success: false, message: "Todo not found with id " + id });
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    create,
    findAll,
    findOne,
    update,
    remove,
    setDone
};
