import { useSearchParams } from "react-router-dom";
import VideoPlayer from "./videoplayer";
import Comments from "./videocomments";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SentimentCountType } from "./videocomments";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(ArcElement, Tooltip, Legend);

interface VideoPageProps {
  title: string;
}

export default function VideoPage({ title }: VideoPageProps) {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");

  const TotalSentimentCounts: SentimentCountType = useSelector(
    (state: RootState) => state.appSlice.TotalSentimentCount
  );

  if (!videoId) return <p className="text-center text-gray-400">No video selected.</p>;

  const { good = 0, neutral = 0, bad = 0 } = TotalSentimentCounts;
  const totalComments = good + neutral + bad;

  const positivePercentage = totalComments ? ((good / totalComments) * 100).toFixed(1) : 0;
  const neutralPercentage = totalComments ? ((neutral / totalComments) * 100).toFixed(1) : 0;
  const negativePercentage = totalComments ? ((bad / totalComments) * 100).toFixed(1) : 0;

  const pieData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        label: "Sentiment Analysis",
        data: [good, neutral, bad],
        backgroundColor: ["#22c55e", "#6366f1", "#ef4444"],
        borderColor: ["#16a34a", "#4f46e5", "#b91c1c"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VideoPlayer videoId={videoId} title={title} />
        <Comments videoId={videoId} />
      </motion.div>

      <motion.div 
        className="lg:w-1/3 bg-gray-900/50 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-800"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
          Sentiment Analysis
        </h2>

        <div className="space-y-6">
          {/* Positive Sentiment */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-green-400">Positive</span>
              <span className="text-gray-300">{positivePercentage}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${positivePercentage}%` }}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </div>
          </motion.div>

          {/* Neutral Sentiment */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-indigo-400">Neutral</span>
              <span className="text-gray-300">{neutralPercentage}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${neutralPercentage}%` }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Negative Sentiment */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-red-400">Negative</span>
              <span className="text-gray-300">{negativePercentage}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${negativePercentage}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h4 className="text-center text-gray-400 text-sm font-medium mb-4">Overall Distribution</h4>
          <div className="w-64 mx-auto">
            <Pie data={pieData} options={{
              plugins: {
                legend: {
                  labels: {
                    color: '#9ca3af'
                  }
                }
              }
            }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}