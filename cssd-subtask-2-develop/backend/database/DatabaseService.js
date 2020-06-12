"use strict"

const mongoose = require("mongoose")

/**
 * The base class for each different database service type to inherit.
 * 
 * This base class handles the initial creation of the mongoose connection to
 * mongodb.
 */
module.exports = class DatabaseService {

    constructor(dbName) {
        console.log(dbName)
        this.setupConnection(dbName)
    }

    /**
     * Opens the mongodb connection using mongoose
     */
    setupConnection(dbName) {

        if (mongoose.connection.readyState != 0)
            return

        mongoose.connect(
            `mongodb://localhost:27017/${dbName}`,
            { useNewUrlParser: true }
        )
        .then(success => {
            mongoose.set("useCreateIndex", true)
            mongoose.set('useFindAndModify', false)
            console.log(`Succesfully conntected to mongodb on port ${27017}`)
            mongoose.connection.on("close", () => {this.connection = false})
        })
        .catch(error => {
            console.error("Unable to connect to mondodb. Perhaps mongo isn't installed?")
            console.log(error)
        })
    }

    /**
     * Sets up an object to be used when replying to a request
     */
    static makeResponseObject(defaultData) {
        return {
            error: false,
            message: "",
            data: defaultData
        }
    }
}