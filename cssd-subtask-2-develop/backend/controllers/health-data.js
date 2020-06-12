"use strict"

const statusCodes = require('http-status-codes')
const { MONGODB_NAME } = require('../constants')
const HealthDataLogger = require('../database/HealthDataLogger')
const HealthDataRetriever = require('../database/HealthDataRetriever')

module.exports = {

    /**
     * Get all health data records.
     * 
     * Request body parameters
     * - (OPTIONAL) type: the type of health data to get
     * - (OPTIONAL) userId: the id of the user to get health data for
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - found: Whether or not health data records were found
     * - healthDataRecords: An array containing all health records sanitised of identifying
     *   information
     */
    getAll: async (request, response) => {

        console.log("health-data.js: getAll()")

        const retriever = new HealthDataRetriever(MONGODB_NAME)

        let reply = {
            message: "",
            found: false,
            healthDataRecords: []
        }

        try {

            const type = (request.body && request.body.type) ? request.body.type : undefined
            const userId = (request.body && request.body.userId) ? request.body.userId : undefined

            let result = await retriever.getData(type, userId)

            console.log("health-data.js: getAll() SUCCESS")

            reply.message = "Successfully found health data"
            reply.found = true

            for (let healthData of result) {
                
                const sanitised = {
                    date: healthData.date,
                    type: healthData.type,
                    value: healthData.value
                }

                reply.healthDataRecords.push(sanitised)
            }
            
            
            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("health-data.js: getAll() FAILED")

            reply.error = error
            reply.message = "Something went wrong while trying to fetch all health data"

            response.status(statusCodes.INTERNAL_SERVER_ERROR)
            response.json(reply)
        }
    },

    /**
     * Get all health data records for a given user
     * 
     * Request URL parameters:
     * - :userId, the user to fetch health data for
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - found: Whether or not health data records were found
     * - healthDataRecords: An array containing the user's health records
     */
    getAllForUser: async (request, response) => {

        console.log("health-data.js: getAllForUser()")

        const retriever = new HealthDataRetriever(MONGODB_NAME)

        let reply = {
            message: "",
            found: false,
            healthDataRecords: []
        }

        try {

            let result = await retriever.getDataForUser(request.params.userId)

            console.log("health-data.js: getAllForUser() SUCCESS")

            reply.message = "Successfully found health data"
            reply.found = true
            reply.healthDataRecords = result
            
            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("health-data.js: getAllForUser() FAILED")

            reply.error = error
            reply.message = "Something went wrong while trying to fetch the user's health data"

            if (!request.params.userId) {
                response.status(statusCodes.BAD_REQUEST)
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR)
            }

            response.json(reply)
        }
    },

    /**
     * Adds one new piece of health data to the database.
     * 
     * Request URL parameters:
     * - :userId, the user to post a piece of health data for
     * 
     * Request body parameters:
     * - type: The type of health data this is
     * - value: The value of the item of health data
     * - (OPTIONAL) date: The date of which the health data was recorded at
     * 
     * Reply object properties:
     * - message: A short message describing the success of the call
     * - added: Whether the user was added to the database or not
     * - healthData: The the added health data object
     */
    addOne: async (request, response) => {

        console.log("health-data.js: addOne()")

        const logger = new HealthDataLogger(MONGODB_NAME)

        let reply = {
            message: "",
            added: false,
            healthData: {}
        }

        try {

            let result = await logger.logData(request.body.type, request.body.value, request.params.userId)

            console.log("health-data.js: addOne() SUCCESS")

            reply.message = "Successfully saved health data"
            reply.added = true
            reply.healthData = result

            response.status(statusCodes.OK)
            response.json(reply)
        }
        catch (error) {

            console.log("health-data.js: addOne() FAILURE", error)

            reply.error = error
            reply.message = "Something went wrong while trying to save new health data for a user"

            if ((error && error.name === "ValidationError") ||
                !request.params.userId ||
                !request.body ||
                !request.body.type ||
                !request.body.value) {
                response.status(statusCodes.BAD_REQUEST)
            }
            else {
                response.status(statusCodes.INTERNAL_SERVER_ERROR)
            }
            
            response.json(reply)
        }
    }
}