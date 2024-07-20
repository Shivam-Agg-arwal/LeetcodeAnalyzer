import { combineReducers } from "redux";
import profileSlice from "../slices/profileSlice";

const rootReducer=combineReducers({
    profile:profileSlice
})

export default rootReducer;