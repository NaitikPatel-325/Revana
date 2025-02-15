import { Toaster } from "sonner";
import "./App.css";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./Header";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AllRoutes from "./AllRoutes";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetUserDetailsQuery } from "@/redux/slices/api";
import { useDispatch } from "react-redux";
import { updateCurrentUser, updateIsLoggedIn } from "@/redux/slices/appSlice";

function App() {

   const dispatch = useDispatch();

  // ✅ Fetch user details from backend instead of checking cookies manually
  const { data, isSuccess } = useGetUserDetailsQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(updateCurrentUser(data)); // ✅ Backend should return user details
      dispatch(updateIsLoggedIn(true));
    }
  }, [data, isSuccess, dispatch]);
  

  return (
    <>
      <GoogleOAuthProvider clientId="397412299941-e4ggjibis1kfbl2bib5jc1360hlk5uq4.apps.googleusercontent.com" key="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">
        <Toaster position="bottom-right" theme="dark" />
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Header></Header>
          <AllRoutes />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
