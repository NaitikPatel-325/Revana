import { motion } from "framer-motion";
import { useState } from "react";
import ItemDetail from "./ItemDetail";

export default function Fashion() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
  };

  return (
    <div className="mt-[60px] min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {selectedItem ? (
        <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-12"
        >
          {/* Hero Section */}
          <motion.div
            className="mb-20 text-center"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-400 text-transparent bg-clip-text">
              Elevate Your Style
            </h1>
            <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our meticulously curated collection of premium fashion pieces, 
              designed to help you express your unique personality
            </p>
          </motion.div>

          {/* Featured Banner */}
          <motion.div 
            className="mb-20 bg-gradient-to-r from-violet-900/30 via-fuchsia-900/30 to-pink-900/30 rounded-3xl p-12 relative overflow-hidden backdrop-blur-xl border border-gray-800/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-[url('https://source.unsplash.com/random/1920x600?luxury,fashion')] opacity-20 bg-cover bg-center mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
            <div className="relative z-10 flex justify-between items-center">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                  Luxury Collection <br/>
                  <span className="text-fuchsia-400">Summer 2025</span>
                </h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Experience unparalleled elegance with up to 50% off on our premium selection. 
                  Limited time offer on designer pieces.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(217, 70, 239, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-semibold text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg shadow-fuchsia-900/30"
                >
                  Explore Collection
                </motion.button>
              </div>
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="hidden xl:block"
              >
                <span className="text-8xl font-bold bg-gradient-to-r from-white/10 to-transparent bg-clip-text text-transparent">
                  2025
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Sub-header Categories */}
          <motion.div 
            className="mb-16 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800/50"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-center gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-fuchsia-900 scrollbar-track-transparent">
              {['All', 'Women', 'Men', 'Kids', 'Accessories', 'Luxury', 'Sale'].map((category, index) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 hover:from-violet-500/20 hover:to-fuchsia-500/20 border border-gray-700 text-gray-200 whitespace-nowrap transition-all duration-300 text-lg shadow-lg hover:border-fuchsia-500/50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="flex gap-12">
            {/* Sidebar Filters */}
            <motion.div
              className="w-80 shrink-0 bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 h-fit sticky top-24 border border-gray-800/50 shadow-xl"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <h3 className="text-2xl font-semibold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">
                Refine Selection
              </h3>

              {/* Search Bar */}
              <div className="mb-10">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search collection..."
                    className="w-full bg-gray-800/30 border border-gray-700 rounded-xl px-5 py-3 text-gray-300 focus:outline-none focus:border-fuchsia-500 transition-colors duration-300"
                  />
                  <motion.span 
                    className="absolute right-4 top-3.5 text-gray-400"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    🔍
                  </motion.span>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-10">
                <h4 className="text-gray-200 font-medium mb-5 text-lg">Price Range</h4>
                <div className="space-y-4">
                  {['Under $50', '$50 - $100', '$100 - $200', 'Over $200'].map((range) => (
                    <motion.label 
                      key={range} 
                      className="flex items-center gap-4 text-gray-400 hover:text-gray-200 cursor-pointer text-lg group"
                      whileHover={{ x: 5 }}
                    >
                      <input type="checkbox" className="w-5 h-5 accent-fuchsia-500 rounded" />
                      <span className="group-hover:text-fuchsia-400 transition-colors">{range}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-10">
                <h4 className="text-gray-200 font-medium mb-5 text-lg">Designer Brands</h4>
                <div className="space-y-4">
                  {['Gucci', 'Prada', 'Louis Vuitton', 'Hermès', 'Chanel'].map((brand) => (
                    <motion.label 
                      key={brand} 
                      className="flex items-center gap-4 text-gray-400 hover:text-gray-200 cursor-pointer text-lg group"
                      whileHover={{ x: 5 }}
                    >
                      <input type="checkbox" className="w-5 h-5 accent-fuchsia-500 rounded" />
                      <span className="group-hover:text-fuchsia-400 transition-colors">{brand}</span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-10">
                <h4 className="text-gray-200 font-medium mb-5 text-lg">Size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 rounded-xl bg-gray-800/30 hover:bg-fuchsia-500/20 text-gray-300 text-base transition-all duration-300 shadow-lg hover:text-fuchsia-300 border border-gray-700 hover:border-fuchsia-500/50"
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(217, 70, 239, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl text-white font-semibold text-lg shadow-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300"
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
                    className="group bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-gray-800/50 hover:border-fuchsia-500/50 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      y: -5,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(217, 70, 239, 0.2)"
                    }}
                    onClick={() => handleItemClick({
                      id: index + 1,
                      name: `Luxury Item ${index + 1}`,
                      description: "Premium designer fashion piece",
                      price: (99.99 + index * 50).toFixed(2),
                      image: `https://source.unsplash.com/random/800x800?luxury,fashion&${index}`
                    })}
                  >
                    <div className="aspect-square bg-gray-800/30 relative overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/800x800?luxury,fashion&${index}`}
                        alt={`Luxury Item ${index + 1}`}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                        <div className="p-6 w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full py-3 bg-white/95 rounded-xl text-gray-900 font-medium hover:bg-white transition-colors text-lg"
                          >
                            Quick View
                          </motion.button>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center text-gray-900 hover:bg-white shadow-lg"
                        >
                          ❤️
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-gray-200 font-medium mb-3 text-xl group-hover:text-fuchsia-400 transition-colors">
                        Luxury Item {index + 1}
                      </h3>
                      <p className="text-gray-400 text-base mb-5">Premium designer fashion piece</p>
                      <div className="flex justify-between items-center">
                        <span className="text-fuchsia-400 font-semibold text-xl">
                          ${(99.99 + index * 50).toFixed(2)}
                        </span>
                        <motion.button 
                          className="px-6 py-3 rounded-xl bg-fuchsia-500/20 hover:bg-fuchsia-500/30 text-fuchsia-300 text-base transition-colors duration-300"
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
                className="mt-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(217, 70, 239, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full text-white font-semibold text-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 shadow-lg"
                >
                  Discover More
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
