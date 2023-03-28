import createApp from "./app.js";

const FILE_CSV_PATH = "./flyers_data.csv";
const port = process.env.PORT || 3004;
const app = createApp(FILE_CSV_PATH);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${port}`);
});
