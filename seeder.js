const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// load env vars
dotenv.config({ path: "./config/config.env" });

// load models
const Bootcamp = require("./models/bootcamp.js");
const Course = require("./models/course.js");
const User = require("./models/user.js");
const Review = require("./models/review.js");

// connect to database
mongoose.connect(process.env.MONGO_URI);

// read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/finland_bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/finland_courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/finland_users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/finland_reviews.json`, "utf-8")
);

// import into db
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);

    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    if (err.errors) {
      console.log(JSON.stringify(err.errors, null, 2).red);
    }
  }
};

// delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
