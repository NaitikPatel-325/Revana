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
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, MessageCircle, Menu } from "lucide-react";

export default function Header() {
  const [sheetOpen, setSheetOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const windowWidth = useSelector((state: RootState) => state.appSlice.currentWidth);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.appSlice.isLoggedIn);
  const [logoutMutation] = useLogoutMutation();
  const loginMethod = useSelector((state: RootState) => state.appSlice.loginMethod);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle resizing
  useEffect(() => {
    const handleResize = () => dispatch(setCurrentWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, windowWidth]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      if (loginMethod === "google") googleLogout();
      else if (loginMethod === "github") console.log("Logged out from GitHub");
      
      dispatch(updateIsLoggedIn(false));
      dispatch(updateCurrentUser({}));
      Cookies.remove("token");
      
      setTimeout(() => {
        dispatch(setCurrentWidth(window.innerWidth));
      }, 0);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleComments = () => {
    navigate("/comments");
  };

  const navVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 w-full backdrop-blur-md z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-gray-900/90 shadow-lg" 
          : "bg-gray-900/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left Side: App Title */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <h2 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 select-none">
                Revana
              </h2>
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 group-hover:w-full transition-all duration-300"
                whileHover={{ width: "100%" }}
              />
            </motion.div>
          </Link>

          {/* Right Side: User Auth & Navigation */}
          {windowWidth > 500 ? (
            <motion.ul 
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isLoggedIn ? (
                <>
                  <motion.li variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      onClick={handleComments}
                      className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Comments
                    </Button>
                  </motion.li>

                  <motion.li variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button 
                      onClick={handleLogout}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </Button>
                  </motion.li>
                </>
              ) : (
                <motion.li variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/signup">
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                    >
                      Sign up
                    </Button>
                  </Link>
                </motion.li>
              )}
            </motion.ul>
          ) : (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-gray-900/95 backdrop-blur-lg border-gray-800"
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex flex-col gap-6 mt-8">
                    {isLoggedIn ? (
                      <>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            onClick={handleComments}
                            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2 justify-center"
                          >
                            <MessageCircle size={18} />
                            Comments
                          </Button>
                        </motion.div>
                        <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                          <Button
                            onClick={handleLogout}
                            variant="destructive"
                            className="w-full flex items-center gap-2 justify-center"
                          >
                            <LogOut size={18} />
                            Logout
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                        <Link to="/signup" className="block w-full">
                          <Button 
                            className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                          >
                            Sign up
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </motion.nav>
  );
}