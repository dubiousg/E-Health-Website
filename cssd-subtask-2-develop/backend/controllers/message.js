"use strict"

const statusCodes = require('http-status-codes')
const { MONGODB_NAME } = require('../constants')
const Message = require('../models/Message')
const MessageService = require('../database/MessageService')

module.exports = {

    /**
     * Get all messages.
     *
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - messages: An array of the messages found
     * - found: Whether or not messages were found
     */
    getAll: async (request, response) => {

        console.log("message.js: getAll()")
        
        let reply = {
            messages: [],
            found: false,
            message: "" 
        }
        
        try {
            
            let result = await Message.find()

            console.log("message.js: getAll() SUCCESS")

            reply.messages = result
            reply.found = true
            reply.message = "Successfully found messages"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("message.js: getAll() FAILED ", error)

            reply.message = "Something went wrong while trying to fetch all messages"

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Get all messages for a user.
     *
     * Request URL parameters:
     * - :userId, the user id to get messages for
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - messages: An array of the messages found
     * - found: Whether or not messages were found
     */
    getAllForUser: async (request, response) => {

        console.log("message.js: getAllForUser()")
        
        let reply = {
            messages: [],
            found: false,
            message: "" 
        }
        
        try {
            
            let result = await Message.find({
                toUserId: request.params.userId
            })

            console.log("message.js: getAllForUser() SUCCESS")

            reply.messages = result
            reply.found = true
            reply.message = "Successfully found messages"

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("message.js: getAllForUser() FAILED ", error)

            reply.message = "Something went wrong while trying to fetch all messages"

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }

    },

    /**
     * Adds one new message to the database.
     * 
     * Request body parameters:
     * - toUserId: User id of the recipient
     * - fromUserId: User id of the author
     * - msgTitle: The message's title
     * - msgBody: The content of the message
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - sent: Whether the message was added to the database or not
     */
    addOne: async (request, response) => {

        console.log("message.js: addOne() ", request.body)
    
        const messenger = new MessageService(MONGODB_NAME)

        let reply = {
            sent: false,
            message: ""
        }

        try {

            let result = await messenger.send(
                request.body.toUserId,
                request.body.fromUserId,
                request.body.msgTitle,
                request.body.msgBody
            )

            console.log("message.js: addOne() SUCCESS ", result)

            response.status(statusCodes.OK)
            response.json(reply)
            
        } catch (error) {

            console.log("message.js: addOne() FAILED ", error)

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Adds one new message to the database marked for a user.
     * 
     * Request URL parameters:
     * - :userId, the id of the user to send the message to
     * 
     * Request body parameters:
     * - fromUserId: User id of the author
     * - msgTitle: The message's title
     * - msgBody: The content of the message
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - sent: Whether the message was added to the database or not
     */
    addOneToUser: async (request, response) => {

        console.log("message.js: addOneToUser() ")
    
        const messenger = new MessageService(MONGODB_NAME)

        let reply = {
            sent: false,
            message: ""
        }

        try {

            let result = await messenger.send(
                request.params.userId,
                request.body.fromUserId,
                request.body.msgTitle,
                request.body.msgBody
            )

            console.log("message.js: addOneToUser() SUCCESS ", result)

            response.status(statusCodes.OK)
            response.json(reply)
            
        } catch (error) {

            console.log("message.js: addOneToUser() FAILED ", error)

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    }
}