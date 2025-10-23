import { Separator } from "@/components/ui/separator";
import { coleAPI } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Megaphone } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Marquee from "react-fast-marquee";
import { toast } from "sonner";
import config from "../../system.config.json";
import type { Attendance } from "@/types/data.types";

const url = config.isProduction
  ? config.prodServer + "/api"
  : config.devServer + "/api";

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
  const queryClient = useQueryClient();
  const rfidRef = useRef<HTMLInputElement>(null);
  const [delay, setDelay] = useState(0);

  const [time, setTime] = useState<TimeData>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    amPm: "AM",
  });

  const { data: attendances } = useQuery<Attendance[]>({
    queryKey: ["attendances"],
    queryFn: coleAPI(
      "/attendances?date=" + new Date().toISOString().slice(0, 10)
    ),
  });

  const { mutateAsync: addAttendance, data: student } = useMutation({
    mutationFn: coleAPI("/attendances/add", "POST"),
    onSuccess: (student) => {
      const textToSpeak = student
        ? student.type === "IN"
          ? `Welcome ${student.firstName} ${student.lastName}`
          : `Goodbye ${student.firstName} ${student.lastName}, see you again!`
        : "Student not found";
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      speechSynthesis.speak(utterance);
    },
  });

  let attendancesData: Attendance[] = [];

  if (attendances && attendances.length >= 3) {
    attendancesData = attendances;
  } else {
    attendancesData = [...(attendances || [])];
    const missingCount = 3 - attendancesData.length;
    for (let i = 0; i < missingCount; i++) {
      attendancesData.push({} as Attendance);
    }
  }

  const handleRFIDInput = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const rfidValue = (e.target as HTMLInputElement).value;
      setDelay(3);

      try {
        const now = new Date();
        const dateTime = now
          .toLocaleString("sv-SE", { timeZone: "Asia/Manila" })
          .replace("T", " ");
        const date = now.toISOString().slice(0, 10);

        const payload = {
          rfidTag: rfidValue,
          timestamp: dateTime,
          date,
        };

        await addAttendance(payload);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data?.error === "COOLDOWN_ACTIVE") {
            toast.warning(error.response.data.message);
            const utterance = new SpeechSynthesisUtterance(
              error.response.data.message
            );
            speechSynthesis.speak(utterance);
          } else if (error.response?.data?.status === 404) {
            toast.error("Student not found. Please register the student.");
          } else {
            toast.error("Unable to connect to the database.");
          }
        }
      }
    }
  };

  useEffect(() => {
    if (delay > 0) {
      const interval = setInterval(() => {
        rfidRef.current?.focus();
        setDelay((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      rfidRef.current!.value = "";
      rfidRef.current?.focus();
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
    }
  }, [delay, queryClient]);

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

  rfidRef.current?.focus();

  return (
    <div className="w-full h-full grid grid-rows-[1fr_max-content]">
      <div className="w-full p-3 grid grid-cols-[450px_1fr] gap-3">
        <div className="flex justify-center items-center">
          <div className="w-full h-full grid grid-rows-[40px_1fr_40px] gap-2">
            {delay > 0 && student ? (
              (student?.type === "IN" && (
                <p className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-green-600">
                  Welcome!
                </p>
              )) ||
              (student?.type === "OUT" && (
                <p className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-primary">
                  Goodbye, See you again!
                </p>
              ))
            ) : (
              <p className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-primary"></p>
            )}

            <div className="w-full grid grid-rows-[1fr_max-content] gap-1">
              {delay > 0 && student ? (
                <div
                  className={`rounded border bg-gray-100 bg-cover bg-center`}
                  style={{
                    backgroundImage: `url(${
                      student?.photo
                        ? `${url}${student.photo}`
                        : "/images/default-icon.png"
                    })`,
                  }}
                ></div>
              ) : (
                <div className="w-full rounded bg-gray-100"></div>
              )}
              <div className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-gray-600">
                <div>{delay > 0 && student ? student.name : "-----"}</div>
                <Separator />
                <div>
                  {delay > 0 && student
                    ? `${student.department}-${student.year}`
                    : "-----"}
                </div>
              </div>
            </div>

            <div className="w-full p-1 text-center text-2xl font-extrabold text-white rounded bg-gray-600">
              {delay > 0 &&
                student &&
                new Date(student.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Manila",
                })}
            </div>
          </div>
        </div>

        <div className="w-full grid grid-rows-[2fr_1fr] gap-2">
          <div className="w-full grid grid-cols-3 gap-2">
            {attendancesData.map((attendance, index) => (
              <div
                key={index}
                className="w-full h-full grid grid-rows-[40px_1fr] gap-2"
              >
                <div className="w-full flex justify-end items-center p-1 pr-2 text-center font-extrabold text-white rounded bg-primary">
                  {attendance?.type && attendance.type === "IN" ? (
                    <p className="w-14 border-2 rounded bg-green-600">IN</p>
                  ) : attendance?.type && attendance.type === "OUT" ? (
                    <p className="w-14 border-2 rounded bg-red-600">OUT</p>
                  ) : (
                    <p className="w-14 border-2 rounded bg-gray-400">-----</p>
                  )}
                </div>

                <div className="w-full grid grid-rows-[1fr_max-content] gap-1">
                  {attendance?.name && (
                    <div
                      className={`rounded border bg-gray-100 bg-cover bg-center`}
                      style={{
                        backgroundImage: `url(${
                          attendance.photo
                            ? `${url}${attendance.photo}`
                            : "/images/default-icon.png"
                        })`,
                      }}
                    ></div>
                  )}
                  <div className="w-full p-1 text-center font-extrabold text-white rounded bg-gray-600">
                    <h2>{attendance?.name ?? "NO DATA"}</h2>
                    <Separator />
                    <p className="font-normal text-sm">
                      {attendance?.department && attendance.year
                        ? `${attendance.department}-${
                            attendance.year
                          } ${new Date(
                            attendance?.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Asia/Manila",
                          })}`
                        : "-----"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <div className="w-full grid grid-rows-[max-content_1fr] text-center">
              <div
                className={`${
                  delay > 0
                    ? "bg-red-700 border-2 border-gray-600"
                    : "bg-green-700"
                } p-1 rounded text-white font-extrabold`}
              >
                {delay > 0 ? "PLEASE WAIT.... " + delay : "TAP YOUR RFID CARD"}
              </div>

              <input
                ref={rfidRef}
                onKeyDown={handleRFIDInput}
                className="w-full text-center font-extrabold text-4xl outline-0"
                type="text"
                disabled={delay > 0}
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

      <div className="flex gap-2 p-1 font-extrabold text-xl text-white bg-red-600">
        <Megaphone className="transform -rotate-12" />
        <Marquee className="uppercase">
          Announcement wlay klase ron kay di rako mo meet ninyo!
        </Marquee>
      </div>
    </div>
  );
};
