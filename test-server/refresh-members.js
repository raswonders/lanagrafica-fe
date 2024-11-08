import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function hasExpired(date) {
  return new Date() > date;
}

function isSuspended(date) {
  return date ? new Date() < date : false;
}

function genCardNumber() {
  return String(Math.floor(Math.random() * 100_000_000)).padStart(8, "0");
}

fs.readFile(
  path.join(__dirname, "../src/assets/members-test.json"),
  "utf8",
  (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const members = JSON.parse(data);
    const membersCorrectState = members.map((member) => {
      if (member.is_deleted) member.is_active = false;
      if (hasExpired(new Date(member.expiration_date)))
        member.is_active = false;
      if (isSuspended(new Date(member.suspended_till)))
        member.is_active = false;
      return member;
    });

    const membersWithCards = membersCorrectState.map((member) => {
      if (member.is_active) {
        member.card_number = genCardNumber();
      } else {
        member.card_number = "";
      }

      return member;
    });

    const json = JSON.stringify(membersWithCards, null, 2);

    fs.writeFile(
      path.join(__dirname, "../src/assets/members-test.new.json"),
      json,
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("New members created successfully");
      },
    );
  },
);
