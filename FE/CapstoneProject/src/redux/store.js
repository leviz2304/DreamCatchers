import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducers/loginSlice";
import notificationSlice from "./reducers/notificationSlice";
const store = configureStore({
    reducer: {
        login: loginSlice.reducer,
        notification: notificationSlice.reducer,
    },
});

export default store;
