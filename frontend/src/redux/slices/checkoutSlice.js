import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createCheckout = createAsyncThunk("checkout/createCheckout",
    async(checkoutdata, {rejectWithValue})=>{
        try{
            const response=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
                checkoutdata,
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`
                    }
                }
                
                );
                return response.data;
        }catch(err){
            return rejectWithValue(err.response.data);
        }
    }
);
const checkoutSlice=createSlice({
    name:"checkout",
    initialState:{
        checkout:null,
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(createCheckout.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(createCheckout.fulfilled,(state,action)=>{
            state.loading=true;
            state.checkout=action.payload;
        })
        .addCase(createCheckout.rejected,(state)=>{
            state.loading=true;
            state.error=action.payload.message;
        });
    }
});
export default checkoutSlice.reducer;