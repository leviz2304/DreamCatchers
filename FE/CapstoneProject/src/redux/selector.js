import { createSelector } from "@reduxjs/toolkit";
const isLoginSelector = (state) => state.isLogin;

export const rootSelector = createSelector(isLoginSelector);
