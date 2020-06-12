"use strict";

const mongoose = require("mongoose")

/**
 * Defines the schema for a message from a doctor to their patient
 */
const messageSchema = new mongoose.Schema({

    /**
     * The id of the user the message is intended for
     */
    toId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    /**
     * The id of the user who authored the message
     */
    fromId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    /**
     * The message title
     */
    title: {
        type: String,
        required: true
    },

    /**
     * The message body
     */
    body: {
        type: String,
        required: true
    },

    /**
     * The time of which this record is being saved at
     */
    date: {
        type: Date,
        default: new Date()
    }
}, { collection: 'message' })

module.exports = mongoose.model("Message", messageSchema)