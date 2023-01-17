
const request = require("supertest");
const app = require("../src/app");

module.exports.getUser = async () => {
  await request(app).post("/api/register").send({
    username: "testName",
    password: "testPassword"
  });
  const login = await request(app)
    .post("/api/login")
    .send({ username: "testName", password: "testPassword" });
  return { user: login.body, cookies: login.headers['set-cookie'] };
}