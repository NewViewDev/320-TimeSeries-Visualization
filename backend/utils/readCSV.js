const fs = require("fs");
const csv = require("fast-csv");
const data = [];

fs.createReadStream("../dummy-data/dummy-node-data.csv")
  .pipe(csv.parse({ headers: true }))
  .on("error", (error) => console.error(error))
  .on("data", (row) => data.push(row))
  .on("end", () => console.log(data));
