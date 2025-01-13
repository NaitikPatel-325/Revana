import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// Define types for the state
export interface appSliceState {
  currentUser: {
    username?: string;
    picture?: string;
    email?: string;
  };
  isLoggedIn: boolean;
  loginMethod?: "google" | "github"; // Track the login method
  currentWidth: number;
}

const initialState: appSliceState = {
  currentUser: {},
  isLoggedIn: false,
  loginMethod: undefined, // Initial login method is undefined
  currentWidth: window.innerWidth,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    updateCurrentUser: (
      state,
      action: PayloadAction<appSliceState["currentUser"]>
    ) => {
      state.currentUser = action.payload;
    },
    updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setLoginMethod: (state, action: PayloadAction<"google" | "github">) => {
      state.loginMethod = action.payload;
    },
    setCurrentWidth: (state, action: PayloadAction<number>) => {
      state.currentWidth = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { updateCurrentUser, updateIsLoggedIn, setLoginMethod, setCurrentWidth } = appSlice.actions;
