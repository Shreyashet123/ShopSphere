import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  deleteProductReview,
  fetchProductDetails,
  fetchSimilarProducts,
  submitProductReview,
} from "../../redux/slices/productSlice";
import { addtoCart } from "../../redux/slices/cartSlice";
import ProductGrid from "./ProductGrid";

const ProductDetails = ({ productId: propProductId }) => {
  const { id: paramId } = useParams();
  const dispatch = useDispatch();
  const productId = propProductId || paramId;

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductDetails(productId));
      dispatch(fetchSimilarProducts({ id: productId }));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleColorClick = (color) => setSelectedColor(color);
  const handleSizeClick = (size) => setSelectedSize(size);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }

    setIsLoading(true);
    dispatch(
      addtoCart({
        productId,
        quantity: selectedQuantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => toast.success("Product added to cart successfully!"))
      .finally(() => setIsLoading(false));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please add a rating and comment");
      return;
    }

    try {
      await dispatch(
        submitProductReview({
          productId,
          review: { rating, comment },
        })
      ).unwrap();

      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      dispatch(fetchProductDetails(productId));
    } catch (err) {
      toast.error("Failed to submit review. Try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await dispatch(deleteProductReview({ productId, reviewId })).unwrap();
      toast.success("Review deleted.");
      dispatch(fetchProductDetails(productId));
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!selectedProduct) return <p className="text-center">Product not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Images */}
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <div className="relative w-full h-[500px] bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={mainImage || "/images/default-image.jpg"}
              alt={selectedProduct.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto py-2">
            {selectedProduct.images?.map((img) => (
              <button
                key={img.url}
                onClick={() => setMainImage(img.url)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  mainImage === img.url
                    ? "border-black ring-2 ring-offset-2 ring-black"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${img.url}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{selectedProduct.name}</h1>
          <p className="text-gray-700">{selectedProduct.description}</p>
          <p className="text-xl font-semibold text-green-600">${selectedProduct.price}</p>

          <div className="space-y-1">
            <p className="font-medium">Color:</p>
            <div className="flex gap-2">
              {Array.isArray(selectedProduct?.colors) && selectedProduct.colors.length > 0 ? (
                selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                      selectedColor === color ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorClick(color)}
                  ></button>
                ))
              ) : (
                <p>No colors available</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="font-medium">Size:</p>
            <div className="flex gap-2">
              {selectedProduct.sizes?.map((size) => (
                <button
                  key={size}
                  className={`px-4 py-1 border rounded ${
                    selectedSize === size ? "bg-black text-white" : "bg-white text-black"
                  }`}
                  onClick={() => handleSizeClick(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => setSelectedQuantity((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 border rounded-full"
            >
              -
            </button>
            <span>{selectedQuantity}</span>
            <button
              onClick={() => setSelectedQuantity((prev) => prev + 1)}
              className="w-8 h-8 border rounded-full"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-2 rounded mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Customer Reviews</h2>
        {selectedProduct?.reviews?.length === 0 && <p>No reviews yet.</p>}

        {selectedProduct?.reviews?.map((review, idx) => (
          <div key={idx} className="mb-4">
            <div className="flex items-center gap-2">
              <img
                src={review.user?.avatar || "/images/default-avatar.png"}
                alt={review.user?.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="font-medium">{review.user?.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-1 mt-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-yellow-400">&#9733;</span>
              ))}
              {Array.from({ length: 5 - review.rating }).map((_, i) => (
                <span key={i} className="text-gray-300">&#9733;</span>
              ))}
            </div>
            <p>{review.comment}</p>
            {user && (review.user === user._id || review.user?._id === user._id) && (
              <div className="mt-1">
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {user && (
          <form onSubmit={handleSubmitReview}>
            <div className="flex gap-2">
              <select
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="border px-4 py-1 rounded"
              >
                <option value="">Rating</option>
                {[1, 2, 3, 4, 5].map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a review..."
              className="w-full mt-4 p-2 border rounded"
              rows="4"
            ></textarea>
            <button
              type="submit"
              className="bg-black text-white mt-4 px-6 py-2 rounded"
            >
              Submit Review
            </button>
          </form>
        )}
      </div>

      {/* Similar Products */}
      <h2 className="text-2xl font-semibold mt-16 mb-4">Similar Products</h2>
      <ProductGrid products={similarProducts} />
    </div>
  );
};

export default ProductDetails;
