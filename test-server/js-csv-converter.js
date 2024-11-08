import fs from "fs";
import path from "path";
import { parse } from "json2csv";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

fs.readFile(
  path.join(__dirname, "../src/assets/members-test.json"),
  "utf8",
  (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const members = JSON.parse(data);
    const csv = parse(members);
    fs.writeFile(
      path.join(__dirname, "../src/assets/members-test.csv"),
      csv,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("CSV file created successfully");
      },
    );
  },
);
