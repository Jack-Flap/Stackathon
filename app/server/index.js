const express = require("express");
const server = express();
const path = require("path");

server.use("/dist", express.static(path.join(__dirname, "../../dist")));
server.use("/static", express.static(path.join(__dirname, "../static")));

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../static/index.html"));
})

async function init(){
    try {
        server.listen(3000, () => {console.log("Listening on port 3000")});
    } catch (error) {
        console.log(error);
    }
}

init();