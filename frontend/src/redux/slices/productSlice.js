import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch products with filters and pagination
export const fetchedProductByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collections,
    sizes,
    colors,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit = 8,
    page = 1
  }) => {
    const query = new URLSearchParams();

    if (collections) {
      const arr = Array.isArray(collections) ? collections : [collections];
      query.append("collections", arr.join(","));
    }

    if (sizes) {
      const arr = Array.isArray(sizes) ? sizes : [sizes];
      query.append("sizes", arr.join(","));
    }

    if (colors) {
      const arr = Array.isArray(colors) ? colors : [colors];
      query.append("colors", arr.join(","));
    }

    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sort", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);

    query.append("limit", limit);
    query.append("page", page);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );
    return response.data;
  }
);



// Other thunks unchanged
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );
    return response.data;
  }
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

export const submitProductReview = createAsyncThunk(
  "products/submitReview",
  async ({ productId, review }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/review/${productId}`,
        review,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Pass token
          },
        }
      );

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit review"
      );
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "products/deleteReview",
  async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/review/${productId}/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
  }
);



// Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    updatedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    filters: {
      category: "",
      sizes: [],
      colors: [],
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collections: []
    },
    reviewLoading: false,
    reviewSuccess: false,
    reviewError: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        sizes: "",
        colors: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collections: ""
      };
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchedProductByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchedProductByFilters.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalCount;
        state.loading = false;
      })
      .addCase(fetchedProductByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        const errorMessage = action.error.response?.data?.message || action.error.message || "Something went wrong.";
        state.error = errorMessage;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Submit Review Handlers
      .addCase(submitProductReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewSuccess = false;
        state.reviewError = null;
      })
      .addCase(submitProductReview.fulfilled, (state, action) => {
        state.reviewLoading = false;
        state.reviewSuccess = true;
        state.reviewError = null;
        
        if (state.selectedProduct) {
          state.selectedProduct.reviews = action.payload.reviews;
          state.selectedProduct.averageRating = action.payload.averageRating;
          state.selectedProduct.numReviews = action.payload.numReviews;
        }
      })
      .addCase(submitProductReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      }) 
      

// Delete Review
.addCase(deleteProductReview.fulfilled, (state, action) => {
  state.reviewSuccess = true;
  state.reviewLoading = false;
  if (state.selectedProduct) {
    state.selectedProduct.reviews = action.payload.reviews;
    state.selectedProduct.averageRating = action.payload.averageRating;
    state.selectedProduct.numReviews = action.payload.numReviews;
  }
})
.addCase(deleteProductReview.pending, (state) => {
  state.reviewLoading = true;
  state.reviewSuccess = false;
})
.addCase(deleteProductReview.rejected, (state, action) => {
  state.reviewLoading = false;
  state.reviewError = action.payload;
})

  }
});

export const { setFilters, clearFilters, setCurrentPage } = productSlice.actions;
export default productSlice.reducer;



