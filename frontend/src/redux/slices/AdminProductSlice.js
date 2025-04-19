import {createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const API_URL=`${import.meta.env.VITE_BACKEND_URL}`;
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);


// async function to createproduct

export const createproduct = createAsyncThunk(
  "adminProducts/createproduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/products`, productData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Create Product Error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productdata }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productdata,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteProduct=createAsyncThunk("adminProducts/deleteProduct",async(id)=>{
    await axios.delete(`${API_URL}/api/admin/products/${id}`,{
        headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
        }
    })
    return id;
})

export const uploadImage = createAsyncThunk(
  "adminProducts/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.imageUrl;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Image upload failed"
      );
    }
  }
);

const adminProductSlice=createSlice({
    name:"adminProducts",
    initialState:{
        products:[],
        loading:false,
        error:null,
        imageUrl: "",         // Add this to hold the uploaded image URL
        imageUploading: false,
        imageUploadError: null,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
          .addCase(fetchAdminProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
          })
          .addCase(fetchAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
          })
    
          // Create product
          .addCase(createproduct.fulfilled, (state, action) => {
            state.products.push(action.payload);
          })
          .addCase(uploadImage.pending, (state) => {
            state.imageUploading = true;
            state.imageUploadError = null;
          })
          .addCase(uploadImage.fulfilled, (state, action) => {
            state.imageUploading = false;
            state.imageUrl = action.payload;
          })
          .addCase(uploadImage.rejected, (state, action) => {
            state.imageUploading = false;
            state.imageUploadError = action.payload;
          })
    
          // Update product
          .addCase(updateProduct.fulfilled, (state, action) => {
            const index = state.products.findIndex(
              (product) => product._id === action.payload._id
            );
            if (index !== -1) {
              state.products[index] = action.payload;
            }
          })
    
          // Delete product
          .addCase(deleteProduct.fulfilled, (state, action) => {
            state.products = state.products.filter(
              (product) => product._id !== action.payload
            );
          });
    }
})
export default adminProductSlice.reducer;