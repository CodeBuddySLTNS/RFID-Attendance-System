import { Megaphone } from "lucide-react";
import Marquee from "react-fast-marquee";

export const Homepage = () => {
  return (
    <div className="w-full h-full grid grid-rows-[max-content_1fr_max-content]">
      <div className="w-full p-2 px-3 text-white bg-primary shadow">
        <div className="flex gap-2">
          <div className="flex justify-center items-center">
            <div className="w-11 aspect-square rounded-full bg-amber-200"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-snug">
              Philippine Advent College Inc. - Salug Campus
            </h1>
            <h3 className="leading-tight text-muted">
              Poblacion East, Salug, Zamboanga del Norte
            </h3>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-[500px_1fr] bg-gray-800">
        <div className="flex justify-center items-center">
          <div className="w-[90%] h-[90%] bg-gray-900 rounded-xl shadow-2xl"></div>
        </div>
        <div></div>
      </div>
      <div className="flex gap-2 p-2 font-bold text-white bg-red-600">
        <Megaphone className="transform -rotate-12" />
        <Marquee>Welcome to School!</Marquee>
      </div>
    </div>
  );
};
