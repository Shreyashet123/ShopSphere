import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RiDeleteBinLine, RiEdit2Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, fetchAdminProducts } from '../../redux/slices/AdminProductSlice'

const ProductMangement = () => {
const dispatch=useDispatch();
const {products,loading,error}=useSelector((state)=>state.adminProducts)
useEffect(()=>{
  dispatch(fetchAdminProducts())
},[dispatch])
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
    }
  }

  if(loading) return <div>Loading...</div>
  if(error) return <div>Error: {error.message}</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Management</h2>

      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            <tr>
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Price</th>
              <th className="py-4 px-6">SKU</th>
              <th className="py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                  <td className="py-4 px-6">{product.sku}</td>
                  <td className="py-4 px-6 flex items-center space-x-2">
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className="flex items-center bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                    >
                      <RiEdit2Line className="mr-1" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
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
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No Products Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductMangement
