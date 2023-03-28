import fs from "fs";
import csv from "csv-parser";
import { pipeline, Transform } from "stream";
import path from "path";
import { format } from "@fast-csv/format";
import { once } from "events";
import { ERROR_ARG_NULL_UNDEFINED } from "../constants/errorMessages.js";

const createFilterFlyers = () => {
  return new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      if (
        new Date() <= new Date(row.end_date) &&
        new Date(row.start_date) <= new Date() &&
        row.is_published == 1 &&
        new Date(row.start_date) <= new Date(row.end_date)
      ) {
        this.push(row);
      }

      callback();
    },
  });
};

//Takes n rows from the csv where n = max - min, starting from the min row
//to the max row. These n rows are transformed in an array of json that is returned
const getRangeFlyers = async (filePath, min, max) => {
  if (!filePath) throw new Error(ERROR_ARG_NULL_UNDEFINED);

  return new Promise((resolve, reject) => {
    const flyers = [];
    fs.access(filePath, fs.constants.F_OK, (err) => {
      //if can't find the file reject with status 404
      if (err) {
        if (err.code === "ENOENT") {
          const notFoundErr = new Error(`File not found: ${filePath}`);
          notFoundErr.status = 404;
          reject(notFoundErr);
        } else reject(err);
      } else {
        let count = 1;
        const readStream = fs.createReadStream(filePath);
        const filterFlyers = createFilterFlyers();
        //Read the file and parse every row with csv-parser
        pipeline(
          readStream,
          csv({
            separator: ";",
            mapHeaders: ({ header }) => header.trim().toLowerCase(),
            mapValues: ({ value }) => value.trim(),
          }),
          filterFlyers,
          (err) => {
            if (err) reject(err);
          }
        )
          .on("data", function (row) {
            if (count >= min && count <= max) {
              flyers.push(row);
              //resolve the promise when takes the last row
              if (count == max) {
                resolve(flyers);
                readStream.destroy();
              }
            }
            count++;
          })
          .on("end", () => {
            readStream.destroy();
          });
      }
    });
  });
};

//Return the total number of row of the csv file indicated from the argument
//filePath, in the count is excluded the header
const getNumberFlyers = async (filePath) => {
  if (!filePath) throw new Error(ERROR_ARG_NULL_UNDEFINED);

  try {
    //Checks if the file in filePath exists
    await fs.promises.access(filePath, fs.constants.F_OK);

    let count = 0;
    const readStream = fs.createReadStream(filePath);
    const filterFlyers = createFilterFlyers();

    //Set the csv parser
    const csvParser = csv({
      separator: ";",
      mapHeaders: ({ header }) => header.trim().toLowerCase(),
      mapValues: ({ value }) => value.trim(),
    });

    const processingPipeline = pipeline(
      readStream,
      csvParser,
      filterFlyers,
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );

    //Count only the flyer not expired, the flyer published,
    //and the flyers that have the start date <= than the end date
    processingPipeline.on("data", (csvRow) => {
      count++;
    });

    //Wait until the end event is emitted
    await once(readStream, "end");

    return count;
  } catch (err) {
    if (err.code === "ENOENT") {
      const notFoundErr = new Error(`File not found: ${filePath}`);
      notFoundErr.status = 404;
      throw notFoundErr;
    }
    throw err;
  }
};

//Takes in input the csv file and for the row between startRow and endRow modify the
//start date with the date of one month before now
//the end date with the date fo one month after now
//and set is_published to 1
const createValidRowsInCsv = async (inputFilePath, startRow, endRow) => {
  const readStream = fs.createReadStream(inputFilePath);

  // Extract the directory from inputPath
  const directory = path.dirname(inputFilePath);

  // Create a new path for the temporary file in the same directory
  const tempFilePath = path.join(directory, "temp_file.csv");

  const writeStream = fs.createWriteStream(tempFilePath);

  let rowIndex = 0;

  const updateDates = new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      rowIndex++;

      if (rowIndex >= startRow && rowIndex <= endRow) {
        const currentDate = new Date();
        const startDate = new Date(
          currentDate.setMonth(currentDate.getMonth() - 1)
        );
        const endDate = new Date(
          currentDate.setMonth(currentDate.getMonth() + 2)
        );

        row.start_date = startDate.toISOString().split("T")[0];
        row.end_date = endDate.toISOString().split("T")[0];
        row.is_published = "1";
      }

      callback(null, row);
    },
  });

  const csvParser = csv({
    separator: ";",
    mapHeaders: ({ header }) => header.trim().toLowerCase(),
    mapValues: ({ value }) => value.trim(),
  });

  const csvStringifier = format({
    delimiter: ";",
    headers: [
      "id",
      "title",
      "start_date",
      "end_date",
      "is_published",
      "retailer",
      "category",
    ],
    writeHeaders: true,
  });

  await new Promise((resolve, reject) => {
    pipeline(
      readStream,
      csvParser,
      updateDates,
      csvStringifier,
      writeStream,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });

  //Replace the original file with the modified temporary file
  await fs.promises.rename(tempFilePath, inputFilePath);
};

export { getRangeFlyers, getNumberFlyers, createValidRowsInCsv };
