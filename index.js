import app from "./server.js";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import WeatherDAO from "./dao/weatherDAO.js";

dotenv.config();

const port = process.env.PORT || 3000;
MongoClient.connect(
  process.env.WEATHER_DB_URI,
  {
    wtimeoutMS: 5000, 
    tls: true, 
  }
).catch(err => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async client => {
    await WeatherDAO.injectDB(client); 
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });
