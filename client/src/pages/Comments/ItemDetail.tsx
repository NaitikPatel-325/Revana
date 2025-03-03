import { motion } from "framer-motion";
import { useState } from "react";

export default function ItemDetail({ item, onClose }: { item: any, onClose: () => void }) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [reviews, setReviews] = useState<Array<{rating: number, text: string}>>([]);
  const [sentiment, setSentiment] = useState<string>('neutral');

  const handleSubmitReview = () => {
    if (rating && review) {
      const newReview = {
        rating,
        text: review,
        isNew: true,
        timestamp: new Date().toISOString(),
        helpful: 0,
        sentiment: ''
      };

      setSentiment('analyzing');
      
      setTimeout(() => {
        const sentiments = ['positive', 'neutral', 'negative'];
        const analyzedSentiment = sentiments[Math.floor(Math.random() * 3)];
        
        setSentiment(analyzedSentiment);
        newReview.sentiment = analyzedSentiment;
        
        setReviews(prev => [{...newReview}, ...prev]);

        const successFeedback = document.getElementById('review-success');
        if (successFeedback) {
          successFeedback.classList.remove('opacity-0');
          setTimeout(() => {
            successFeedback.classList.add('opacity-0');
          }, 2000);
        }

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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-900 to-slate-900 py-16 px-6 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-16">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-7xl font-extrabold bg-gradient-to-r from-white via-indigo-300 to-violet-200 bg-clip-text text-transparent drop-shadow-2xl"
          >
            Product Details
          </motion.h1>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(99, 102, 241, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-10 py-5 rounded-3xl bg-slate-800/40 backdrop-blur-xl text-white font-semibold flex items-center gap-4 shadow-2xl border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300"
          >
            <span className="text-2xl">←</span> Back to Products
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 space-y-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-800/30 shadow-2xl group relative"
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/30 backdrop-blur-2xl rounded-[2rem] p-14 shadow-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500"
            >
              <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">{item.name}</h2>
              <p className="text-slate-300 text-2xl mb-12 leading-relaxed">{item.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xl mb-3">Price</p>
                  <p className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">${item.price}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-14 py-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white font-bold text-2xl shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center gap-4"
                >
                  <span>Add to Cart</span>
                  <span className="text-3xl">+</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/30 backdrop-blur-2xl rounded-[2rem] p-12 shadow-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500"
            >
              <h3 className="text-4xl font-bold text-white mb-10 flex items-center gap-4">
                <span>Reviews & Ratings</span>
                <span className="text-yellow-400 animate-pulse">★</span>
              </h3>
              
              <div className="mb-12">
                <div className="flex gap-6 mb-8 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.4, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setRating(star)}
                      className={`text-6xl transition-all duration-300 ${rating >= star ? 'text-yellow-400 drop-shadow-xl' : 'text-slate-600 hover:text-slate-500'}`}
                    >
                      ★
                    </motion.button>
                  ))}
                </div>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  className="w-full bg-slate-700/20 rounded-2xl p-8 text-white placeholder-slate-400 mb-8 text-xl border border-indigo-500/20 focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 resize-none"
                  rows={4}
                />
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitReview}
                  className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white text-2xl font-semibold shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">Submit Review</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </motion.button>
              </div>

              <div className="space-y-8 max-h-[500px] overflow-y-auto custom-scrollbar pr-6">
                {reviews.map((review, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className="bg-slate-700/20 backdrop-blur-xl rounded-2xl p-10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group"
                  >
                    <div className="flex gap-2 text-yellow-400 mb-6 text-3xl group-hover:scale-110 transform transition-transform duration-300 origin-left">
                      {Array(review.rating).fill('★')}
                    </div>
                    <p className="text-slate-300 text-xl leading-relaxed">{review.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/30 backdrop-blur-2xl rounded-[2rem] p-12 shadow-2xl border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-500"
            >
              <h3 className="text-4xl font-bold text-white mb-10">Sentiment Analysis</h3>
              <div className="space-y-10">
                <motion.div 
                  className="bg-slate-700/20 rounded-2xl p-10 border border-indigo-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-3xl font-semibold text-white mb-6">Overall Sentiment</h4>
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`text-4xl font-semibold ${
                      sentiment === 'positive' ? 'text-green-400' :
                      sentiment === 'negative' ? 'text-red-400' :
                      'text-yellow-400'
                    } flex items-center gap-4`}
                  >
                    {sentiment === 'positive' && '😊'}
                    {sentiment === 'negative' && '😔'}
                    {sentiment === 'neutral' && '😐'}
                    {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  className="bg-slate-700/20 rounded-2xl p-10 border border-indigo-500/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="text-3xl font-semibold text-white mb-8">Key Metrics</h4>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="text-center">
                      <div className="text-slate-400 mb-4 text-xl">Average Rating</div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                        {reviews.length ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) : 'N/A'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400 mb-4 text-xl">Total Reviews</div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
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
