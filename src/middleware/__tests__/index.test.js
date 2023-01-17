const middleware = require("../index");
const helpers = require("../../../tests/helpers.js");
const Product = require("../../models/Product");

describe("isLoggedIn", () => {
  it("should notice you are logged in", async () => {
    const req = { user: { username: "test" } };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    middleware.isLoggedIn(req, res, next);
    expect(next).toBeCalled();
  })
  it("should notice you are not logged in", async () => {
    const req = { user: undefined };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    middleware.isLoggedIn(req, res, next);
    expect(res.json).toBeCalledWith({message: "You must be logged in to do that."});
    expect(res.status).toBeCalledWith(401);
  })
})

describe("isAdmin", () => {
  it("should notice you are an admin", async () => {
    const req = { user: { username: "test", isAdmin: true } };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    middleware.isAdmin(req, res, next);
    expect(next).toBeCalled();
  })
  it("should notice you are not an admin", async () => {
    const req = { user: { username: "test", isAdmin: false } };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    middleware.isAdmin(req, res, next);
    expect(res.json).toBeCalledWith({message: "You do not have permission to do that."});
    expect(res.status).toBeCalledWith(401);
  })
  it("should notice you are not even logged in", async () => {
    const req = { user: undefined };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    middleware.isAdmin(req, res, next);
    expect(res.json).toBeCalledWith({message: "You do not have permission to do that."});
    expect(res.status).toBeCalledWith(401);
  })
})

describe("hasProductId", () => {
  it("should notice the given product id is valid", async () => {
    const product = await helpers.getProduct();
    const req = { params: { productId: product._id } };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.hasProductId(req, res, next);
    expect(next).toBeCalled();
  })
  it("should notice the given product id is invalid", async () => {
    const req = { params: { productId: "wrong" } };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.hasProductId(req, res, next);
    expect(res.json).toBeCalledWith({message: "Product does not exist."});
    expect(res.status).toBeCalledWith(404);
  })
})

describe("hasProductInfo", () => {
  it("should notice all fields have been filled", async () => {
    const req = {body: {
      title: "testTitle",
      description: "testDescription",
      price: 5.00,
      variations: ["standard"],
      image: {
        url: "test",
        publicId: "test"
      }
    }};
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.hasProductInfo(req, res, next);
    expect(next).toBeCalled();
  })
  it("should notice some fields are missing", async () => {
    const req = {body: {
      title: "testTitle",
      description: "testDescription",
      price: 5.00,
      variations: [],
      image: {
        url: "",
        publicId: ""
      }
    }};
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.hasProductInfo(req, res, next);
    expect(res.json).toBeCalledWith({message: "Missing required fields."});
    expect(res.status).toBeCalledWith(400);
  })
})

describe("reviewAuthorized", () => {
  it("should authorize the user with respect to the review", async () => {
    const review = await helpers.getReview();
    const req = {
      params: { productId: review.product._id, reviewId: review._id },
      user: { _id: review.user.id }
    };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.reviewAuthorized(req, res, next);
    expect(next).toBeCalled();
  })
  it("should notice the review id is invalid", async () => {
    const review = await helpers.getReview();
    const req = {
      params: { productId: review.product._id, reviewId: "wrong" },
      user: { _id: review.user.id }
    };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.reviewAuthorized(req, res, next);
    expect(res.json).toBeCalledWith({message: "Review does not exist."});
    expect(res.status).toBeCalledWith(404);
  })
  it("should notice the user isn't the review's author", async () => {
    const user = await helpers.getUser();
    const review = await helpers.getReview();
    const req = {
      params: { productId: review.product._id, reviewId: review._id },
      user: { _id: user.id }
    };
    const res = { json: jest.fn(() => res), status: jest.fn(() => res) };
    const next = jest.fn();
    await middleware.reviewAuthorized(req, res, next);
    expect(res.json).toBeCalledWith({message: "You do not have permission to do that."});
    expect(res.status).toBeCalledWith(401);
  })
})