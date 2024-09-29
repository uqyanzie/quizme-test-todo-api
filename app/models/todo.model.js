const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    done: {
        type: Boolean,
        default: false
    },
    doneAt: {
        type: Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
}, {
    timestamps: true
});

TodoSchema.index({ title: 'text', description: 'text' });

const Todo = mongoose.model('todos', TodoSchema);

module.exports = Todo;