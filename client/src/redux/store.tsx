import { combineReducers, configureStore } from "@reduxjs/toolkit";
import postSlice from "./postSlice";
import authSlice from "./authSlice";


import storage from 'redux-persist/lib/storage'
import { 
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth','post'],
}
const rootReducer=combineReducers({
    auth:authSlice,
    post:postSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

const store=configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})
export const persistor = persistStore(store); // Export persistor

export default store