import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useState, useEffect } from "react";
import {
  setCurrentWidth,
  updateCurrentUser,
  updateIsLoggedIn,
} from "@/redux/slices/appSlice";
import { googleLogout } from "@react-oauth/google";
import Cookies from "js-cookie";
import { useLogoutMutation } from "@/redux/slices/api";
import { motion } from "framer-motion";
import { LogOut, Menu, Video, ShoppingBag } from "lucide-react";
import { Button } from "./components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet";

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

  const navItems = [
    {
      title: "Videos",
      path: "/comments/videos", 
      icon: <Video className="w-5 h-5" />,
      color: "from-violet-600 to-indigo-600",
    },
    {
      title: "Fashion",
      path: "/comments/fashion",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-fuchsia-600 to-violet-600",
    },
  ];

  useEffect(() => {
    const handleResize = () => dispatch(setCurrentWidth(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch, windowWidth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
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

  const renderNavigationItems = () => (
    <div className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500`}
              ></div>
              <motion.div
                className={`relative px-6 py-3 rounded-xl flex items-center space-x-3 backdrop-blur-sm ${
                  isActive
                    ? "bg-gradient-to-r " + item.color + " text-white shadow-lg shadow-indigo-500/20"
                    : "bg-gray-800/40 text-gray-300 hover:text-white border border-gray-700"
                } transform perspective-1000`}
                whileHover={{
                  rotateX: 5,
                  rotateY: 5,
                  transition: { duration: 0.4 },
                }}
              >
                {item.icon}
                <span className="font-medium tracking-wide">{item.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 w-full backdrop-blur-xl z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-gray-900/95 shadow-2xl shadow-black/20" 
          : "bg-gray-900/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <h2 className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-indigo-500 select-none tracking-tight">
                Revana
              </h2>
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-500"
                whileHover={{ width: "100%" }}
              />
            </motion.div>
          </Link>

          {/* Navigation */}
          {isLoggedIn && renderNavigationItems()}

          {/* Auth Buttons */}
          {windowWidth > 500 ? (
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {isLoggedIn ? (
                <>
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button 
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-3 px-6 py-5 rounded-xl shadow-lg shadow-red-500/20"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </motion.div>
                </>
              ) : (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/signup">
                    <Button 
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 px-8 py-5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300"
                    >
                      Sign up
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                  <Button variant="ghost" size="icon" className="bg-gray-800/40 rounded-xl">
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] bg-gray-900/95 backdrop-blur-xl border-gray-800"
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex flex-col gap-6 mt-8">                    
                    {isLoggedIn ? (
                      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full flex items-center gap-3 justify-center py-6 rounded-xl shadow-lg shadow-red-500/20"
                        >
                          <LogOut size={18} />
                          Logout
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                        <Link to="/signup" className="block w-full">
                          <Button 
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 py-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300"
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