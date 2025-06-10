
import dotenv from "dotenv";
import app from './app.js';
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

app.get('/', (req, res) => {
  
  res.send('Welcome to the backend server!');
});
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });

