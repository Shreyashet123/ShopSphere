import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminReviews, deleteReview } from '../../redux/slices/adminReviews'
import { RiDeleteBinLine } from 'react-icons/ri'
import { toast } from 'sonner'

const ReviewsManagement = () => {
  const dispatch = useDispatch()
  const { reviews, loading, error } = useSelector((state) => state.adminReviews)

  useEffect(() => {
    dispatch(fetchAdminReviews())
  }, [dispatch])

  const handleDelete = (productId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteReview({ productId, reviewId }))
        .unwrap()
        .then(() => toast.success("Review deleted"))
        .catch(() => toast.error("Failed to delete review"))
    }
  }

  if (loading) return <div>Loading reviews...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Reviews Management</h2>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-6">Review</th>
              <th className="py-4 px-6">Rating</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
          {Array.isArray(reviews) && reviews.length > 0 ? (
  reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {review.name || "Anonymous"}
                  </td>
                  <td className="py-4 px-6">{review.product?.name || "Unknown Product"}</td>

                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
  {review.name || review.user?.name || "Anonymous"}
</td>

<td className="py-4 px-6 max-w-sm break-words">
  {review.comment || "No comment"}
</td>

<td className="py-4 px-6">
  {review.rating != null ? `${review.rating} ⭐` : "No rating"}
</td>

                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleDelete(review.productId, review._id)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      <RiDeleteBinLine className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No Reviews Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ReviewsManagement
