import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createproduct, uploadImage } from '../../redux/slices/AdminProductSlice';

const CreateProductForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    countInStock: '',
    sku: '',
    category: '',
    brand: '',
    sizes: '',
    colors: '',
    collections: '',
    material: '',
    gender: '',
    isFeatured: false,
    isPublished: false,
    tags: '',
    metatitle: '',
    metadescription: '',
    metaKeywords: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    images: [],
  });

  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setImageFiles(Array.from(files));
    } else if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const uploadedImages = [];

    for (const file of imageFiles) {
      const result = await dispatch(uploadImage(file));
      if (result.payload) {
        uploadedImages.push({ url: result.payload, altText: form.name });
      }
    }

    const productData = {
      ...form,
      price: Number(form.price),
      discountPrice: Number(form.discountPrice),
      countInStock: Number(form.countInStock),
      weight: Number(form.weight),
      sizes: form.sizes.split(',').map(s => s.trim()),
      colors: form.colors.split(',').map(c => c.trim()),
      collections: form.collections.split(',').map(c => c.trim()),
      tags: form.tags.split(',').map(t => t.trim()),
      dimensions: {
        length: Number(form.length),
        width: Number(form.width),
        height: Number(form.height),
      },
      images: uploadedImages,
    };

    await dispatch(createproduct(productData));
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Product</h2>

      <input name="name" placeholder="Product Name" onChange={handleChange} className="w-full p-2 border rounded" required />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="price" type="number" placeholder="Price" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="discountPrice" type="number" placeholder="Discount Price" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="countInStock" type="number" placeholder="Stock Count" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="sku" placeholder="SKU" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="category" placeholder="Category" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="brand" placeholder="Brand" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="sizes" placeholder="Sizes (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="colors" placeholder="Colors (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="collections" placeholder="Collections (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="material" placeholder="Material" onChange={handleChange} className="w-full p-2 border rounded" />
      <select
  name="gender"
  value={form.gender}  // Correct reference to 'form' state
  onChange={handleChange}
  required
>
  <option value="">Select Gender</option>
  <option value="Men">Men</option>
  <option value="Women">Women</option>
  <option value="Unisex">Unisex</option>
</select>



      <div className="flex gap-4">
        <label className="flex items-center">
          <input type="checkbox" name="isFeatured" onChange={handleChange} />
          <span className="ml-2">Featured</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" name="isPublished" onChange={handleChange} />
          <span className="ml-2">Published</span>
        </label>
      </div>

      <input name="tags" placeholder="Tags (comma-separated)" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="metatitle" placeholder="Meta Title" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="metadescription" placeholder="Meta Description" onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="metaKeywords" placeholder="Meta Keywords" onChange={handleChange} className="w-full p-2 border rounded" />

      <div className="grid grid-cols-3 gap-2">
        <input name="length" type="number" placeholder="Length" onChange={handleChange} className="p-2 border rounded" />
        <input name="width" type="number" placeholder="Width" onChange={handleChange} className="p-2 border rounded" />
        <input name="height" type="number" placeholder="Height" onChange={handleChange} className="p-2 border rounded" />
      </div>

      <input name="weight" type="number" placeholder="Weight (kg)" onChange={handleChange} className="w-full p-2 border rounded" />

      <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="w-full" />

      {uploading ? (
        <p className="text-gray-500">Uploading images...</p>
      ) : (
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Product
        </button>
      )}
    </form>
  );
};

export default CreateProductForm;
