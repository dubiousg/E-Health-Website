"use strict"

const HealthData = require('../models/HealthData')
const DatabaseService = require('./DatabaseService')

module.exports = class HealthDataRetriever extends DatabaseService {

    constructor(dbName) {
        super(dbName)
    }

    /**
     * Returns a mongoose query object that will find all health data points
     * with the given type
     */
    getData(type, userId) {

        let opts = {

        }

        if (typeof userId == "string") {

            opts.type = type
        }

        if (typeof userId == "number") {

            opts.userId = userId
        }

        return HealthData.find(opts)
    }

    /**
     * Returns a mongoose query object that will find all health data points
     * for the given userId
     */
    getDataForUser(userId) {

        return HealthData.find({
            userId: userId
        })
    }
}