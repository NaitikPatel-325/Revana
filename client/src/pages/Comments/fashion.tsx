import { motion } from "framer-motion";

export default function fashion() {
  return (
    <>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full mx-auto px-8 py-12"
    >
      {/* Sub-header Categories */}
      <motion.div 
        className="mb-12 bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
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

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-gray-300 font-medium mb-4 text-lg">Price Range</h4>
            <div className="space-y-3">
              {['Under $25', '$25 to $50', '$50 to $100', 'Over $100'].map((range) => (
                <label key={range} className="flex items-center gap-3 text-gray-400 hover:text-gray-200 cursor-pointer text-lg">
                  <input type="checkbox" className="w-5 h-5 accent-purple-500" />
                  {range}
                </label>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div className="mb-8">
            <h4 className="text-gray-300 font-medium mb-4 text-lg">Brand</h4>
            <div className="space-y-3">
              {['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour'].map((brand) => (
                <label key={brand} className="flex items-center gap-3 text-gray-400 hover:text-gray-200 cursor-pointer text-lg">
                  <input type="checkbox" className="w-5 h-5 accent-purple-500" />
                  {brand}
                </label>
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
                  className="px-4 py-3 rounded bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 text-base transition-colors duration-300 shadow-lg"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>
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
                className="bg-gray-900/50 backdrop-blur-lg rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
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
              >
                <div className="aspect-square bg-gray-800/50 relative overflow-hidden">
                  <img 
                    src={`https://source.unsplash.com/random/400x400?fashion,clothing&${index}`}
                    alt={`Fashion Item ${index + 1}`}
                    className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-200 font-medium mb-3 text-xl">Fashion Item {index + 1}</h3>
                  <p className="text-gray-400 text-base mb-4">Premium quality fashion wear</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-semibold text-lg">${(19.99 + index).toFixed(2)}</span>
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
        </motion.div>
      </div>
    </motion.div>
    </>
  )
}
