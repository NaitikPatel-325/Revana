import { motion } from "framer-motion";
import { useState } from "react";
import ItemDetail from "./ItemDetail";

export default function Fashion() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  return (
    <div className="mt-[60px]"> {/* Add margin-top to account for header */}
      {selectedItem ? (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full mx-auto px-8 py-12"
        >
          {/* Hero Section */}
          <motion.div
            className="mb-16 text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 text-transparent bg-clip-text">
              Discover Your Style
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Explore our curated collection of premium fashion items designed for your unique taste
            </p>
          </motion.div>

          {/* Featured Banner */}
          <motion.div 
            className="mb-16 bg-gradient-to-r from-purple-900/40 to-pink-900/40 rounded-2xl p-8 relative overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x600?fashion')] opacity-20 bg-cover bg-center" />
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Summer Collection 2025</h2>
                <p className="text-gray-300 mb-6">Up to 50% off on selected items</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-purple-900 rounded-full font-semibold hover:bg-purple-100 transition-colors"
                >
                  Shop Now
                </motion.button>
              </div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="hidden lg:block"
              >
                <span className="text-6xl font-bold text-white/10">SUMMER'25</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Sub-header Categories */}
          <motion.div 
            className="mb-12 bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-800"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {['All', 'Women', 'Men', 'Kids', 'Accessories', 'Sports', 'Sale'].map((category, index) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-gray-700 text-gray-200 whitespace-nowrap transition-all duration-300 text-lg shadow-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ perspective: "1000px" }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-12">
            {/* Sidebar Filters */}
            <motion.div
              className="w-80 shrink-0 bg-gray-900/50 backdrop-blur-lg rounded-xl p-8 h-fit sticky top-24 border border-gray-800"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <h3 className="text-2xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                Filters
              </h3>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-purple-500"
                  />
                  <motion.span 
                    className="absolute right-3 top-2.5 text-gray-400"
                    whileHover={{ scale: 1.1 }}
                  >
                    🔍
                  </motion.span>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="text-gray-300 font-medium mb-4 text-lg">Price Range</h4>
                <div className="space-y-3">
                  {['Under $25', '$25 to $50', '$50 to $100', 'Over $100'].map((range) => (
                    <motion.label 
                      key={range} 
                      className="flex items-center gap-3 text-gray-400 hover:text-gray-200 cursor-pointer text-lg group"
                      whileHover={{ x: 5 }}
                    >
                      <input type="checkbox" className="w-5 h-5 accent-purple-500" />
                      <span className="group-hover:text-purple-400 transition-colors">{range}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-8">
                <h4 className="text-gray-300 font-medium mb-4 text-lg">Brand</h4>
                <div className="space-y-3">
                  {['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'].map((brand) => (
                    <motion.label 
                      key={brand} 
                      className="flex items-center gap-3 text-gray-400 hover:text-gray-200 cursor-pointer text-lg group"
                      whileHover={{ x: 5 }}
                    >
                      <input type="checkbox" className="w-5 h-5 accent-purple-500" />
                      <span className="group-hover:text-purple-400 transition-colors">{brand}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-8">
                <h4 className="text-gray-300 font-medium mb-4 text-lg">Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.1, rotateX: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 rounded bg-gray-800/50 hover:bg-purple-500/20 text-gray-300 text-base transition-colors duration-300 shadow-lg hover:text-purple-300"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </motion.button>
            </motion.div>

            {/* Products Grid */}
            <motion.div 
              className="flex-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {[...Array(12)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="group bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -5,
                      rotateY: 5,
                      scale: 1.02,
                      boxShadow: "0 20px 30px rgba(0,0,0,0.2)"
                    }}
                    style={{ perspective: "1000px" }}
                    onClick={() => handleItemClick({
                      id: index + 1,
                      name: `Fashion Item ${index + 1}`,
                      description: "Premium quality fashion wear",
                      price: (19.99 + index * 10).toFixed(2),
                      image: `https://source.unsplash.com/random/400x400?fashion,clothing&${index}`
                    })}
                  >
                    <div className="aspect-square bg-gray-800/50 relative overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/400x400?fashion,clothing&${index}`}
                        alt={`Fashion Item ${index + 1}`}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-2 bg-white/90 rounded-lg text-gray-900 font-medium hover:bg-white transition-colors"
                          >
                            Quick View
                          </motion.button>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-gray-900 hover:bg-white"
                        >
                          ❤️
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-gray-200 font-medium mb-2 text-xl group-hover:text-purple-400 transition-colors">Fashion Item {index + 1}</h3>
                      <p className="text-gray-400 text-base mb-4">Premium quality fashion wear</p>
                      <div className="flex justify-between items-center">
                        <span className="text-purple-400 font-semibold text-lg">${(19.99 + index * 10).toFixed(2)}</span>
                        <motion.button 
                          className="px-6 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-base transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Load More Button */}
              <motion.div
                className="mt-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Load More Items
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
