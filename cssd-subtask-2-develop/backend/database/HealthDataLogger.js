"use strict"

const HealthData = require('../models/HealthData')
const DatabaseService = require('./DatabaseService')

module.exports = class HealthDataLogger extends DatabaseService {

    constructor(dbName) {
        super(dbName)
    }

    /**
     * Creates a new health data model object and returns a promise
     * object that will indicate the success or failure of the operation 
     */
    logData(type, value, userId) {

        if (this.isDataSafe(type, value)) {

            let healthData = new HealthData({
                type, value, userId
            })
        
            return healthData.save()
        }

        return Promise.reject(new Error("Unsafe health data"))
    }

    /**
     * Returns true when the given health data type's value is within a range
     * considered safe
     * 
     * @TODO
     */
    isDataSafe(type, value) {

        return true;
    }
}