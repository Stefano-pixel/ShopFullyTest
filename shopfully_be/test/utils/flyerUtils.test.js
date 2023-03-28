import { test } from "tap";
import {
  getNumberFlyers,
  getRangeFlyers,
  createValidRowsInCsv,
} from "../../src/utils/flyerUtils.js";
import { fileURLToPath } from "url";
import path from "path";
import { ERROR_ARG_NULL_UNDEFINED } from "../../src/constants/errorMessages.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testFilePath = path.join(__dirname, "..", "flyers_data_test.csv");

test("Test suite 1", async (t) => {
  try {
    //With this function we make sure that the rows
    //2, 3, 4, have the right dates and is_published at 1
    await createValidRowsInCsv(testFilePath, 2, 4);
  } catch (err) {
    console.error(err);
  }

  t.test(
    "getNumberFlyers should count the number of rows in a CSV file",
    async (t) => {
      const actual = await getNumberFlyers(testFilePath);
      const expected = 3;

      t.equal(actual, expected, "should return the number of flyers");
    }
  );

  t.test(
    "getNumberFlyers should throw an exception (404) because the file doesn't exist",
    async (t) => {
      await t.rejects(
        async () => {
          await getNumberFlyers("wrong_path/file.csv");
        },
        { status: 404 },
        "getNumberFlyers should throw an error with status 404"
      );
    }
  );

  t.test(
    "getNumberFlyers should throw an exception because the path is undefined or null",
    async (t) => {
      await t.rejects(
        getNumberFlyers(null),
        new Error(ERROR_ARG_NULL_UNDEFINED)
      );
    }
  );

  t.test(
    "getRangeFlyers should return a list of objects matching the CSV file",
    async (t) => {
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.setMonth(currentDate.getMonth() - 1)
      );
      const endDate = new Date(
        currentDate.setMonth(currentDate.getMonth() + 2)
      );

      const startDateString = startDate.toISOString().split("T")[0];
      const endDateString = endDate.toISOString().split("T")[0];
      const expected = [
        {
          id: "2",
          title: "Offerte",
          start_date: startDateString,
          end_date: endDateString,
          is_published: "1",
          retailer: "Diper Spesa",
          category: "Iper e super",
        },
        {
          id: "3",
          title: "Grandi marche in festa!",
          start_date: startDateString,
          end_date: endDateString,
          is_published: "1",
          retailer: "Ok Market",
          category: "Iper e super",
        },
        {
          id: "4",
          title: "Sconti al 50%",
          start_date: startDateString,
          end_date: endDateString,
          is_published: "1",
          retailer: "Conad",
          category: "Iper e super",
        },
      ];
      const actual = await getRangeFlyers(testFilePath, 1, 3);
      t.ok(
        expected.every((item, index) =>
          Object.keys(item).every((key) =>
            Object.is(item[key], actual[index][key])
          )
        ),
        "should return a list of objects matching the CSV file"
      );
    }
  );

  t.test(
    "getRangeFlyers should throw an exception (404) because the file doesn't exist",
    async (t) => {
      await t.rejects(
        async () => {
          await getRangeFlyers("wrong_path/file.csv", 1, 3);
        },
        { status: 404 },
        "getRangeFlyers should throw an error with status 404"
      );
    }
  );

  t.test(
    "getRangeFlyers should throw an exception because one of the arguments is undefined or null",
    async (t) => {
      await t.rejects(
        getRangeFlyers(null, 1, 3),
        new Error(ERROR_ARG_NULL_UNDEFINED)
      );
    }
  );

  t.end();
});
