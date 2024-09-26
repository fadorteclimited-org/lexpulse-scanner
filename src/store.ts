import {configureStore} from "@reduxjs/toolkit";
import AuthReducer from './data/authSlice.ts'
import TicketsReducer from './data/ticketsSlice.ts'
const store = configureStore(
    {
        reducer: {
            auth: AuthReducer,
            tickets: TicketsReducer,
        }
    }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;