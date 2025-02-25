import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Video, ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";

export default function CommentHeader() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      title: "Videos",
      path: "/comments/videos",
      icon: <Video className="w-5 h-5" />,
      color: "from-purple-600 to-blue-600",
    },
    {
      title: "Fashion",
      path: "/comments/fashion",
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-pink-600 to-purple-600",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <h1 className="relative text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Comment Sections
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
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
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300`}
                    ></div>
                    <motion.div
                      className={`relative px-6 py-3 rounded-lg flex items-center space-x-2 ${
                        isActive
                          ? "bg-gradient-to-r " + item.color + " text-white"
                          : "bg-gray-800 text-gray-300 hover:text-white"
                      } transform perspective-1000`}
                      whileHover={{
                        rotateX: 5,
                        rotateY: 5,
                        transition: { duration: 0.3 },
                      }}
                    >
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                      {isActive && (
                        <motion.div
                          layoutId="active"
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent"
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

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 space-y-2"
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center space-x-2 p-3 rounded-lg ${
                        isActive
                          ? "bg-gradient-to-r " + item.color + " text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3D Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                delay: i * 5,
                ease: "linear",
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>
      </div>
    </motion.nav>
  );
}