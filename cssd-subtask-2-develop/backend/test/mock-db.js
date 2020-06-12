const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

/**
 * Setup our connection to the mock database
 */
module.exports.connect = async () => {

    const mockUri = await mongod.getConnectionString();

    const opts = {
        useNewUrlParser: true,
        autoReconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 3000
    }

    await mongoose.connect(mockUri, opts)
}

/**
 * Remove the mocked database and stop its execution
 */
module.exports.closeDatabase = async () => {
    
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
    await mongod.stop()
}

/**
 * Clear the mocked database of all test data 
 */
module.exports.clearDatabase = async () => {

    const collections = mongoose.connection.collections

    for (const key in collections) {

        const collection = collections[key]
        await collection.deleteMany()
    }
}