import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import assessmentSlice from "./assessmentSlice"
import jobSlice from "./jobSlice"
import applicantSlice from "./applicantSlice"
import UserJobSlice from "./UserJobSlice"
import chatSlice from "./chatSlice";
import sponcershipApplicationSlice from "./sponcershipApplicationSlice";

import {
    persistReducer,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    auth: authSlice,
    assessment: assessmentSlice,
    job: jobSlice,
    userJobs: UserJobSlice,
    applicant: applicantSlice,
    chat: chatSlice,
    sponcershipApplication: sponcershipApplicationSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
export default store;