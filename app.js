const express = require("express")
const app = express()

app.use(express.static("public"));

app.listen(5900, "0.0.0.0", () => {
    console.log("listens at 5900")
})

