const { MongoClient } = require("mongodb");

const getCollection = async (req, res) => {
    // TODO: get the url params...

    const { dbName } = req.params;
    const { collection } = req.params;

    // TODO: open the connection to the database server
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })

    // TODO: declare "db"
    await client.connect();
    const db = client.db(dbName);

    db.collection(collection)
        .find()
        .toArray((err, data) => {
            if (err) {
                console.log(err);
            } else {
                //send result: 
                res.status(200).json({
                    status: 200, connection: "successful!", data: data
                });

                //close connection to server
                client.close();
                console.log("connection terminated");

            }

        })


}

module.exports = { getCollection };