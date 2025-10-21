import { Separator } from "@/components/ui/separator";
import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

interface TimeData {
  hours: string;
  minutes: string;
  seconds: string;
  amPm: string;
}

const getDate = (): {
  day: string;
  date: number;
  month: string;
  year: number;
} => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  return {
    day: days[currentDate.getDay()],
    date: currentDate.getDate(),
    month: months[currentDate.getMonth()],
    year: currentDate.getFullYear(),
  };
};

export const Homepage = () => {
  const [time, setTime] = useState<TimeData>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    amPm: "AM",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const timeData = {
        hours: (currentTime.getHours() % 12 || 12).toString().padStart(2, "0"),
        minutes: currentTime.getMinutes().toString().padStart(2, "0"),
        seconds: currentTime.getSeconds().toString().padStart(2, "0"),
        amPm: currentTime.getHours() >= 12 ? "PM" : "AM",
      };

      setTime(timeData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      <div className="w-full p-3 grid grid-cols-[450px_1fr] gap-3">
        <div className="flex justify-center items-center">
          <div className="w-full h-full grid grid-rows-[40px_1fr_40px] gap-2">
            <div className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-primary">
              Welcome
            </div>

            <div className="w-full grid grid-rows-[1fr_max-content] gap-1">
              <div className="rounded bg-gray-100"></div>
              <div className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-gray-600">
                <div>-----</div>
                <Separator />
                <div>-----</div>
              </div>
            </div>

            <div className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-gray-600"></div>
          </div>
        </div>

        <div className="w-full grid grid-rows-[2fr_1fr] gap-2">
          <div className="w-full grid grid-cols-3 gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-full grid grid-rows-[40px_1fr] gap-2"
              >
                <div className="w-full p-1 text-center text-white rounded bg-primary">
                  <div></div>
                </div>

                <div className="w-full grid grid-rows-[1fr_max-content] gap-1">
                  <div className="rounded bg-gray-100"></div>
                  <div className="w-full p-1 text-center font-extrabold text-white rounded bg-gray-600">
                    <h2>NO DATA</h2>
                    <Separator />
                    <p>-----</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <div className="w-full grid grid-rows-[max-content_1fr] text-center">
              <div className="bg-green-700 p-1 rounded text-white font-extrabold">
                TAP YOUR RFID CARD
              </div>

              <input
                className="w-full text-center font-extrabold text-3xl outline-0"
                type="text"
              />
            </div>

            <div className="w-full text-center grid grid-rows-[max-content_1fr_max-content] gap-2">
              <div className="bg-primary p-1 rounded text-white font-extrabold">
                {getDate().day.toUpperCase()}
              </div>

              <div className="bg-gray-100 rounded flex justify-center items-center text-4xl font-extrabold">
                <p>{`${time.hours}:${time.minutes}:${time.seconds} ${time.amPm}`}</p>
              </div>

              <div className="bg-primary p-1 rounded text-white font-extrabold">
                {getDate().month} {getDate().date}, {getDate().year}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-2 font-extrabold text-white bg-red-600">
        <Megaphone className="transform -rotate-12" />
        <Marquee>Welcome to School!</Marquee>
      </div>
    </div>
  );
};
