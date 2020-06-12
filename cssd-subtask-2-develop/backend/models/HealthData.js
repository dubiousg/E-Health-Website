"use strict";

const mongoose = require("mongoose")

/**
 * A list of allowed data types, used in the schema for type
 * validation.
 * 
 * This array mimicks the HealthDataType enumeration on the
 * static diagram (javascript doesn't natively support enums).
 */
const healthDataType = [
    "BeatsPerMinute",
    "SystolicPressure",
    "DiasystolicPressure",
    "Steps",
    "DistanceTravelled",
    "TimeSlept",
    "CaloriesBurnt"
]

/**
 * Defines the schema for a health data document
 */
const healthDataSchema = new mongoose.Schema({

    /**
     * The user this piece of health data is for
     */
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    /**
     * What this item of health data is attributed to.
     * Only values within healthDataType are allowed.
     */
    type: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return healthDataType.indexOf(v) > -1;
            },
            message: props => `${props.value} is not a valid health data type.`
        }
    },

    /**
     * The value of the health data type being stored
     */
    value: {
        type: Number,
        required: true
    },

    /**
     * The time of which this record is being saved at
     */
    date: {
        type: Date,
        default: new Date()
    }
}, { collection: 'healthdata' })

module.exports = mongoose.model("HealthData", healthDataSchema)