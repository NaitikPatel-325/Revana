import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";
import {
  setCurrentWidth,
  updateCurrentUser,
  updateIsLoggedIn,
  updateLoginMethod,
} from "@/redux/slices/appSlice";
import { googleLogout } from "@react-oauth/google";
import "./index.css";
import Cookies from "js-cookie";
import { useLogoutMutation } from "./redux/slices/api";

export default function Header() {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const windowWidth = useSelector(
    (state: RootState) => state.appSlice.currentWidth
  );
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.appSlice.isLoggedIn
  );
  const [logoutMutation] = useLogoutMutation();
  console.log("IS LOGGED IN ->  ", isLoggedIn);
  const loginMethod = useSelector(
    (state: RootState) => state.appSlice.loginMethod
  );
  const navigate = useNavigate();

  // Handle resizing
  useEffect(() => {
    const handleResize = () => dispatch(setCurrentWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call backend logout API
      await logoutMutation().unwrap();

      // Handle provider-based logout
      if (loginMethod === "google") googleLogout();
      else if (loginMethod === "github") console.log("Logged out from GitHub");

      // Clear Redux state & remove cookies
      dispatch(updateIsLoggedIn(false)); // Set isLoggedIn to false
      dispatch(updateCurrentUser({}));
      Cookies.remove("token"); // Remove token from cookies

      // Force window resize to trigger useEffect
      setTimeout(() => {
        dispatch(setCurrentWidth(window.innerWidth));
      }, 0);

      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleComments = () => {
    navigate("/comments");
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white p-3 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left Side: App Title */}
        <Link to="/">
          <h2 className="font-bold select-none">Revana</h2>
        </Link>

        {/* Right Side: User Auth & Navigation */}
        {windowWidth > 500 ? (
          <ul className="flex gap-4">
            {isLoggedIn ? (
              <>
                <li>
                  <Button onClick={handleComments} variant="blue">
                    Comments
                  </Button>
                </li>

                <li>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/signup">
                  <Button variant="blue">Signup</Button>
                </Link>
              </li>
            )}
          </ul>
        ) : (
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button>
                <GiHamburgerMenu />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full">
              <ul className="flex flex-col gap-2">
                {isLoggedIn ? (
                  <li>
                    <Button
                      onClick={handleLogout}
                      className="w-full"
                      variant="destructive"
                    >
                      Logout
                    </Button>
                  </li>
                ) : (
                  <li>
                    <Link to="/signup">
                      <Button className="w-full" variant="blue">
                        Signup
                      </Button>
                    </Link>
                  </li>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  );
}
