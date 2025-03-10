import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, ShoppingBag, TrendingUp, BarChart3 } from "lucide-react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface Review {
  asin: string;
  name: string;
  date: string;
  rating: string;
  review: string;
  sentiment?: number | null;
  sentimentText?: string | null;
}

interface Descriptions {
  Pd: string;
  Nd: string;
}

export default function Fashion() {
  const [asin, setAsin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<Descriptions | null>(null);
  const [showContent, setShowContent] = useState<boolean>(false);

  const isLoggedIn = useSelector((state: RootState) => state.appSlice.isLoggedIn);

  useEffect(() => {
    if (product.length > 0) {
      setShowContent(true);
    }
  }, [product]);

  const handleSearch = async () => {
    if (!asin.trim()) {
      setError("Please enter a valid ASIN");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowContent(false);

    try {
      const response = await axios.get(`http://localhost:4000/user/amazon/${asin}`);
      console.log("Response:", typeof response.data);
      
      const reviewData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.reviews || []);
      
      setProduct(reviewData);
      
      if (response.data.descriptions) {
        setDescriptions(response.data.descriptions);
      }
    } catch (err) {
      setError("Failed to fetch product data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sentimentCounts = {
    positive: product.filter(review => review.sentiment === 2 || review.sentiment === 1).length,
    neutral: product.filter(review => review.sentiment === 1).length,
    negative: product.filter(review => review.sentiment === 0).length
  };

  const totalReviews = product.length;
  const positivePercentage = totalReviews > 0 ? (sentimentCounts.positive / totalReviews) * 100 : 0;
  const neutralPercentage = totalReviews > 0 ? (sentimentCounts.neutral / totalReviews) * 100 : 0;
  const negativePercentage = totalReviews > 0 ? (sentimentCounts.negative / totalReviews) * 100 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 px-4 py-12 mt-[60px]"
    >
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-center gap-3 mb-12"
          variants={itemVariants}
        >
          <ShoppingBag className="w-12 h-12 text-blue-400 filter drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
          <h1 className="text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-500 to-blue-600 filter drop-shadow-[0_0_2px_rgba(96,165,250,0.3)]">
            Fashion Product Reviews
          </h1>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="flex gap-4 backdrop-blur-lg p-3 rounded-2xl bg-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10">
            <motion.div
              className="relative flex-1"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <input
                type="text"
                className="w-full px-6 py-4 rounded-xl bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-lg"
                placeholder="Enter Amazon ASIN..."
                value={asin}
                onChange={(e) => setAsin(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-400/70" size={20} />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                "Search"
              )}
            </motion.button>
          </div>
          
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm"
              >
                <p className="text-red-400 text-center font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showContent && product.length > 0 && (
            <>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="h-0.5 bg-gradient-to-r from-blue-400/20 via-teal-500/20 to-blue-600/20 rounded-full mb-12 max-w-5xl mx-auto"
              />

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800/40 backdrop-blur-md rounded-3xl p-8 border border-gray-700/50 shadow-2xl mb-10 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-3xl font-bold text-white mb-2 md:mb-0 leading-tight"
                  >
                    {product[0].name}
                  </motion.h2>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="px-4 py-2 bg-blue-500/10 rounded-lg text-blue-400 font-mono border border-blue-500/20 hover:bg-blue-500/20 transition-colors duration-300"
                  >
                    ASIN: {product[0].asin}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-5 h-5 text-blue-300" />
                      <h3 className="text-xl font-semibold text-blue-300">Reviews</h3>
                    </div>
                    <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}>
                      {product.map((review, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * Math.min(index, 5), duration: 0.5 }}
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                            borderColor: "rgba(59, 130, 246, 0.5)"
                          }}
                          className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/20 transition-all duration-300 hover:bg-gray-800/40"
                        >
                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                                >
                                  <Star
                                    size={16}
                                    className={`${
                                      i < parseInt(review.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                                    }`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <span className="text-sm text-gray-400 font-medium">{review.rating}/5</span>
                            <span className="text-xs text-gray-500 ml-3 border-l border-gray-700/50 pl-3">{review.date}</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{review.review}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-gray-900/30 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 shadow-lg"
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-blue-300" />
                      <h3 className="text-xl font-semibold text-blue-300">Sentiment Analysis</h3>
                    </div>
                    <div className="flex flex-col justify-between" style={{ minHeight: '400px' }}>
                      {product.length > 0 ? (
                        <div className="w-full space-y-6">
                          <div className="space-y-3">
                            <div className="flex justify-between mb-2">
                              <span className="text-green-400 font-medium">Positive</span>
                              <span className="text-white font-medium">{sentimentCounts.positive} reviews</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${positivePercentage}%` }}
                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full shadow-lg shadow-green-500/20" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between mb-2">
                              <span className="text-blue-400 font-medium">Neutral</span>
                              <span className="text-white font-medium">{sentimentCounts.neutral} reviews</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${neutralPercentage}%` }}
                                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                                className="bg-gradient-to-r from-blue-500 to-blue-400 h-3 rounded-full shadow-lg shadow-blue-500/20" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between mb-2">
                              <span className="text-red-400 font-medium">Negative</span>
                              <span className="text-white font-medium">{sentimentCounts.negative} reviews</span>
                            </div>
                            <div className="w-full bg-gray-800/50 rounded-full h-3">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${negativePercentage}%` }}
                                transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                                className="bg-gradient-to-r from-red-500 to-red-400 h-3 rounded-full shadow-lg shadow-red-500/20" 
                              />
                            </div>
                          </div>
                          
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                            className="mt-6 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-blue-500/20 transition-all duration-300 hover:bg-gray-800/40 shadow-md"
                          >
                            <h4 className="text-blue-300 mb-4 font-medium text-lg">Analysis Summary</h4>
                            {descriptions ? (
                              <div className="space-y-4">
                                <motion.div 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.2, duration: 0.5 }}
                                  className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 hover:bg-green-500/15 transition-colors duration-300"
                                >
                                  <h5 className="text-green-400 text-sm font-medium mb-2">Positive Aspects</h5>
                                  <p className="text-gray-300 text-sm leading-relaxed">{descriptions.Pd}</p>
                                </motion.div>
                                {descriptions.Nd && (
                                  <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.3, duration: 0.5 }}
                                    className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 hover:bg-red-500/15 transition-colors duration-300"
                                  >
                                    <h5 className="text-red-400 text-sm font-medium mb-2">Areas for Improvement</h5>
                                    <p className="text-gray-300 text-sm leading-relaxed">{descriptions.Nd}</p>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                                className="text-gray-300 text-sm leading-relaxed"
                              >
                                Based on {totalReviews} reviews, this product has received 
                                {positivePercentage > 50 ? " mostly positive" : 
                                 negativePercentage > 50 ? " mostly negative" : " mixed"} feedback.
                              </motion.p>
                            )}
                          </motion.div>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center">
                          Search for a product to see sentiment analysis.
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
