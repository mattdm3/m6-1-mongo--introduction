const assert = require("assert");
const { MongoClient } = require('mongodb');

const createGreeting = async (req, res) => {
    //connect
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })
    try {
        await client.connect();
        //declare db
        //use ex database 
        const db = client.db("exercise_one");

        // create a new collection 'greetings'

        const r = await db.collection("greetings").insertOne(req.body);
        assert.equal(1, r.insertedCount);

        // on success send

        res.status(201).json({
            status: 201, data: req.body
        })

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500, data: req.body, message: err.message
        })

    }

    client.close();
    console.log("client closed")

}

const getGreeting = async (req, res) => {
    const { _id } = req.params;
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })
    await client.connect();
    const db = client.db("exercise_one");
    function capitalizeFirstLetter(string) {
        string = string.toLowerCase();
        return string[0].toUpperCase() + string.slice(1);
    }

    if (_id.length === 2) {
        db.collection("new_greetings").findOne({ _id }, (err, result) => {
            result
                ? res.status(200).json({ status: 200, _id, data: result }) : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
        });
    }
    else {
        db.collection("new_greetings").findOne({ "lang": capitalizeFirstLetter(_id) }, (err, result) => {
            result
                ? res.status(200).json({ status: 200, _id, data: result }) : res.status(404).json({ status: 404, _id, data: "Not Found" });
            client.close();
        });
    }


};

const getGreetings = async (req, res) => {

    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })
    await client.connect();
    const db = client.db('exercise_one');

    db.collection('new_greetings')
        .find()
        .toArray((err, result) => {
            if (result.length) {
                console.log(result.length);
                const start = Number(req.query.start) || 0;
                const cleanStart = start > -1 && start < result.length ? start : 0;
                const end = cleanStart + (Number(req.query.limit) || 25);
                const cleanEnd = end > result.length ? result.length - 1 : end;
                const data = result.slice(cleanStart, cleanEnd);
                const limit = Number(req.query.limit) || end;
                const cleanLimit = result.length - cleanStart - limit < 0 ? limit + result.length - cleanStart - limit : limit;
                res.status(200).json({ status: 200, start: cleanStart, limit: cleanLimit, data })
            }
            else {
                res.status(404).json({ status: 404, data: "not found" })

            }
            client.close()

        })
}

const deleteGreeting = async (req, res) => {

    const { _id } = req.params

    //connect
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })
    try {
        await client.connect();

        const db = client.db("exercise_one");

        //changed status from 204 to 200 because 204 gets no response. 
        const r = await db.collection("new_greetings").deleteOne({ _id: _id.toUpperCase() });
        assert.equal(1, r.deletedCount);
        res.status(200).json({ status: 200, body: _id, confirmed: r.deletedCount })
        console.log(r.deletedCount)

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500, data: req.body, message: err.message
        })

    }

    client.close();
    console.log("client closed")


}

const updateGreeting = async (req, res) => {

    const { _id } = req.params

    const { hello } = req.body;
    console.log(req.body)
    console.log(hello)

    if (!hello) {
        res
            .status(400)
            .json({
                status: 400,
                data: req.body,
                message: 'only hello may be updated'
            })
        return;
    }


    //connect
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    })
    try {
        await client.connect();

        const db = client.db("exercise_one");
        const query = { _id };

        //changed status from 204 to 200 because 204 gets no response. 
        const r = await db.collection("new_greetings").updateOne(query, { $set: { hello } });
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);

        res.status(200).json({ status: 200, _id, body: req.body })

    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            status: 500, _id, message: err.message
        })

    }

    client.close();
    console.log("client closed")


}

module.exports = { createGreeting, getGreeting, getGreetings, deleteGreeting, updateGreeting }