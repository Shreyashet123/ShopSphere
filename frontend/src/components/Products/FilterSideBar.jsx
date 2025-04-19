import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilter] = useState({
    category: "",
    gender: "",
    colors: [],
    sizes: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = ["Red", "Blue", "Green", "Black", "White","Yellow", "Orange", "Purple", "Pink", "Gray"];
  const sizes = ["S", "M", "L", "XL"];
  const materials = ["Cotton", "Leather", "Chiffon", "Silk"];
  const brands = ["Calvin Klein", "Zara", "H&M", "Burberry","Ethnicwear"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      category: params.category || "",
      gender: params.gender || "",
      colors: params.colors ? params.colors.split(",") : [],
      sizes: params.sizes ? params.sizes.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 100
    });
    setPriceRange([0, parseInt(params.maxPrice) || 100]);
  }, [searchParams]);

  const updateUrlParams = (newFilters) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
    navigate(`?${params.toString()}`);
  };

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    const updatedFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        updatedFilters[name] = [...(updatedFilters[name] || []), value];
      } else {
        updatedFilters[name] = updatedFilters[name].filter((item) => item !== value);
      }
    } else {
      updatedFilters[name] = value;
    }

    setFilter(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  const handleColorClick = (color) => {
    const isSelected = filters.colors.includes(color);
    const updatedColors = isSelected
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];

    const updatedFilters = { ...filters, colors: updatedColors };
    setFilter(updatedFilters);
    updateUrlParams(updatedFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilter(newFilters);
    updateUrlParams(newFilters);
  };

  return (
    <div className='p-4'>
      <h3 className='text-xl font-medium text-gray-800 mb-4'>Filter</h3>

      {/* Category */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Category</label>
        {categories.map((category) => (
          <div key={category} className='flex items-center mb-2'>
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500'
            />
            <span className='text-gray-700'>{category}</span>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Gender</label>
        {genders.map((g) => (
          <div key={g} className='flex items-center mb-2'>
            <input
              type="radio"
              name="gender"
              value={g}
              checked={filters.gender === g}
              onChange={handleFilterChange}
              className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500'
            />
            <span className='text-gray-700'>{g}</span>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Color</label>
        <div className='flex flex-wrap gap-2'>
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => handleColorClick(color)}
              className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${filters.colors.includes(color) ? "ring-2 ring-blue-500" : ""}`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Size</label>
        <div className='flex flex-wrap gap-2'>
          {sizes.map((size) => (
            <div key={size} className='flex items-center mb-1'>
              <input
                type="checkbox"
                value={size}
                checked={filters.sizes.includes(size)}
                onChange={handleFilterChange}
                name="sizes"
                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500'
              />
              <span className='text-gray-700'>{size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Material */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Material</label>
        <div className='flex flex-wrap gap-2'>
          {materials.map((mat) => (
            <div key={mat} className='flex items-center mb-1'>
              <input
                type="checkbox"
                value={mat}
                onChange={handleFilterChange}
                checked={filters.material.includes(mat)}
                name="material"
                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500'
              />
              <span className='text-gray-700'>{mat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Brand</label>
        <div className='flex flex-wrap gap-2'>
          {brands.map((brand) => (
            <div key={brand} className='flex items-center mb-1'>
              <input
                type="checkbox"
                value={brand}
                onChange={handleFilterChange}
                checked={filters.brand.includes(brand)}
                name="brand"
                className='mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500'
              />
              <span className='text-gray-700'>{brand}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className='mb-6'>
        <label className='block text-gray-600 font-medium mb-2'>Price Range</label>
        <input
          type="range"
          name="priceRange"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
        />
        <div className='flex justify-between text-gray-600 mt-2'>
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
