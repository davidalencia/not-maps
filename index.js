const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const express = require("express");
var cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

app.get("/locations/:id", async (req, res) => {
  const databaseId = req.params.id;
  if (!databaseId) return res.status(400).send("No id provided");
  const response = await notion.databases.query({ database_id: databaseId });
  const locations = response.results.map((x) => ({
    lat: x.properties.Lat.number,
    lon: x.properties.Lon.number,
    name: x.properties.Name.title.reduce((pv, cv) => pv + cv.plain_text, ""),
    url: x.url,
    properties: x.properties,
  }));
  res.json(locations);
});

app.get("/map", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
