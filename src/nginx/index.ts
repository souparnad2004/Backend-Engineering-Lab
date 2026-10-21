import  express from "express";
import os from "node:os"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const instanceId = os.hostname();

app.get("/users", (req, res) => {
    res.status(200).json([
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" }
    ])
})

app.get("/headers", (req, res) => {
    res.status(200).json({
        host:req.header("host"),

        hostName: instanceId,

        realIp: req.header("x-real-ip"),

        forwarded: req.header("x-forwarded-for"),

        forwardedProto: req.header("x-forwarded-proto")
    });
})

app.get("/health", (req, res) => {
    res.status(200).send("OK");
});


app.listen(3000, "0.0.0.0" ,() => {
    console.log("Server is running on port 3000");
});