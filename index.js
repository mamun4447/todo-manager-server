const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser());
app.use(express());
app.use(cors());

//<<==< Mongo info >==>>//albatros1
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://userdashboard:i8eHEAEMEIcLf38o@cluster0.otp6uvz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});


//<<==< MongoDB connected >==>>//
async function run() {
    try {
        await client.connect();
        console.log("Connected to DB!");
    } catch (error) {
        console.log(error);
    }
}
run().catch(error=>console.log(error.message))

//<<==< Get Collections >==>>//
const TasksCollections = client.db("taskManager").collection("todo");

//<<==< Add Task >==>>//
app.post("/tasks", async (req, res) => {
    try {
        const tasks = req.body;
        await TasksCollections.insertOne(tasks);
        res.send({success:true,message:"Added a task!"})
    } catch (error) {
        res.send({
            success: false,
            error:error.message
        })
        console.log(error);
    }
})

//<<==< Get Tasks >==>>//
app.get("/incomplete/:email", async (req, res) => {
    try {
        const email = req.params.email;
        // console.log(email)
        const results = await TasksCollections.find({
          userEmail: email,
        }).toArray();
        // console.log(results);
        const data = results.filter(
          (result) => result?.status === "incomplete"
        );
        res.send({ success: true, data: data });
    } catch (error) {
        console.log(error);
        res.send({success:false,error:error.message})
    }
})

//<<==< Get Completed Tasks >==>>//
app.get("/complete/:email", async (req, res) => {
    try {
        const email = req.params.email;
        // console.log(email)
        const results = await TasksCollections.find({
          userEmail: email,
        }).toArray();
        // console.log(results);
        const data = results.filter((result) => result?.status === "completed");
        res.send({ success: true, data: data });
    } catch (error) {
        console.log(error);
        res.send({success:false,error:error.message})
    }
})


//<==< Default >==>//
app.listen(port, () => {
    console.log("Server is running", port);
})
app.get("/", (req, res) => {
    res.send("Server is running");
})
module.exports = app;