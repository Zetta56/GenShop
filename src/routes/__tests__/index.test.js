
const request = require("supertest");
const app = require("../../app");
const helpers = require("../../../tests/helpers.js");
const Token = require("../../models/Token");
const User = require("../../models/User");

describe("POST /api/register", () => {
  it("should create a user", async () => {
    const payload = {
      email: "test@gmail.com",
      username: "testName",
      password: "testPassword"
    };
    await request(app).post("/api/register").send(payload);
    const user = await User.findOne({ username: "testName" });
    expect(user).toMatchObject({ email: "test@gmail.com", username: "testName" });
  });
  it("should not create a duplicate user", async () => {
    const payload = {
      email: "test@gmail.com",
      username: "testName",
      password: "testPassword"
    };
    const first = await request(app).post("/api/register").send(payload);
    expect(first.statusCode).toBe(200)
    const second = await request(app).post("/api/register").send(payload);
    expect(second.statusCode).toBe(409)
  });
})

describe("POST /api/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/register").send({
      username: "testName",
      password: "testPassword"
    });
  })
  it("should log you in with correct credentials", async () => {
    const payload = { username: "testName", password: "testPassword" };
    const res = await request(app).post("/api/login").send(payload);
    const token = await Token.findOne({ userId: res.body["_id"] });
    expect(res.statusCode).toBe(200);
    expect(res.headers["set-cookie"][0]).toMatch(new RegExp('^refresh_token=.*;'));
    expect(res.headers["set-cookie"][1]).toMatch(new RegExp('^access_token=.*;'));
    expect(res.body["username"]).toEqual("testName");
    expect(token).toBeTruthy();
  })
  it("should not log you in with wrong credentials", async () => {
    const wrongUsername = await request(app)
      .post("/api/login")
      .send({ username: "wrong", password: "testPassword" });
    expect(wrongUsername.statusCode).toBe(401);
    
    const wrongPassword = await request(app)
      .post("/api/login")
      .send({ username: "testName", password: "wrong" });
    expect(wrongPassword.statusCode).toBe(401);
  })
});

describe("GET /api/logout", () => {
  it("should log you out", async () => {
    const { cookies } = await helpers.getUser();
    const res = await request(app).get("/api/logout").set("cookie", cookies);
    expect(res.body).toBe(true);
    expect(res.headers["set-cookie"][0]).toMatch(new RegExp("^access_token=;"));
    expect(res.headers["set-cookie"][1]).toMatch(new RegExp("^refresh_token=;"));
  })
})

describe("GET /api/access", () => {
  it("should send the user object", async () => {
    const { user, cookies } = await helpers.getUser();
    const res = await request(app).get("/api/access").set("cookie", cookies);
    expect(res.body["username"]).toEqual(user.username);
  })
})

describe("GET /api/refresh", () => {
  it("should send a new access token", async () => {
    const { cookies } = await helpers.getUser();
    const res = await request(app).post("/api/refresh").set("cookie", cookies);
    expect(res.headers["set-cookie"][0]).toMatch(new RegExp("^access_token=.*;"));
    expect(res.body).toBeTruthy();
  })
  it("should not send a new access token", async () => {
    const res = await request(app).post("/api/refresh").set("cookie", ["access_token=wrong;"]);
    expect(res.body).toBe(false);
  })
})

describe("POST /api/checkout", () => {
  it("should send the Stripe session id", async () => {
    const { user, cookies } = await helpers.getUser();
    const newProduct = await helpers.getProduct();
    const foundUser = await User.findById(user._id);
    foundUser.cart.push({ product: newProduct._id, quantity: 1, variation: "standard" });
    foundUser.save();

    const res = await request(app).post("/api/checkout").set("cookie", cookies);
    expect(res.body).toEqual(expect.any(String));
  })
  it("should fail with an empty cart", async () => {
    const { cookies } = await helpers.getUser();
    const res = await request(app).post("/api/checkout").set("cookie", cookies);
    expect(res.statusCode).toBe(500);
  })
})