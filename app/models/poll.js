'use strict';

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var Poll = new Schema({
    _creator : { type: String, ref: 'LocalUser' },
    title: {
        type: String,
        trim: true,
        required: [true, 'The field "title" is required']
    },
    totalclicks: {
        type: Number,
        default: 0
    },
    nboptions: {
        type: Number,
        default: 0
    },
    options: [{
        title: {
            type: String,
            required: [true, 'The option cannot be empty']
        },
        nbclicks: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('Poll', Poll);