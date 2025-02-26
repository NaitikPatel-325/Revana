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
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(99, 102, 241, 0.8)", 
          "rgba(239, 68, 68, 0.8)"
        ],
        borderColor: [
          "rgba(22, 163, 74, 1)",
          "rgba(79, 70, 229, 1)",
          "rgba(185, 28, 28, 1)"
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(99, 102, 241, 1)",
          "rgba(239, 68, 68, 1)"
        ],
        hoverBorderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af',
          font: {
            size: 14,
            weight: 'bold' as const
          },
          padding: 20,
        },
        position: 'bottom' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          size: 16,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 14
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / totalComments) * 100).toFixed(1);
            return `${value} comments (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    responsive: true,
    maintainAspectRatio: false,
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
        <motion.h2 
          className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Sentiment Analysis
        </motion.h2>

        <div className="space-y-8">
          {/* Sentiment Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-green-500/20 p-4 rounded-lg border border-green-500/30">
              <h3 className="text-green-400 text-xl font-bold">{good}</h3>
              <p className="text-green-300/80 text-sm">Positive</p>
            </div>
            <div className="bg-indigo-500/20 p-4 rounded-lg border border-indigo-500/30">
              <h3 className="text-indigo-400 text-xl font-bold">{neutral}</h3>
              <p className="text-indigo-300/80 text-sm">Neutral</p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-lg border border-red-500/30">
              <h3 className="text-red-400 text-xl font-bold">{bad}</h3>
              <p className="text-red-300/80 text-sm">Negative</p>
            </div>
          </motion.div>

          <div className="space-y-6">
            {/* Sentiment Progress Bars */}
            {[
              { label: "Positive", color: "green", percentage: positivePercentage, delay: 0.5 },
              { label: "Neutral", color: "indigo", percentage: neutralPercentage, delay: 0.6 },
              { label: "Negative", color: "red", percentage: negativePercentage, delay: 0.7 }
            ].map((item) => (
              <motion.div 
                key={item.label}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay }}
              >
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className={`text-${item.color}-400 flex items-center gap-2`}>
                    <span className={`w-2 h-2 rounded-full bg-${item.color}-400`}></span>
                    {item.label}
                  </span>
                  <span className="text-gray-300">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-${item.color}-500 rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 1, delay: item.delay, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-12 h-[300px]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <h4 className="text-center text-gray-400 text-sm font-medium mb-6">
              Overall Distribution
            </h4>
            <Pie data={pieData} options={pieOptions} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}