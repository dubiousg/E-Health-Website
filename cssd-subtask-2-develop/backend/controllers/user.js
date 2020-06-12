"use strict"

const statusCodes = require('http-status-codes')
const User = require('../models/User')

module.exports = {
    
    /**
     * Get all users.
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - found: Whether or not users were found
     * - users: An array of the users found
     */
    getAll: async (request, response) => {

        console.log("user.js: getAll()")
        
        let reply = {
            message: "",
            found: false,
            users: [] 
        }
        
        try {
            
            let result = await User.find()

            console.log("user.js: getAll() SUCCESS")

            reply.message = "Successfully found users"
            reply.found = true
            reply.users = []

            for (let user of result) {
                reply.users.push({
                    id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    joinDate: user.joinDate,
                    type: user.type
                })
            }

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("user.js: getAll() FAILED ", error)

            reply.message = "Something went wrong while trying to fetch all users"

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Get one user.
     * 
     * Request URL parameters:
     * - :userId, the user id to get
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - found: Whether or not the user was found
     * - user: An object containing the id, username, firstname, lastname, and
     *         creation date of the authenticated account
     */
    getOne: async (request, response) => {

        console.log("user.js: getOne()")

        let reply = {
            message: "",
            found: false,
            user: {} 
        }

        try {

            let result = await User.findById(request.params.userId)

            if (!result)
                throw new Error("Invalid user id")

            console.log("user.js: getOne() SUCCESS")

            reply.message = "Successfully found user"
            reply.found = true
            reply.user = {
                id: result._id,
                username: result.username,
                firstName: result.firstName,
                lastName: result.lastName,
                joinDate: result.joinDate,
                type: result.type
            }

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {
        
            console.log("user.js: getOne() FAILED")

            if (!request.params.userId) {

                reply.message = "No user id given"

                reply.status(statusCodes.BAD_REQUEST)
            }
            else {

                reply.message = "Invalid user id"

                response.status(statusCodes.BAD_REQUEST)
            }
            
            reply.error = error
            
            response.json(reply)
        }
    },

    /**
     * Adds one new user account to the database.
     * 
     * Request body parameters:
     * - username: Unique username used to login
     * - firstName: The user's first name
     * - lastName: The user's last name
     * - password: The password to be used to login
     * - password: The user's DOB (YYY-MM-DD)
     * - type: The type of user account ("Patient" or "Doctor")
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - added: Whether the user was added to the database or not
     * - user: An object containing the id, username, firstname, lastname,
     *         and creation date of the new account
     */
    addOne: async (request, response) => {

        console.log("user.js: addOne() ", request.body)

        let reply = {
            message: "",
            added: false,
            user: {}
        }

        try {

            const user = new User(request.body)
            let result = await user.save()

            console.log("user.js: addOne() SUCCESS")

            reply.message = "Successfully created your account"
            reply.added = true
            reply.user = {
                id: result._id,
                username: result.username,
                firstName: result.firstName,
                lastName: result.lastName,
                joinDate: result.joinDate,
                type: result.type
            }

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("user.js: addOne() FAILED ")

            reply.error = error
            reply.message = "Something went wrong when trying to create your account"
            response.status(statusCodes.INTERNAL_SERVER_ERROR)

            if (error) {

                if (error.name === "ValidationError") {
                    response.status(statusCodes.BAD_REQUEST)
                }

                // E11000 duplicate key error collection
                if (error.code === 11000) {
                    reply.message = `An account already exists with the username ${request.body.username}`
                    response.status(statusCodes.BAD_REQUEST)
                }
            }

            response.json(reply)
        }
    },

    /**
     * Authenticates a user.
     * 
     * Request body parameters:
     * - username: The username of the account to authenticate
     * - password: The password used to match with the stored password
     *             for the account with the given username
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - authenticated: Whether the given username and password was a match or not
     * - user: An object containing the id, username, firstname, lastname, and
     *         creation date of the authenticated account
     */
    auth: async (request, response) => {

        console.log("user.js: auth()")

        let reply = {
            message: "",
            authenticated: false,
            user: {},
        }

        try {

            let user = await User.findOne({ username: request.body.username })

            // if user was null, then the user didn't provide a username that exists
            // within the database. send a reply and bail
            if (!user && request.body.username) {

                reply.message = "We couldn't log you in using the given details"

                response.status(statusCodes.BAD_REQUEST)
            }
        
            let match = await user.testPassword(request.body.password)

            // if match isn't true, then the user didn't provide the correct password
            // for the account with the given username
            if (!match && request.body.password) {

                reply.message = "We couldn't log you in using the given details"

                response.status(statusCodes.BAD_REQUEST)
            }

            // if user and match are truthy, then we have a successful login
            if (user && match) {

                console.log("user.js: auth() SUCCESS")

                reply.message = "Successfully logged in"
                reply.authenticated = true
                reply.user = {
                    id: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    joinDate: user.joinDate,
                    type: user.type
                }

                response.status(statusCodes.OK)
            }
            // else the request was malformed
            else {

                throw Error("Invalid login request")
            }

            response.json(reply)
        }
        catch (error) {

            console.log("user.js: auth() FAILED")

            // handle no given username
            if (!request.body.username) {
                reply.message = "Please fill out all required fields before submitting"
            }

            // handle no given password
            if (!request.body.password) {
                reply.message = "Please fill out all required fields before submitting"
            }

            if (!request.body.username || !request.body.password)
                response.status(statusCodes.BAD_REQUEST)
            
            reply.error = error
            
            response.json(reply)
        }
    }
}