import { useQuery } from "@tanstack/react-query";
import { coleAPI } from "@/lib/utils";
import type { Attendance } from "@/types/data.types";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import {
  Calendar,
  Search,
  RefreshCw,
  UserCheck,
  LogIn,
  LogOut,
} from "lucide-react";

const getTodayString = () => {
  const local = new Date();
  const offset = local.getTimezoneOffset();
  const adjusted = new Date(local.getTime() - offset * 60 * 1000);
  return adjusted.toISOString().split("T")[0];
};

export const AttendanceReports = () => {
  const {
    data: attendances,
    refetch,
    isFetching,
  } = useQuery<Attendance[]>({
    queryKey: ["faculty-attendances"],
    queryFn: () => coleAPI("/attendances/reports")({}),
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "IN" | "OUT">("ALL");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  const filteredData = useMemo(() => {
    if (!attendances) return [];
    return attendances.filter((item) => {
      const matchSearch =
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(item.studentId).includes(searchTerm);

      const matchType = selectedType === "ALL" || item.type === selectedType;

      const matchDate =
        !selectedDate ||
        new Date(item.timestamp).toISOString().split("T")[0] === selectedDate;

      return matchSearch && matchType && matchDate;
    });
  }, [attendances, searchTerm, selectedType, selectedDate]);

  const handleExportExcel = () => {
    if (!filteredData || filteredData.length === 0) return;

    const exportData = filteredData.map((row) => {
      const dateObj = new Date(row.timestamp);
      const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateStr = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
      return {
        "Student Name": row.name,
        Department: row.department ? row.department.toUpperCase() : "",
        "Year Level": row.year,
        Status: row.type,
        Time: timeStr,
        Date: dateStr,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Reports");

    const maxLens = Object.keys(exportData[0] || {}).map((key) => {
      let maxVal = key.length;
      exportData.forEach((row) => {
        const val = row[key as keyof typeof row];
        if (val !== undefined && val !== null) {
          maxVal = Math.max(maxVal, String(val).length);
        }
      });
      return { wch: maxVal + 2 };
    });
    worksheet["!cols"] = maxLens;

    XLSX.writeFile(workbook, `attendance_report_${selectedDate || "all"}.xlsx`);
  };

  const stats = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayTaps =
      attendances?.filter(
        (a) => new Date(a.timestamp).toISOString().split("T")[0] === todayStr,
      ) || [];

    const uniqueStudentsToday = new Set(todayTaps.map((a) => a.studentId)).size;
    const totalInToday = todayTaps.filter((a) => a.type === "IN").length;
    const totalOutToday = todayTaps.filter((a) => a.type === "OUT").length;

    return {
      todayTaps: todayTaps.length,
      presentToday: uniqueStudentsToday,
      inToday: totalInToday,
      outToday: totalOutToday,
    };
  }, [attendances]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="border-l-8 border-orange-500 pl-3 ">
          <h2 className="font-bold text-2xl text-slate-800">
            Attendance Reports
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Real-time attendance logs for students under your faculty account
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            {isFetching ? "Syncing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Present Today
            </p>
            <h3 className="text-2xl text-center font-bold text-slate-800">
              {stats.presentToday}
            </h3>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Today's Total Taps
            </p>
            <h3 className="text-2xl text-center font-bold text-slate-800">
              {stats.todayTaps}
            </h3>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <LogIn size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Check-Ins Today
            </p>
            <h3 className="text-2xl text-center font-bold text-slate-800">
              {stats.inToday}
            </h3>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <LogOut size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
              Check-Outs Today
            </p>
            <h3 className="text-2xl text-center font-bold text-slate-800">
              {stats.outToday}
            </h3>
          </div>
        </Card>
      </div>

      <Card className="gap-0 p-4 bg-white border border-slate-150 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          <div className="flex flex-1 flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="relative w-full sm:w-48">
              <Calendar
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {selectedDate ? (
              <Button
                variant="outline"
                type="button"
                onClick={() => setSelectedDate("")}
                className="w-full sm:w-auto px-4"
              >
                Show All Dates
              </Button>
            ) : (
              <Button
                variant="outline"
                type="button"
                onClick={() => setSelectedDate(getTodayString())}
                className="w-full sm:w-auto px-4"
              >
                Reset to Today
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === "ALL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("ALL")}
            >
              All
            </Button>
            <Button
              variant={selectedType === "IN" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("IN")}
              className="flex items-center gap-1"
            >
              <LogIn size={14} />
              In
            </Button>
            <Button
              variant={selectedType === "OUT" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("OUT")}
              className="flex items-center gap-1"
            >
              <LogOut size={14} />
              Out
            </Button>
          </div>

          <Button
            variant="outline"
            type="button"
            size="sm"
            onClick={handleExportExcel}
            disabled={filteredData.length === 0}
            className="w-full sm:w-auto px-4 bg-green-200 hover:bg-green-600 hover:text-white transition-colors border border-green-300 cursor-pointer"
          >
            Export as Excel
          </Button>
        </div>

        <div className="mt-6 overflow-x-auto border border-slate-100 rounded-lg">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3 font-semibold">Student</th>
                <th className="px-6 py-3 font-semibold">Department</th>
                <th className="px-6 py-3 font-semibold">Year Level</th>
                <th className="px-6 py-3 font-semibold text-center">Status</th>
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => {
                  const dateObj = new Date(row.timestamp);
                  const timeStr = dateObj.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const dateStr = dateObj.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-semibold text-slate-800 capitalize">
                        {row.name}
                      </td>
                      <td className="px-6 py-4 uppercase font-medium text-slate-500">
                        {row.department}
                      </td>
                      <td className="px-6 py-4">{row.year}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                            row.type === "IN"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-orange-50 text-orange-700 border border-orange-200"
                          }`}
                        >
                          {row.type === "IN" ? "IN" : "OUT"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 tabular-nums">
                        {timeStr}
                      </td>
                      <td className="px-6 py-4 text-slate-500 tabular-nums">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No attendance logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
