import express from "express";
import { getRangeFlyers, getNumberFlyers } from "./utils/flyerUtils.js";
import cors from "cors";

function createApp(fileCsvPath) {
  const app = express();
  app.use(cors());

  app.get("/api/flyers", async (req, res) => {
    try {
      const totFlyers = await getNumberFlyers(fileCsvPath);
      const page = Number(req.query.page);
      const limit = Number(req.query.limit);
      const startPoint = page * limit - limit + 1;
      if (startPoint > totFlyers) return res.status(200).send([]);
      let endPoint;
      //Calculate what is the range of rows to take from the csv
      if (page * limit > totFlyers) endPoint = totFlyers;
      else endPoint = startPoint + limit - 1;
      const rangeFlyers = await getRangeFlyers(
        fileCsvPath,
        startPoint,
        endPoint
      );
      res.status(200).send(rangeFlyers);
    } catch (err) {
      console.error(err);
      if (err.status == 404)
        res.status(404).send({ error: `File not found: ${fileCsvPath}` });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get("/api/flyers/number", async (req, res) => {
    try {
      const totFlyers = await getNumberFlyers(fileCsvPath);
      res.status(200).send({ flyers: totFlyers });
    } catch (err) {
      console.error(err);
      if (err.status == 404)
        res.status(404).send({ error: `File not found: ${fileCsvPath}` });
      else res.status(500).send({ error: "Internal Server Error" });
    }
  });

  return app;
}

export default createApp;
