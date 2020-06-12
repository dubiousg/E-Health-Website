"use strict"

const Message = require('../models/Message')
const DatabaseService = require('./DatabaseService')

module.exports = class MessageService extends DatabaseService {

    constructor(dbName) {
        super(dbName)
        console.log("THIS", this)
    }

    /**
     * Creates a new message data model object and returns a promise object that
     * will indicate the success or faulure of the operation
     */
    send(toUserId, fromUserId, msgTitle, msgBody) {

        let message = new Message({
            toId: toUserId,
            fromId: fromUserId,
            title: msgTitle,
            body: msgBody
        })
    
        return message.save()
    }

    /**
     * Returns a mongoose query object that will find all messages for the user
     * with the given id
     */
    get(forUserId) {

        return Message.find({
            toId: forUserId
        })
    }
}