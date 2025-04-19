import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 const loadCartFromStorage=()=>{
    const storedCart=localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : {products:[]};
 };

 const saveCartToStorage = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));
};


 export const fetchCart=createAsyncThunk("cart/fetchCart",async({userId,guestId},{rejectWithValue})=>{
    try{
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/carts`,
            {
                params:{
                    userId,
                    guestId
                }
            }
        );
        return response.data;
    }catch(error){
        console.error(error);
        return rejectWithValue(error.response.data);
    }
     
 });

 export const addtoCart=createAsyncThunk("cart/addToCart",async({
    productId,quantity,size,color,guestId,userId
 },{rejectWithValue})=>{
    try{
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/carts`,
            {
                productId,
                quantity,
                size,
                color,
                guestId,
                userId
            }
        );
        return response.data;
    }catch (error) {
        console.error("ADD TO CART ERROR:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Add to cart failed");
    }
 });

 export const updateCartItemQuantity=createAsyncThunk("cart/updateCartItemQuantity",async({productId,quantity,guestId,userId,size,color},{rejectWithValue})=>{
    try{
        const response=await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/carts`,
            {
                productId,
                quantity,
                guestId,
                userId,
                size,
                color
            }
        );
        return response.data;
    }catch(error){
        console.error(error);
        return rejectWithValue(error.response.data);
    }
 })

 export const removefromcart=createAsyncThunk("cart/removefromcart",async({productId,guestId,userId,size,color},{rejectWithValue})=>{
    try{
        const response=await axios({
            method:"DELETE",
            url:`${import.meta.env.VITE_BACKEND_URL}/api/carts`,
            data:{
                productId,
                guestId,
                userId,
                size,
                color
            }
        })
        return response.data;
    }catch(error){
        console.error(error);
        return rejectWithValue(error.response.data);
    }
 })
 export const mergeCart=createAsyncThunk("cart/mergeCart",async({guestId,userId},{rejectWithValue})=>{
    try{
        const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/carts/merge`,{
            guestId,
            userId
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    }catch(error){
        console.error(error);
        return rejectWithValue(error.response.data);
    }
     
 })

 const cartSlice=createSlice({
     name:"cart",
     initialState:{
         cart:loadCartFromStorage(),
         loading:false,
         error:null
     },
     reducers:{
         clearCart:(state)=>{
            state.cart={products:[]};
            localStorage.removeItem("cart");
         }
     },
     extraReducers:(builder)=>{
         builder
         .addCase(fetchCart.pending,(state)=>{
             state.loading=true;
             state.error=null;
         })
         .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading=false;
            state.cart=action.payload;
            saveCartToStorage(action.payload);
        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading=true;
            state.error=action.error.message || "Failed to Fetch cart";
        })


        .addCase(addtoCart.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(addtoCart.fulfilled,(state,action)=>{
           state.loading=false;
           state.cart=action.payload;
           saveCartToStorage(action.payload);
       })
       .addCase(addtoCart.rejected,(state,action)=>{
           state.loading=true;
           state.error=action.error.message || "Failed to add to cart";
       })


       .addCase(updateCartItemQuantity.pending,(state)=>{
        state.loading=true;
        state.error=null;
    })
    .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
       state.loading=false;
       state.cart=action.payload;
       saveCartToStorage(action.payload);
   })
   .addCase(updateCartItemQuantity.rejected,(state,action)=>{
       state.loading=true;
       state.error=action.error.message || "Failed to update item Quantity";
   })

   .addCase(removefromcart.pending,(state)=>{
    state.loading=true;
    state.error=null;
})
.addCase(removefromcart.fulfilled,(state,action)=>{
   state.loading=false;
   state.cart=action.payload;
   saveCartToStorage(action.payload);
})
.addCase(removefromcart.rejected,(state,action)=>{
   state.loading=true;
   state.error=action.error.message || "Failed to remove item";
})

.addCase(mergeCart.pending,(state)=>{
    state.loading=true;
    state.error=null;
})
.addCase(mergeCart.fulfilled,(state,action)=>{
   state.loading=false;
   state.cart=action.payload;
   saveCartToStorage(action.payload);
})
.addCase(mergeCart.rejected,(state,action)=>{
   state.loading=true;
   state.error=action.error.message || "Failed to merge cart";
})

     }
 });

 export const {clearCart}=cartSlice.actions;
 export default cartSlice.reducer;