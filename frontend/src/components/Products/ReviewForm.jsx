import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { submitProductReview } from "../../redux/slices/productSlice";

const ReviewForm = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviewLoading, reviewSuccess, reviewError } = useSelector((state) => state.products);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide both rating and comment");
      return;
    }

    dispatch(
      submitProductReview({
        productId,
        review: { rating, comment },
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Review submitted successfully");
        setRating(0);
        setComment("");
      })
      .catch((err) => {
        toast.error(err || "Something went wrong!");
      });
  };

  return (
    <div className="mt-10 w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">Submit Your Review</h3>
      <form onSubmit={handleReviewSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Rating</label>
          <select
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="">Select Rating</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️ - Excellent</option>
            <option value="4">⭐️⭐️⭐️⭐️ - Very Good</option>
            <option value="3">⭐️⭐️⭐️ - Good</option>
            <option value="2">⭐️⭐️ - Fair</option>
            <option value="1">⭐️ - Poor</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            rows="4"
            className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Write your thoughts here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={reviewLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          {reviewLoading ? "Submitting..." : "Submit Review"}
        </button>

        {reviewError && (
          <p className="text-sm text-red-500 text-center">{reviewError}</p>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
