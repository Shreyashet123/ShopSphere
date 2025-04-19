const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: Number,
    countInStock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    brand: String,
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true, default: [] },
    collections: { type: [String], required: true },
    material: String,
    gender: { type: String, enum: ["Men", "Women", "Unisex"] },
    images: [
      {
        url: { type: String, required: true },
        altText: String,
      },
    ],
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    tags: [String],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    metatitle: String,
    metadescription: String,
    metaKeywords: String,
    dimensions: {
      type: {
        length: Number,
        width: Number,
        height: Number,
      },
    },
    weight: Number,
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
