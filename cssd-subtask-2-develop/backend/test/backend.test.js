const mongoose = require('mongoose')
const supertest = require('supertest')
const statusCodes = require('http-status-codes')
const app = require('../backend')
const request = supertest(app)

const mockDb = require('./mock-db')
const models = {
    HealthData: require('../models/HealthData'),         // mongoose model for the user data collection
    Message: require('../models/Message'),               // mongoose model for a message
    User: require('../models/User')                      // mongoose model for user accounts
}


/**
 * Setup our mocked test database environment
 */
beforeAll(async () => await mockDb.connect())

/**
 * Safely close the mocked database connection
 */
afterAll(async () => await mockDb.closeDatabase())

/**
 * Api test suite
 */
describe("API", () => {

    /**
     * User account based testing
     */
    describe("Users", () => {

        it("Should successfully register with valid parameters", async done => {

            const user = {
                username: "apatient",
                firstName: "First",
                lastName: "Last",
                password: "123",
                dateOfBirth: "1990-01-25",
                type: "Patient"
            }

            const response = await request
                .post("/api/user")
                .send(user)

            expect(response.status).toEqual(statusCodes.OK)
            expect(response.body.user.username).toEqual(user.username)

            done()
        })

        it("Should fail to register when not given a password", async done => {

            const user = {
                username: "apatient",
                firstName: "First",
                lastName: "Last",
                dateOfBirth: "1990-01-25",
                type: "Patient"
            }

            const response = await request
                .post("/api/user")
                .send(user)

            expect(response.status).toEqual(statusCodes.BAD_REQUEST)

            done()
        })

        it("Should hash user passwords", async done => {

            const user = new models.User({
                username: "apatient",
                firstName: "John",
                lastName: "Smith",
                password: "123",
                dateOfBirth: "1985-05-15",
                type: "Doctor"
            })

            const result = await user.save()

            expect(result.password).not.toEqual("123")
        
            done()
        })
    })

    /**
     * Health data based testing
     */
    describe("Health Data", () => {

        it("Should successfully add a new piece of health data", async done => {

            const users = await models.User.find()
            const user = users[0]

            const healthData = {
                "type": "Steps",
                "value": "10203"
            }

            const response = await request
                .post(`/api/user/${user._id}/healthdata`)
                .send(healthData)

            expect(response.status).toEqual(statusCodes.OK)

            done()
        })

        it("Should fail to add health data when given an incorrect type", async done => {

            const users = await models.User.find()
            const user = users[0]

            const healthData = {
                "type": "notatype",
                "value": "1"
            }

            const response = await request
                .post(`/api/user/${user._id}/healthdata`)
                .send(healthData)

            expect(response.status).toEqual(statusCodes.BAD_REQUEST)

            done()
        })

        it("Should return added health data for a user", async done => {

            const users = await models.User.find()
            const user = users[0]

            const response = await request
                .get(`/api/user/${user._id}/healthdata`)

            expect(response.status).toEqual(statusCodes.OK)
            expect(response.body.healthDataRecords.length).toEqual(1)

            done()
        })
    })
})