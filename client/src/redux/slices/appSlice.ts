// import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// // Define types for the state
// export interface appSliceState {
//   currentUser: {
//     username?: string;
//     picture?: string;
//     email?: string;
//   };
//   isLoggedIn: boolean;
//   loginMethod?: "google" | "github"; // Track the login method
//   currentWidth: number;
// }

// const initialState: appSliceState = {
//   currentUser: {},
//   isLoggedIn: false,
//   loginMethod: undefined, // Initial login method is undefined
//   currentWidth: window.innerWidth,
// };

// const appSlice = createSlice({
//   name: "appSlice",
//   initialState,
//   reducers: {
//     updateCurrentUser: (
//       state,
//       action: PayloadAction<appSliceState["currentUser"]>
//     ) => {
//       state.currentUser = action.payload;
//     },
//     updateIsLoggedIn: (state, action: PayloadAction<boolean>) => {
//       state.isLoggedIn = action.payload;
//     },
//     setLoginMethod: (state, action: PayloadAction<"google" | "github">) => {
//       state.loginMethod = action.payload;
//     },
//     setCurrentWidth: (state, action: PayloadAction<number>) => {
//       state.currentWidth = action.payload;
//     },
//   },
// });

// export default appSlice.reducer;
// export const { updateCurrentUser, updateIsLoggedIn, setLoginMethod, setCurrentWidth } = appSlice.actions;


import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    user: null,
    loginMethod: null,
    isLoggedIn: false,
    currentWidth: window.innerWidth,
    TotalSentimentCount: {good: 0, neutral: 0, bad: 0},
    videodata: {
    channel: "",
    thumbnail: "",
    title: "",
    videoId: undefined,
    descriptions: {Pd: "", Nd: ""}
    }
  },
  reducers: {
    updateCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    updateIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    updateLoginMethod: (state, action) => { // ✅ Add this action
      state.loginMethod = action.payload;
    },
    setCurrentWidth: (state, action) => {  // ADD THIS
      state.currentWidth = action.payload;
    },
    setSentimentCounts: (state, action) => { 
      state.TotalSentimentCount = action.payload;
    },
    incrementSentimentCount: (state, action: PayloadAction<2 | 1 | 0>) => {
      console.log("In appSlice : ",action.payload);
      const sentiment = action.payload;
      if(sentiment==2)
        state.TotalSentimentCount['good']++;
      else if(sentiment==1)
        state.TotalSentimentCount['neutral']++;
      else if(sentiment==0)
        state.TotalSentimentCount['bad']++;
    }
    ,
    updateCurrentVideo: (state, action) => {
      console.log("Video-data action-payload : ",action.payload);
      state.videodata = action.payload;
    },
    setVideoDescription: (state, action) => {
      state.videodata.descriptions = action.payload;
    }
  },
});

export const { updateCurrentUser, updateIsLoggedIn, setCurrentWidth, updateLoginMethod, setSentimentCounts,updateCurrentVideo, setVideoDescription,incrementSentimentCount  } = appSlice.actions;
export default appSlice.reducer;
