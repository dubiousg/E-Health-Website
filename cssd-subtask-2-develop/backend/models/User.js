"use strict";

const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

/**
 * A list of allowed user types, used in the schema for type
 * validation
 */
const userType = [
    "Patient",
    "Doctor"
]

/**
 * Defines the schema for a message from a doctor to their patient
 */
const userSchema = new mongoose.Schema({

    /**
     * The user's unique name used to login
     */
    username: {
        type: String,
        unique: true,
        required: true
    },

    /**
     * The user's first name
     */
    firstName: {
        type: String,
        required: true
    },

    /**
     * The user's last name
     */
    lastName: {
        type: String,
        required: true
    },

    /**
     * The user's (hashed) password
     */
    password: {
        type: String,
        required: true
    },

    /**
     * The user's dob
     */
    dateOfBirth: {
        type: Date,
        required: true
    },

    /**
     * The time of which the user's account was created
     */
    joinDate: {
        type: Date,
        default: new Date()
    },

    /**
     * The type of account the user owns
     */
    type: {
        type: String,
        default: "",
        validate: {
            validator: function(v) {
                return userType.indexOf(v) > -1;
            },
            message: props => `${props.value} is not a valid user account type.`
        }
    }

}, { collection: 'user' })

/**
 * Compares the given (unhashed) password to the current one stored
 * within the database.
 */
userSchema.methods.testPassword = async function(password) {
    
    let match = false
    
    try {
        
        match = await bcrypt.compare(password, this.password, false) 
    }
    catch (error) {

        console.log(error)
    }
    
    return match
}

/**
 * Pre hook to hash a password before commiting the new user
 * document to the collection
 */
userSchema.pre("save", function(next) {

    console.log("User.js: save")

    let user = this

    bcrypt.hash(user.password, 10, (error, hash) => {

        console.log("User.js: hashing password...")

        if (error) {
            console.log(`Error in hashing password: ${error.message}`)
            next(error)
        }
        else {
            console.log("User.js: password hashed")
            user.password = hash
            console.log("User.js: plaintext password replaced")
            next()
        }
    })
})

module.exports = mongoose.model("User", userSchema)