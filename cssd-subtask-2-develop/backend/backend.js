const express = require('express')                      // it's an express powered api service
const app = express()                                   // our instantiation of express
const bodyParser = require('body-parser')              // allows for easier processing of request bodies
const cors = require('cors')                            // permits cross origin requests
const apiRoutes = express.Router()                      // routing for api endpoints
const constants = require('./constants')                // application constants

/**
 * Api endpoint controllers
 */
const controllers = {
    healthData: require('./controllers/health-data'),   // handles requests in the health data domain
    message: require('./controllers/message'),          // handles requests in the message domain
    user: require('./controllers/user')                 // handles requests in the user account domain
}

/**
 * Mongoose database models
 */
const models = {
    HealthData: require('./models/HealthData'),         // mongoose model for the user data collection
    Message: require('./models/Message'),               // mongoose model for a message
    User: require('./models/User')                      // mongoose model for user accounts
}

/**
 * Database access layer methods
 */
const db = {
    DatabaseService: require('./database/DatabaseService'),
    HealthDataRetriever: require('./database/HealthDataRetriever'),
    HealthDataLogger: require('./database/HealthDataLogger'),
    MessageService: require('./database/MessageService')
}
new db.DatabaseService(constants.MONGODB_NAME)

/**
 * Setup express and use middleware
 */
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.set("port", process.env.PORT || 5000)

/**
 * Configure API routes
 */
app.use("/api", apiRoutes)

/* API ENDPOINTS ========================================================= */

apiRoutes.route("/user")
    .get(controllers.user.getAll)
    .post(controllers.user.addOne)
 
apiRoutes.route("/user/:userId")
    .get(controllers.user.getOne)

apiRoutes.route("/user/auth")
    .post(controllers.user.auth)
    
    /*
apiRoutes.route("/user/:userId/message")
    .get(controllers.message.getAllForUser)
    .post(controllers.message.addOneToUser)
    /*

    /*
apiRoutes.route("/user/:userId/message/:messageId")
    .get()      // get single message for user
    */

apiRoutes.route("/user/:userId/healthdata")
    .get(controllers.healthData.getAllForUser)
    .post(controllers.healthData.addOne)

apiRoutes.route("/healthdata")
    .get(controllers.healthData.getAll)

    /*
apiRoutes.route("/user/:userId/healthdata/:healthDataId")
    .get()      // get single health data for user
    */

/* API ENDPOINTS END ===================================================== */

module.exports = app

/**
 * Begin listening for requests if we're not testing
 */
if (process.env.JEST_WORKER_ID === undefined) {
    app.listen(app.get("port"), () => {
        console.log(`API Service listening on port ${app.get("port")}.`)
    })
}

