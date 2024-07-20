import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducer/profileSliceReducer";

const store=configureStore({
    reducer:rootReducer
})
export default store;