import { useSearchParams } from "react-router-dom";
import VideoPlayer from "./videoplayer";
import Comments from "./videocomments";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { SentimentCountType } from "./videocomments";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface VideoPageProps {
  title: string;
}

export default function VideoPage({ title }: VideoPageProps) {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("videoId");
  const [isLoading, setIsLoading] = useState(true);
    
  const TotalSentimentCounts: SentimentCountType = useSelector(
    (state: RootState) => state.appSlice.TotalSentimentCount
  );

  const videoDescription: { Pd: string; Nd: string } = useSelector(
    (state: RootState) => state.appSlice.videodata.descriptions
  );

  useEffect(() => {
    // Simulate loading time or wait for data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [videoId]);

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

  // Define proper type for chart.js tooltip context
  interface TooltipItem {
    raw: unknown;
    parsed: number;
    formattedValue: string;
    dataset: Record<string, unknown>;
    datasetIndex: number;
    dataIndex: number;
  }

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
          label: function(tooltipItem: TooltipItem) {
            const value = Number(tooltipItem.raw);
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
      easing: 'easeInOutQuart' as const
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Skeleton loader components
  const VideoPlayerSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 w-3/4 bg-gray-700 rounded mb-6"></div>
      <div className="aspect-video bg-gray-800 rounded-xl"></div>
    </div>
  );

  const SentimentStatsSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-8 w-1/2 bg-gray-700 rounded mx-auto mb-8"></div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg">
            <div className="h-6 w-12 bg-gray-700 rounded mx-auto mb-2"></div>
            <div className="h-4 w-16 bg-gray-700 rounded mx-auto"></div>
          </div>
        ))}
      </div>
      <div className="space-y-6 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-700 rounded"></div>
              <div className="h-4 w-16 bg-gray-700 rounded"></div>
            </div>
            <div className="h-4 bg-gray-800 rounded-full"></div>
          </div>
        ))}
      </div>
      <div className="mt-12 h-[300px] flex items-center justify-center">
        <div className="h-40 w-40 bg-gray-800 rounded-full"></div>
      </div>
      <div className="mt-16 space-y-6">
        <div className="h-8 w-3/4 bg-gray-700 rounded mx-auto mb-10"></div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="h-6 w-1/3 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="h-6 w-1/3 bg-gray-700 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          <VideoPlayerSkeleton />
        ) : (
          <>
            <VideoPlayer videoId={videoId} title={title} />
            <Comments videoId={videoId} />
          </>
        )}
      </motion.div>

      <motion.div 
        className="lg:w-1/3 bg-gray-900/50 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-gray-800"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <SentimentStatsSkeleton />
        ) : (
          <>
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
        {[
          { 
            label: "Positive", 
            color: "bg-emerald-500", 
            textColor: "text-emerald-500", 
            percentage: positivePercentage, 
            value: good, 
            delay: 0.5 
          },
          { 
            label: "Neutral", 
            color: "bg-sky-500", 
            textColor: "text-sky-500", 
            percentage: neutralPercentage, 
            value: neutral, 
            delay: 0.6 
          },
          { 
            label: "Negative", 
            color: "bg-rose-500", 
            textColor: "text-rose-500", 
            percentage: negativePercentage, 
            value: bad, 
            delay: 0.7 
          }
        ].map((item) => (
          <motion.div 
            key={item.label}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay }}
          >
            <div className="flex justify-between items-center text-sm">
              <div className={`flex items-center gap-2 ${item.textColor}`}>
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="text-gray-300">
                <span className="font-semibold">{item.percentage}%</span>
                <span className="text-xs ml-1 text-gray-400">({item.value})</span>
              </div>
            </div>
            <div className="h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${item.color} bg-opacity-80`}
                style={{ width: `${Math.max(Number(item.percentage), 1)}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(Number(item.percentage), 1)}%` }}
                transition={{ 
                  duration: 1.2, 
                  delay: item.delay, 
                  ease: "easeOut" 
                }}
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
                <h4 className="text-center text-gray-400 text-sm font-medium mb-1">
                  Overall Distribution
                </h4>
                <Pie data={pieData} options={pieOptions} />
              </motion.div>

              {/* Positive and Negative Descriptions*/}
              <motion.div 
                className="mt-16 space-y-6" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1 }}
              >
                <h3 className="text-2xl font-bold text-gray-100 text-center mb-10 relative">
                  <span className="relative z-10">Sentiment Analysis Summary</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg opacity-30 rounded-lg"></span>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                </h3>
                
                <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
                  <h4 className="text-green-400 text-lg font-semibold mb-3">Positive Description</h4>
                  <p className="text-green-300 text-sm leading-relaxed">{videoDescription.Pd}</p>
                </div>
                
                <div className="bg-red-500/10 p-6 rounded-lg border border-red-500/20">
                  <h4 className="text-red-400 text-lg font-semibold mb-3">Negative Description</h4>
                  <p className="text-red-300 text-sm leading-relaxed">{videoDescription.Nd}</p>
                </div>
              </motion.div> 
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}