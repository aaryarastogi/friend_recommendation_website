import express from "express";
import connectDB from "./config/db.js";

const app = express();

// Middleware
app.use(express.json()); // Parses JSON requests

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

connectDB(process.env.USERNAME , process.env.PASSWORD); //connection of DB


const PORT=process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`server is running on port ${PORT}`));
