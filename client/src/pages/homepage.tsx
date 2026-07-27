import { Separator } from "@/components/ui/separator";
import { coleAPI } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Megaphone, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Marquee from "react-fast-marquee";
import { toast } from "sonner";
import { io as ioClient } from "socket.io-client";
import config from "../../system.config.json";
import type { Attendance } from "@/types/data.types";

const url =
  config.isProduction && config.prodServer
    ? config.prodServer + "/api"
    : (config.devServer || "http://localhost:5000") + "/api";

const socketServerUrl =
  config.isProduction && config.prodServer
    ? config.prodServer
    : config.devServer || "http://localhost:5000";

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
  const [currentStudent, setCurrentStudent] = useState<any>(null);

  const [time, setTime] = useState<TimeData>({
    hours: "00",
    minutes: "00",
    seconds: "00",
    amPm: "AM",
  });

  const { data: attendances } = useQuery<Attendance[]>({
    queryKey: ["attendances"],
    queryFn: coleAPI(
      "/attendances?date=" + new Date().toISOString().slice(0, 10),
    ),
  });

  const { data: announcements } = useQuery<{ id: number; message: string }[]>({
    queryKey: ["public-announcements"],
    queryFn: coleAPI("/announcements/public"),
    refetchInterval: 60000,
  });

  const { mutateAsync: addAttendance } = useMutation({
    mutationFn: coleAPI("/attendances/add", "POST"),
  });

  let globalAudioCtx: AudioContext | null = null;

  const getAudioContext = () => {
    try {
      if (!globalAudioCtx) {
        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          globalAudioCtx = new AudioCtx();
        }
      }
      if (globalAudioCtx && globalAudioCtx.state === "suspended") {
        globalAudioCtx.resume();
      }
      return globalAudioCtx;
    } catch (err) {
      return null;
    }
  };

  const playAudioChime = (type: "IN" | "OUT" | "ERROR") => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "IN") {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "OUT") {
        osc.frequency.setValueAtTime(783.99, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(523.25, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(220, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    } catch (err) {
      console.warn("audio chime failed:", err);
    }
  };

  const speakWebSpeech = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      (window as any)._activeUtterance = utterance;

      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const englishVoices = voices.filter(
          (v) =>
            v.lang.startsWith("en") ||
            v.lang.includes("US") ||
            v.lang.includes("GB"),
        );
        const preferredVoice =
          englishVoices.find(
            (v) =>
              v.name.toLowerCase().includes("google") ||
              v.name.toLowerCase().includes("natural") ||
              v.name.toLowerCase().includes("us english") ||
              v.name.toLowerCase().includes("samantha") ||
              v.name.toLowerCase().includes("zira") ||
              v.name.toLowerCase().includes("jenny"),
          ) ||
          englishVoices.find((v) => v.lang === "en-US") ||
          englishVoices[0] ||
          voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        delete (window as any)._activeUtterance;
      };
      utterance.onerror = () => {
        delete (window as any)._activeUtterance;
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("web speech failed:", err);
    }
  };

  const playTTSAudio = (text: string) => {
    try {
      const audioUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${encodeURIComponent(
        text,
      )}`;
      const audio = new Audio(audioUrl);
      audio.volume = 1.0;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("online tts blocked or failed, using web speech:", err);
          speakWebSpeech(text);
        });
      }
    } catch (err) {
      speakWebSpeech(text);
    }
  };

  const [soundUnlocked, setSoundUnlocked] = useState(false);
  const soundUnlockedRef = useRef(soundUnlocked);

  useEffect(() => {
    soundUnlockedRef.current = soundUnlocked;
  }, [soundUnlocked]);

  const speakText = (
    text: string,
    type: "IN" | "OUT" | "ERROR" = "IN",
    force: boolean = false,
  ) => {
    if (!soundUnlockedRef.current && !force) return;
    playAudioChime(type);
    setTimeout(() => {
      playTTSAudio(text);
    }, 120);
  };

  const toggleAudio = () => {
    const nextState = !soundUnlocked;
    setSoundUnlocked(nextState);
    soundUnlockedRef.current = nextState;

    if (nextState) {
      speakText("System is now ready!", "IN", true);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  // unlock browser audio policy and preload tts voices
  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    const unlockAudio = () => {
      setSoundUnlocked(true);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.resume();
      }
      // silent audio play to unlock html5 audio policy in chrome/brave
      const silentAudio = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA",
      );
      silentAudio.play().catch(() => {});

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // listen for real-time socket.io attendance events from esp32/server
  useEffect(() => {
    const socket = ioClient(socketServerUrl);

    socket.on("attendance_tapped", (studentData: any) => {
      setCurrentStudent(studentData);
      setDelay(3);
      if (rfidRef.current && studentData?.rfidTag) {
        rfidRef.current.value = studentData.rfidTag;
      }
      queryClient.invalidateQueries({ queryKey: ["attendances"] });

      const type = studentData?.type === "OUT" ? "OUT" : "IN";
      const textToSpeak = studentData
        ? type === "IN"
          ? `Welcome ${studentData.firstName} ${studentData.lastName}`
          : `Goodbye ${studentData.firstName} ${studentData.lastName}, see you again!`
        : "Student not found";
      speakText(textToSpeak, type);
    });

    socket.on("attendance_error", (errorData: any) => {
      if (rfidRef.current && errorData?.rfidTag) {
        rfidRef.current.value = errorData.rfidTag;
      }
      if (errorData?.error === "COOLDOWN_ACTIVE") {
        toast.warning(errorData.message);
        speakText(errorData.message, "ERROR");
      } else if (errorData?.status === 404) {
        toast.error("Student not found. Please register the student.");
        speakText("Student not found. Please register the student.", "ERROR");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

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
      try {
        const payload = {
          rfidTag: rfidValue,
        };
        await addAttendance(payload);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.response?.data?.error === "COOLDOWN_ACTIVE") {
            toast.warning(error.response.data.message);
            speakText(error.response.data.message);
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
        // TODO: only for development
        // rfidRef.current?.focus();
        setDelay((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      rfidRef.current!.value = "";
      // TODO: only for development
      // rfidRef.current?.focus();
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

  // TODO: only for development
  // rfidRef.current?.focus();

  return (
    <div className="w-full min-h-full flex flex-col justify-between lg:h-full lg:grid lg:grid-rows-[1fr_max-content]">
      <div className="w-full p-2 lg:p-3 flex flex-col lg:grid lg:grid-cols-[450px_1fr] gap-2 lg:gap-3">
        <div className="flex justify-center items-center">
          <div className="w-full h-full flex flex-col lg:grid lg:grid-rows-[40px_1fr_40px] gap-1.5 lg:gap-2">
            {delay > 0 && currentStudent ? (
              (currentStudent?.type === "IN" && (
                <p className="w-full p-1 text-center text-sm lg:text-2xl font-extrabold text-white rounded bg-green-600">
                  Welcome!
                </p>
              )) ||
              (currentStudent?.type === "OUT" && (
                <p className="w-full p-1 text-center text-sm lg:text-2xl font-extrabold text-white rounded bg-primary">
                  Goodbye, See you again!
                </p>
              ))
            ) : (
              <p className="w-full p-1 text-center text-sm lg:text-2xl font-extrabold text-white rounded bg-primary min-h-[28px] lg:min-h-0"></p>
            )}

            <div className="w-full flex-1 flex flex-col lg:grid lg:grid-rows-[1fr_max-content] gap-1">
              {delay > 0 && currentStudent ? (
                <div
                  className="w-full aspect-[4/3] max-h-[200px] lg:max-h-none lg:h-full lg:aspect-auto rounded border bg-gray-100 bg-cover bg-center mx-auto"
                  style={{
                    backgroundImage: `url(${
                      currentStudent?.photo
                        ? `${url}${currentStudent.photo}`
                        : "/images/default-icon.png"
                    })`,
                  }}
                ></div>
              ) : (
                <div className="w-full aspect-[4/3] max-h-[200px] lg:max-h-none lg:h-full lg:aspect-auto rounded bg-gray-100 mx-auto"></div>
              )}
              <div className="w-full p-1 text-center text-sm lg:text-2xl font-extrabold text-white rounded bg-gray-600">
                <div className="truncate px-1">
                  {delay > 0 && currentStudent ? currentStudent.name : "-----"}
                </div>
                <Separator />
                <div className="truncate px-1">
                  {delay > 0 && currentStudent
                    ? `${currentStudent.department}-${currentStudent.year}`
                    : "-----"}
                </div>
                {delay > 0 && currentStudent?.rfidTag && (
                  <>
                    <Separator />
                    <div className="text-[10px] lg:text-sm font-semibold text-gray-300 truncate">
                      RFID: {currentStudent.rfidTag}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="w-full p-1 text-center text-xs lg:text-2xl font-extrabold text-white rounded bg-gray-600 min-h-[28px] lg:min-h-0 flex items-center justify-center">
              {delay > 0 &&
                currentStudent &&
                new Date(currentStudent.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Manila",
                })}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col lg:grid lg:grid-rows-[2fr_1fr] gap-2">
          <div className="w-full grid grid-cols-3 gap-1.5 lg:gap-2">
            {attendancesData.map((attendance, index) => (
              <div
                key={index}
                className="w-full h-full flex flex-col lg:grid lg:grid-rows-[40px_1fr] gap-1 lg:gap-2"
              >
                <div className="w-full flex justify-end items-center p-0.5 pr-1 lg:p-1 lg:pr-2 text-center font-extrabold text-white rounded bg-primary min-h-[28px] lg:min-h-0">
                  {attendance?.type && attendance.type === "IN" ? (
                    <p className="w-10 lg:w-14 text-[10px] lg:text-base border lg:border-2 rounded bg-green-600">IN</p>
                  ) : attendance?.type && attendance.type === "OUT" ? (
                    <p className="w-10 lg:w-14 text-[10px] lg:text-base border lg:border-2 rounded bg-red-600">OUT</p>
                  ) : (
                    <p className="w-10 lg:w-14 text-[10px] lg:text-base border lg:border-2 rounded bg-gray-400">-----</p>
                  )}
                </div>

                <div className="w-full flex-1 flex flex-col lg:grid lg:grid-rows-[1fr_max-content] gap-1">
                  {attendance?.name ? (
                    <div
                      className="w-full aspect-[4/3] lg:aspect-auto lg:h-full rounded border bg-gray-100 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${
                          attendance.photo
                            ? `${url}${attendance.photo}`
                            : "/images/default-icon.png"
                        })`,
                      }}
                    ></div>
                  ) : (
                    <div className="w-full aspect-[4/3] lg:aspect-auto lg:h-full rounded bg-gray-100"></div>
                  )}
                  <div className="w-full p-0.5 lg:p-1 text-center font-extrabold text-white rounded bg-gray-600">
                    <h2 className="text-[11px] lg:text-base truncate px-0.5">
                      {attendance?.name ?? "NO DATA"}
                    </h2>
                    <Separator />
                    <p className="font-normal text-[9px] lg:text-sm truncate px-0.5">
                      {attendance?.department && attendance.year
                        ? `${attendance.department}-${
                            attendance.year
                          } ${new Date(
                            attendance?.timestamp,
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

          <div className="w-full grid grid-cols-2 gap-1.5 lg:gap-2">
            <div className="w-full flex flex-col lg:grid lg:grid-rows-[max-content_1fr] text-center">
              <div className="bg-green-700 p-1 rounded text-white font-extrabold text-[10px] lg:text-base">
                TAP YOUR RFID CARD
              </div>

              <input
                ref={rfidRef}
                onKeyDown={handleRFIDInput}
                className="w-full text-center font-extrabold text-lg lg:text-4xl outline-0 py-1 lg:py-0"
                type="text"
                placeholder="----"
              />
            </div>

            <div className="w-full text-center flex flex-col lg:grid lg:grid-rows-[max-content_1fr_max-content] gap-1 lg:gap-2">
              <div className="bg-primary p-1 px-2 lg:px-3 rounded text-white font-extrabold flex justify-between items-center text-[10px] lg:text-base">
                <span>{getDate().day.toUpperCase()}</span>
                <button
                  type="button"
                  onClick={toggleAudio}
                  title={
                    soundUnlocked
                      ? "Click to Mute Audio"
                      : "Click to Enable Audio"
                  }
                  className="flex items-center gap-0.5 text-[9px] lg:text-xs font-semibold px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
                >
                  {soundUnlocked ? (
                    <>
                      <Volume2 className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-emerald-300" />
                      <span className="text-emerald-300">Sound ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-amber-300 animate-pulse" />
                      <span className="text-amber-300 animate-pulse">
                        Sound OFF
                      </span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-gray-100 rounded flex justify-center items-center text-sm lg:text-4xl font-extrabold min-h-[32px] lg:min-h-0 p-1">
                <p>{`${time.hours}:${time.minutes}:${time.seconds} ${time.amPm}`}</p>
              </div>

              <div className="bg-primary p-1 rounded text-white font-extrabold text-[10px] lg:text-base">
                {getDate().month} {getDate().date}, {getDate().year}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1 font-extrabold text-xs lg:text-xl text-white bg-red-600">
        {Array.isArray(announcements) && announcements.length > 0 ? (
          <>
            <Megaphone className="transform -rotate-12 shrink-0 w-4 h-4 lg:w-6 lg:h-6" />
            <Marquee className="uppercase">
              {announcements
                .map((a: { id: number; message: string }) => a.message)
                .join("   ★   ")}
            </Marquee>
          </>
        ) : (
          <span className="opacity-0">.</span>
        )}
      </div>
    </div>
  );
};
