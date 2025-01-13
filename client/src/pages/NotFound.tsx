import { useEffect } from 'react';
import { DotLottie } from "@lottiefiles/dotlottie-web";

export default function NotFound() {
  useEffect(() => {
    var canvas = new HTMLCanvasElement,
    canvas = document.getElementById("dotLottie-canvas") as HTMLCanvasElement;
    const src = "https://lottie.host/294b684d-d6b4-4116-ab35-85ef566d4379/VkGHcqcMUI.lottie";

    const dotLottie = new DotLottie({
      canvas,
      src,
      loop: true,
      autoplay: true,
      speed: 1.6,
    });

    dotLottie.addEventListener("load", function loadHandler() {
      dotLottie.loadAnimation("monocle");
      dotLottie.removeEventListener("load", loadHandler);
    });

    return () => {
      dotLottie.destroy();
    };
  }, []);

  return (
    <div className="w-full h-[calc(100dvh-60px)] bg-gray-800 text-white flex flex-col justify-center items-center text-2xl font-bold">
      <canvas id="dotLottie-canvas" width="350" height="350"></canvas>
      <h1 className='font-bold text-4xl ' >Error 404: Page Not Found</h1>
    </div>
  );
}
