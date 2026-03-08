import express from "express";

const app = express();

app.use(express.static("dist", { extensions: ["html"] }));

app.listen(3050, () => console.log("listening on http://localhost:3050/blog"));
