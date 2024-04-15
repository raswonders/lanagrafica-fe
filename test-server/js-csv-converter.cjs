const fs = require("fs");
const { parse } = require("json2csv");

fs.readFile("src/assets/members-test.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const members = JSON.parse(data);
  const csv = parse(members);
  fs.writeFile("src/assets/members-test.csv", csv, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("CSV file created successfully");
  });
});
