const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.disconnect();
  await mongoose.connect("mongodb://localhost/genshopMock", {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });
})

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
})

afterAll(async () => {
  await mongoose.disconnect();
})