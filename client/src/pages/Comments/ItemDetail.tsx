import { motion } from "framer-motion";
import { useState } from "react";

export default function ItemDetail({ item, onClose }: { item: any, onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [reviews, setReviews] = useState<Array<{rating: number, text: string}>>([]);
  const [sentiment, setSentiment] = useState<string>('neutral');

  const handleSubmitReview = () => {
    if (rating && review) {
      // Add new review with animation flag
      const newReview = {
        rating,
        text: review,
        isNew: true, // Flag for animation
        timestamp: new Date().toISOString(),
        helpful: 0,
        sentiment: '' // Will be set after "analysis"
      };

      // Simulate sentiment analysis with loading state
      setSentiment('analyzing');
      
      setTimeout(() => {
        const sentiments = ['positive', 'neutral', 'negative'];
        const analyzedSentiment = sentiments[Math.floor(Math.random() * 3)];
        
        setSentiment(analyzedSentiment);
        newReview.sentiment = analyzedSentiment;
        
        // Add review with animation
        setReviews(prev => [{...newReview}, ...prev]);

        // Show success feedback
        const successFeedback = document.getElementById('review-success');
        if (successFeedback) {
          successFeedback.classList.remove('opacity-0');
          setTimeout(() => {
            successFeedback.classList.add('opacity-0');
          }, 2000);
        }

        // Reset form
        setRating(0);
        setReview('');
      }, 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900 to-gray-900 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-12">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-6xl font-bold bg-gradient-to-r from-white via-purple-300 to-pink-200 bg-clip-text text-transparent drop-shadow-lg"
          >
            Product Details
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-8 py-4 rounded-2xl bg-gray-800/40 backdrop-blur-lg text-white font-medium flex items-center gap-3 shadow-lg border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
          >
            <span className="text-xl">←</span> Back to Products
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left side - Image and Details */}
          <div className="lg:col-span-3 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-800/30 shadow-2xl group relative"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">{item.name}</h2>
              <p className="text-gray-300 text-xl mb-10 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-lg mb-2">Price</p>
                  <p className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">${item.price}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white font-semibold text-xl shadow-xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-3"
                >
                  <span>Add to Cart</span>
                  <span className="text-2xl">+</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Right side - Reviews and Analysis */}
          <div className="lg:col-span-2 space-y-8">
            {/* Reviews Section */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold text-white mb-8 flex items-center gap-3">
                <span>Reviews & Ratings</span>
                <span className="text-yellow-400 animate-pulse">★</span>
              </h3>
              
              <div className="mb-10">
                <div className="flex gap-4 mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.3, rotate: 12 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className={`text-5xl transition-all duration-300 ${rating >= star ? 'text-yellow-400 drop-shadow-lg' : 'text-gray-600 hover:text-gray-500'}`}
                    >
                      ★
                    </motion.button>
                  ))}
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-gray-700/20 rounded-2xl p-6 text-white placeholder-gray-400 mb-6 text-lg border border-purple-500/20 focus:border-purple-500/60 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                  rows={4}
                />
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReview}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-xl font-medium shadow-xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Submit Review</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                </motion.button>
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {reviews.map((review, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="bg-gray-700/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group"
                  >
                    <div className="flex gap-1 text-yellow-400 mb-4 text-2xl group-hover:scale-110 transform transition-transform duration-300 origin-left">
                      {Array(review.rating).fill('★')}
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sentiment Analysis Section */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
            >
              <h3 className="text-3xl font-semibold text-white mb-8">Sentiment Analysis</h3>
              <div className="space-y-8">
                <motion.div 
                  className="bg-gray-700/20 rounded-2xl p-8 border border-purple-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-2xl font-medium text-white mb-4">Overall Sentiment</h4>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`text-3xl font-medium ${
                      sentiment === 'positive' ? 'text-green-400' :
                      sentiment === 'negative' ? 'text-red-400' :
                      'text-yellow-400'
                    } flex items-center gap-3`}
                  >
                    {sentiment === 'positive' && '😊'}
                    {sentiment === 'negative' && '😔'}
                    {sentiment === 'neutral' && '😐'}
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-700/20 rounded-2xl p-8 border border-purple-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-2xl font-medium text-white mb-6">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-gray-400 mb-3 text-lg">Average Rating</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {reviews.length ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 mb-3 text-lg">Total Reviews</div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {reviews.length}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
