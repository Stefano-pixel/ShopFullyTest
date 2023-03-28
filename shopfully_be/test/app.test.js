import { test } from "tap";
import {
  getNumberFlyers,
  getRangeFlyers,
  createValidRowsInCsv,
} from "../src/utils/flyerUtils.js";
import { fileURLToPath } from "url";
import path from "path";
import request from "supertest";
import createApp from "../src/app.js";
import { ERROR_ARG_NULL_UNDEFINED } from "../src/constants/errorMessages.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testFilePath = path.join(__dirname, "flyers_data_test.csv");

test("Test suite 2", async (t) => {
  try {
    //With this function we make sure that the rows
    //2, 3, 4, have the right dates and is_published at 1
    await createValidRowsInCsv(testFilePath, 2, 4);
  } catch (err) {
    console.error(err);
  }

  t.test("Should return the number of flyers in the CSV file", async (t) => {
    const app = createApp(testFilePath);
    const server = app.listen();

    t.teardown(() => {
      server.close();
    });

    const response = await request(app).get("/api/flyers/number").expect(200);

    const numFlyersExpected = 3;
    t.equal(response.body.flyers, numFlyersExpected);
  });

  t.test("Should return 404 because the file doesn't exists", async (t) => {
    const app = createApp("wrong_path/file.csv");
    const server = app.listen();

    t.teardown(() => {
      server.close();
    });

    await request(app).get("/api/flyers/number").expect(404);
  });

  t.test(
    "Should return 500 because the file path is undefined or null",
    async (t) => {
      const app = createApp();
      const server = app.listen();

      t.teardown(() => {
        server.close();
      });

      await request(app).get("/api/flyers/number").expect(500);
    }
  );

  t.test("Should return the list of flyers in the CSV file", async (t) => {
    const app = createApp(testFilePath);
    const server = app.listen();

    t.teardown(() => {
      server.close();
    });

    const response = await request(app)
      .get("/api/flyers")
      .query({ page: 1, limit: 3 })
      .expect(200);

    const currentDate = new Date();
    const startDate = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1)
    );
    const endDate = new Date(currentDate.setMonth(currentDate.getMonth() + 2));

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

    const actual = response.body;

    t.ok(
      expected.every((item, index) =>
        Object.keys(item).every((key) =>
          Object.is(item[key], actual[index][key])
        )
      ),
      "should return a list of objects matching the CSV file"
    );
  });

  t.test("Should return 404 because the file doesn't exists", async (t) => {
    const app = createApp("wrong_path/file.csv");
    const server = app.listen();

    t.teardown(() => {
      server.close();
    });

    await request(app)
      .get("/api/flyers")
      .query({ page: 1, limit: 3 })
      .expect(404);
  });

  t.test(
    "Should return 500 because the file path is undefined or null",
    async (t) => {
      const app = createApp();
      const server = app.listen();

      t.teardown(() => {
        server.close();
      });

      await request(app)
        .get("/api/flyers")
        .query({ page: 1, limit: 3 })
        .expect(500);
    }
  );

  t.end();
});
