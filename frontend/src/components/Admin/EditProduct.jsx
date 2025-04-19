import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProductDetails, updateProduct } from '../../redux/slices/productSlice'
import axios from 'axios'

const EditProduct = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const { selectedProduct, loading, error } = useSelector((state) => state.products)

  const [productdata, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    countInStock: 0,
    sku: '',
    category: '',
    brand: '',
    sizes: [],
    colors: [],
    collections: '',
    material: '',
    images: []
  })

  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct)
    }
  }, [selectedProduct])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'sizes' || name === 'colors') {
      setProductData((prev) => ({
        ...prev,
        [name]: value.split(',').map((val) => val.trim())
      }))
    } else {
      setProductData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    try {
      setIsUploading(true)
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setProductData((prev) => ({
        ...prev,
        images: [{ url: data.imageUrl, altText: 'Product Image' }]

      }))
      setUploadedImageUrl(data.imageUrl)
    } catch (err) {
      console.log(err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(updateProduct({ id, productData: productdata }))

    navigate('/admin/products')
  }

  if (loading) return <h1>Loading...</h1>
  if (error) return <h1>Error: {error.message}</h1>

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white rounded-md shadow-md mt-10'>
      <h2 className='text-3xl font-bold text-gray-800 mb-8'>Edit Product</h2>
      <form onSubmit={handleSubmit} className='space-y-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-1 font-medium text-gray-700'>Product Name</label>
            <input
              type='text'
              name='name'
              value={productdata.name}
              onChange={handleChange}
              className='w-full border p-2 rounded-md focus:outline-blue-500'
              required
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Price ($)</label>
            <input
              type='number'
              name='price'
              value={productdata.price}
              onChange={handleChange}
              className='w-full border p-2 rounded-md focus:outline-blue-500'
              required
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>SKU</label>
            <input
              type='text'
              name='sku'
              value={productdata.sku}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Count In Stock</label>
            <input
              type='number'
              name='countInStock'
              value={productdata.countInStock}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Category</label>
            <input
              type='text'
              name='category'
              value={productdata.category}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Brand</label>
            <input
              type='text'
              name='brand'
              value={productdata.brand}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Collections</label>
            <input
              type='text'
              name='collections'
              value={productdata.collections}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Material</label>
            <input
              type='text'
              name='material'
              value={productdata.material}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Sizes (comma separated)</label>
            <input
              type='text'
              name='sizes'
              value={productdata.sizes.join(', ')}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
              placeholder='e.g. S, M, L, XL'
            />
          </div>

          <div>
            <label className='block mb-1 font-medium text-gray-700'>Colors (comma separated)</label>
            <input
              type='text'
              name='colors'
              value={productdata.colors.join(', ')}
              onChange={handleChange}
              className='w-full border p-2 rounded-md'
              placeholder='e.g. Red, Blue, Green'
            />
          </div>
        </div>

        <div>
          <label className='block mb-1 font-medium text-gray-700'>Description</label>
          <textarea
            name='description'
            rows='4'
            value={productdata.description}
            onChange={handleChange}
            className='w-full border p-3 rounded-md'
          ></textarea>
        </div>

        <div className='mt-4'>
          <label className='block mb-2 font-medium text-gray-700'>Upload Image</label>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            className='w-full border p-2 rounded-md'
          />
        </div>

        {uploadedImageUrl ? (
  <div className='mt-4'>
    <img
      src={uploadedImageUrl}
      alt='Uploaded Preview'
      className='w-48 h-48 object-cover rounded border'
    />
  </div>
) : null}


        <div className='pt-6'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition'
          >
            {isUploading ? 'Uploading...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
