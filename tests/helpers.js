
const request = require("supertest");
const app = require("../src/app");
const Product = require("../src/models/Product");
const Review = require("../src/models/Review");

class Counter {
  static val = 0;
  static get() {
    Counter.val += 1;
    return Counter.val;
  }
}

const getUser = async () => {
  const username = "testName" + Counter.get();
  console.log(username)
  await request(app).post("/api/register").send({
    username: username,
    password: "testPassword"
  });
  const login = await request(app)
    .post("/api/login")
    .send({ username: username, password: "testPassword" });
  return { user: login.body, cookies: login.headers['set-cookie'] };
}

const getProduct = async () => {
  const product = await Product.create({
    title: "testTitle",
    description: "testDescription",
    price: 5.00,
    variations: ["standard"],
    image: {
      url: "test",
      publicId: "test"
    }
  });
  return product;
}

const getReview = async () => {
  const { user } = await getUser();
  const product = await getProduct();
  const review = await Review.create({
    ratings: 5,
    comment: "testComment",
    product: product._id,
    user: {id: user._id, username: user.username}
  });
  return review;
}

module.exports = { getUser, getProduct, getReview }