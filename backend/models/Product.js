const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0,
        },
        sku: {
            type: String,
            required: true,
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        brand: {
            type: String,
        },
        sizes: {
            type: [String],
            required: true,
        },
        colors: {
            type: [String],
            required: true,
            default: [],
        },
        collections: {
            type: [String],
            required: true,
        },
        material: {
            type: String,
        },
        gender: {
            type: String,
            enum: ["Men", "Women", "Unisex"],
            required: false, // or remove this line completely
          },
          
        images: [
            {
                url: {
                    type: String,
                    required: true,
                },
                altText: {
                    type: String,
                },
            },
        ],
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isPublished: { // ✅ Fixed typo from "isPubllished"
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
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
              createdAt: { type: Date, default: Date.now },
            },
          ],
        tags: [String],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        metatitle: {
            type: String,
        },
        metadescription: {
            type: String,
        },
        metaKeywords: {
            type: String,
        },
        dimensions: { // ✅ Fixed object structure
            type: {
                length: Number,
                width: Number,
                height: Number,
            },
        },
        weight: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
