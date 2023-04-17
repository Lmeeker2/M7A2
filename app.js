const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.set('view engine', 'ejs');

const PORT = process.env.PORT || 3000;
const data = require(`./data.json`);
app.get('/', (req, res) => {
  res.render('index', { data: data });
});
const DataSchema = require("./models/DataSchema");
const faker = require("@faker-js/faker").faker;

/**
 * Seed the database with fake data using @faker-js/faker.
 */
(async () => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb+srv://tempAcc:R8IsT7R8AVnoFDVD@cluster0.t7xrj2b.mongodb.net/testtesttest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Array of fake data to seed the database
    const fakeData = [];
    for (let i = 0; i < 100; i++) {
      fakeData.push({
        chemicalName: faker.science.chemicalElement().name.substring(0, 19),
        cat: faker.animal.cat(),
      });
    }

    // Insert the fake data into the database
    await DataSchema.insertMany(fakeData);

    console.log("Fake data seeded successfully");
  } catch (err) {
    console.error("Error seeding the database:", err);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
})();


app.use(express.json());

//mongoose.connect(`mongodb://127.0.0.1:27017/auth`, {
   // mongoose.connect('mongodb+srv://tempAcc:R8IsT7R8AVnoFDVD@cluster0.t7xrj2b.mongodb.net/testtesttest');   // useNewUrlParser: true,
    //useUnifiedTopologu: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
;

    const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});