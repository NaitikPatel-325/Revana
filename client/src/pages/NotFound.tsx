import { useEffect } from 'react';
import { DotLottie } from "@lottiefiles/dotlottie-web";

export default function NotFound() {
  useEffect(() => {
    const canvas = document.getElementById("dotLottie-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const dotLottie = new DotLottie({
      canvas,
      src: "https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie",
      loop: true,
      autoplay: true,
      speed: 1.6,
    });

    dotLottie.addEventListener("load", () => dotLottie.loadAnimation("monocle"));
    return () => dotLottie.destroy();
  }, []);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="relative bg-gray-800/90 backdrop-blur-2xl text-white w-[95%] max-w-3xl border border-gray-600/50 rounded-2xl shadow-2xl p-12">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600"></div>
        
        <div className="relative flex flex-col items-center">
          <canvas id="dotLottie-canvas" width="300" height="300" className="mb-8"></canvas>
          
          <h1 className="font-black text-6xl mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              404
            </span>
          </h1>
          
          <h2 className="font-bold text-2xl mb-6 text-gray-300">Page Not Found</h2>
          
          <p className="text-gray-400 text-lg mb-8 text-center">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-purple-600 rounded-lg font-medium hover:bg-purple-700"
            >
              Home
            </button>
            
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-pink-600 rounded-lg font-medium hover:bg-pink-700"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
