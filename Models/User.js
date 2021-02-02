const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const user_schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
        default: new Date(),
    },
    avatar: {
        type: String,
        //TODO : add default avatar
    }

});


const User = mongoose.model('User', user_schema);
module.exports = User;
