const { MongoClient } = require('mongodb')

const dbFunction = async (dbName) => {

    const client = new MongoClient('mongodb://localhost:27017', { useUnifiedTopology: true, });

    // open connection to db server

    await client.connect();
    console.log("connected");

    const db = client.db(dbName);

    await db.collection('one').insertOne({
        name: "Buck Rogers"
    });

    // close connection to the db server 

    client.close();
    console.log('disconnected!!');
}

dbFunction('exercise_one');