require("dotenv").config(); //Se configura en linea 1
const express = require('express');
const {connectDB} = require('./src/config/db');
const cloudinary = require("cloudinary").v2;
const cors = require("cors");
const userRoutes = require("./src/api/routes/user");
const eventsRoutes = require("./src/api/routes/event");
const attendeeRouter = require("./src/api/routes/attendee");

const app = express();
connectDB();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
  
});

const getAllowedOrigins = () => {

  const origins = [
    'https://eventsphere-omega.vercel.app',
    'http://localhost:3000',
  ];

  return origins;
};
// Configuración dinámica de CORS usando getAllowedOrigins()
const corsOptions = {
  mode:'no-cors',
  origin: getAllowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json()); 




app.use("/api/v1/users",userRoutes);
app.use("/api/v1/events",eventsRoutes);
app.use("/api/v1/attendees", attendeeRouter);

app.use("*",  (req,res,next) => {
  return res.status(404).json("Route not found");
 });

 const port = process.env.PORT || 3000; 
 app.listen(port, () => {
   console.log(`Server running on port ${port}`);
 });