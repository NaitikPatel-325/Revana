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
      color: "from-violet-600 via-purple-600 to-indigo-600",
      hoverColor: "from-violet-500/90 via-purple-500/90 to-indigo-500/90",
      shadowColor: "shadow-indigo-500/40",
      glowColor: "group-hover:glow-indigo-500/30",
      gradientBorder: "group-hover:border-indigo-500/50"
    },
    {
      title: "Fashion",
      path: "/comments/fashion", 
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-fuchsia-600 via-pink-600 to-violet-600", 
      hoverColor: "from-fuchsia-500/90 via-pink-500/90 to-violet-500/90",
      shadowColor: "shadow-violet-500/40",
      glowColor: "group-hover:glow-violet-500/30",
      gradientBorder: "group-hover:border-violet-500/50"
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
        stiffness: 120,
        damping: 20,
        duration: 0.9
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 8 }
    },
    tap: { scale: 0.95 }
  };

  const renderNavigationItems = () => (
    <div className="hidden md:flex items-center space-x-12">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <motion.div
              className="relative group cursor-pointer perspective-1000"
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${item.hoverColor} rounded-xl blur-3xl opacity-0 group-hover:opacity-50 transition-all duration-700`}
              ></div>
              <motion.div
                className={`relative px-8 py-4 rounded-xl flex items-center space-x-4 backdrop-blur-3xl border ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg ${item.shadowColor} ${item.glowColor} border-transparent`
                    : `bg-gray-800/20 text-gray-300 hover:text-white border-gray-700/40 ${item.gradientBorder}`
                } transform transition-all duration-500 hover:shadow-2xl hover:backdrop-blur-xl`}
              >
                {item.icon}
                <span className="font-medium tracking-wider">{item.title}</span>
                {isActive && (
                  <motion.div
                    layoutId="active"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/25 via-white/15 to-transparent"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
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
      className={`fixed top-0 left-0 w-full backdrop-blur-3xl z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-gray-900/90 shadow-2xl shadow-black/30 border-b border-gray-800/40"
          : "bg-gray-900/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
            >
              <h2 className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-indigo-500 select-none tracking-tight filter drop-shadow-2xl">
                Revana
              </h2>
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-violet-400 via-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-700 rounded-full shadow-lg"
                whileHover={{ width: "100%" }}
              />
            </motion.div>
          </Link>

          {/* Navigation */}
          {isLoggedIn && renderNavigationItems()}

          {/* Auth Buttons */}
          {windowWidth > 500 ? (
            <motion.div
              className="flex items-center gap-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isLoggedIn ? (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="flex items-center gap-3 px-8 py-6 rounded-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-500 backdrop-blur-3xl text-base font-medium border border-red-500/30 hover:border-red-500/50"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Link to="/signup">
                    <Button
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 px-10 py-6 rounded-xl shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-500 backdrop-blur-3xl text-base font-medium border border-indigo-500/30 hover:border-indigo-500/50"
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
                  <Button variant="ghost" size="icon" className="bg-gray-800/20 rounded-xl hover:bg-gray-800/40 backdrop-blur-3xl border border-gray-700/40 hover:border-gray-600/40">
                    <Menu className="h-5 w-5" />
                  </Button>
                </motion.div>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-gray-900/90 backdrop-blur-3xl border-gray-800"
              >
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex flex-col gap-8 mt-10">
                    {isLoggedIn ? (
                      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                        <Button
                          onClick={handleLogout}
                          variant="destructive"
                          className="w-full flex items-center gap-3 justify-center py-7 rounded-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-500 backdrop-blur-3xl text-base font-medium border border-red-500/30 hover:border-red-500/50"
                        >
                          <LogOut size={18} />
                          Logout
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div whileHover="hover" whileTap="tap" variants={buttonVariants}>
                        <Link to="/signup" className="block w-full">
                          <Button
                            className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 py-7 rounded-xl shadow-xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all duration-500 backdrop-blur-3xl text-base font-medium border border-indigo-500/30 hover:border-indigo-500/50"
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