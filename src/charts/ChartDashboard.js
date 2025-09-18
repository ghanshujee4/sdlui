import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
    ResponsiveContainer, LineChart, Line, Brush
} from "recharts";
import axios from "axios";
import config from "../config";

const ChartDashboard = ({ selectedDate }) => {
    const [users, setUsers] = useState([]);
    const [statusCounts, setStatusCounts] = useState({
        new: 0,
        active: 0,
        deactivated: 0
    });
    const [availableMonths, setAvailableMonths] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [dailyData, setDailyData] = useState([]);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    useEffect(() => {
        axios.get(`${config.BASE_URL}/users`)
            .then(res => {
                const usersData = res.data;
                setUsers(usersData);

                // ----- Count for Bar Chart -----
                const formattedDate = selectedDate && !isNaN(new Date(selectedDate))
                    ? new Date(selectedDate).toISOString().split("T")[0]
                    : null;

                let counts = {
                    new: 0,
                    active: 0,
                    deactivated: 0
                };

                const monthSet = new Set();

                usersData.forEach(user => {
                    const regDate = user.registrationDate;
                    if (!regDate) return;

                    const date = new Date(regDate);
                    const yyyyMM = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
                    monthSet.add(yyyyMM);

                    const userDate = regDate.split("T")[0];
                    if (formattedDate && userDate === formattedDate) {
                        counts.new += 1;
                    } else if (user.isRegistered === "Y") {
                        counts.active += 1;
                    } else if (user.isRegistered === "N") {
                        counts.deactivated += 1;
                    }
                });

                const sortedMonths = Array.from(monthSet).sort((a, b) => {
                    const parse = (m) => new Date(`1 ${m}`);
                    return parse(a) - parse(b);
                });

                setAvailableMonths(sortedMonths);
                setStatusCounts(counts);

                // Set default selected month
                if (!selectedMonth && sortedMonths.length > 0) {
                    setSelectedMonth(sortedMonths[1]);
                }
            });
    }, [selectedDate]);

    useEffect(() => {
        if (!selectedMonth || users.length === 0) return;

        const dailyCountMap = {};
        let total = 0;
        users.forEach(user => {
            const regDate = user.registrationDate;
            if (!regDate) return;

            const date = new Date(regDate);
            const month = `${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
            if (month === selectedMonth) {
                const day = date.toISOString().split("T")[0]; // YYYY-MM-DD
                if (!dailyCountMap[day]) {
                    dailyCountMap[day] = 0;
                }
                dailyCountMap[day] += 1;
                total += 1;
            }
        });

        const dailyDataArray = Object.entries(dailyCountMap)
            .map(([day, count]) => ({ day, count }))
            .sort((a, b) => new Date(a.day) - new Date(b.day));

        setDailyData(dailyDataArray);
        setMonthlyTotal(total); // 🔸 Set total
    }, [selectedMonth, users]);

    const chartData = [
        { status: "New", count: statusCounts.new },
        { status: "Active", count: statusCounts.active },
        { status: "Deactivated", count: statusCounts.deactivated },
    ];

    return (
        <div className="container">
        <div className="w-full space-y-6">
            {/* <h2 className="text-xl font-bold">User Status Chart</h2> */}
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#007bff" />
                </BarChart>
            </ResponsiveContainer>

            <div className="flex items-center gap-4">
                <label className="font-semibold">Select Month:</label>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border px-3 py-1 rounded-md"
                >
                    {availableMonths.map((month, idx) => (
                        <option key={idx} value={month}>{month}</option>
                    ))}
                </select>
               
            </div>

            <h3 className="text-xl font-bold">New Registrations in {selectedMonth} is {monthlyTotal}</h3>
            
            {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                        data={dailyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                        <Brush dataKey="day" height={20} stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>No data available for the selected month.</p>
            )}
        </div>
        </div>
    );
};

export default ChartDashboard;
