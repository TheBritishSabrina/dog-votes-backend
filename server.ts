import { Client } from "pg";
import { config } from "dotenv";
import express from "express";
import cors from "cors";

config(); //Read .env file lines as though they were env vars.

//Call this script with the environment variable LOCAL set if you want to connect to a local db (i.e. without SSL)
//Do not set the environment variable LOCAL if you want to connect to a heroku DB.

//For the ssl property of the DB connection config, use a value of...
// false - when connecting to a local DB
// { rejectUnauthorized: false } - when connecting to a heroku DB
const herokuSSLSetting = { rejectUnauthorized: false };
const sslSetting = process.env.LOCAL ? false : herokuSSLSetting;
const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: sslSetting,
};

const app = express();

app.use(express.json()); //add body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

const client = new Client(dbConfig);
client.connect();

app.get("/", async (req, res) => {
  const dbres = await client.query(
    "SELECT * FROM votes ORDER BY vote_count DESC LIMIT 10"
  );

  const dogData = await dbres.rows;

  if (dogData) {
    res.status(200).json({
      status: "success",
      dogData,
    });
  } else {
    res.status(404).json({
      status: "fail",
      data: "failed to fetch dog votes data",
    });
  }
});

app.post("/", async (req, res) => {
  const { breed, exampleImage } = req.body;
  const dbres = await client.query(
    "INSERT INTO votes (breed, example_image, vote_count) VALUES ($1, $2, $3) ON CONFLICT (breed) DO UPDATE SET vote_count = votes.vote_count + 1 RETURNING *",
    [breed, exampleImage, 1]
  );

  if (dbres) {
    res.status(200).json({
      status: "sucess",
    });
  } else {
    res.status(404).json({
      status: "fail",
      data: "failed to upvote",
    });
  }
});

app.get("/top", async (req, res) => {
  const dbres = await client.query(
    "SELECT * FROM votes ORDER BY vote_count DESC LIMIT 3"
  );

  const dogData = await dbres.rows;

  if (dogData) {
    res.status(200).json({
      status: "success",
      dogData,
    });
  } else {
    res.status(404).json({
      status: "fail",
      data: "failed to fetch dog votes data",
    });
  }
});

//Start the server on the given port
const port = process.env.PORT;
if (!port) {
  throw "Missing PORT environment variable.  Set it in .env file.";
}
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
