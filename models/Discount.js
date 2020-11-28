const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
    percent: Number,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    expireAt: {type: Date, expireAfterSeconds: 0}
});

module.exports = mongoose.model("Discount", discountSchema);