import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Brush,
} from "recharts";
import axios from "axios";
import config from "../config";
import CustomDot from "./CustomDot";

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [dailyData, setDailyData] = useState([]);
  const [monthlyPaidTotal, setMonthlyPaidTotal] = useState(0);
  const [monthlyUnpaidTotal, setMonthlyUnpaidTotal] = useState(0);

  // Fetch payments on mount
  useEffect(() => {
    const fetchAllPayments = async () => {
      try {
        const usersRes = await axios.get(`${config.BASE_URL}/users`);
        const users = usersRes.data || [];
        const paymentPromises = users.map((user) =>
          axios
            .get(`${config.BASE_URL}/payments/${user.id}`)
            .then((res) => (Array.isArray(res.data) ? res.data : []))
            .catch(() => [])
        );
        const allPaymentsArr = await Promise.all(paymentPromises);
        const allPayments = allPaymentsArr.flat();

        setPayments(allPayments);

        // Extract unique sorted available months
        const monthsSet = new Set();
        allPayments.forEach((p) => {
          if (p.paymentDate) {
            const d = new Date(p.paymentDate);
            monthsSet.add(
              `${d.toLocaleString("default", { month: "short" })}-${d.getFullYear()}`
            );
          }
        });

        const monthsSorted = Array.from(monthsSet).sort((a, b) => {
          const [ma, ya] = a.split("-");
          const [mb, yb] = b.split("-");
          return (
            new Date(`${mb} 1, ${yb}`) - new Date(`${ma} 1, ${ya}`)
          );
        });

        setAvailableMonths(monthsSorted);
        if (monthsSorted.length > 0) setSelectedMonth(monthsSorted[0]);
      } catch (err) {
        console.error("Error fetching payments", err);
      }
    };
    fetchAllPayments();
  }, []);

  // Calculate daily data and monthly totals on payments/selectedMonth change
  useEffect(() => {
    if (!selectedMonth || payments.length === 0) {
      setDailyData([]);
      setMonthlyPaidTotal(0);
      setMonthlyUnpaidTotal(0);
      return;
    }

    let totalPaid = 0;
    let totalUnpaid = 0;
    const dailyMap = {};

    payments.forEach((payment) => {
      if (!payment.paymentDate) return;
      const paymentDateObj = new Date(payment.paymentDate);
      const monthKey = `${paymentDateObj.toLocaleString("default", { month: "short" })}-${paymentDateObj.getFullYear()}`;
      if (monthKey !== selectedMonth) return;

      const day = paymentDateObj.toISOString().split("T")[0];
      if (!dailyMap[day]) {
        dailyMap[day] = { day, paid: 0, unpaid: 0, paidBy: [] };
      }
      const amt = payment.amount || 0;
      if (payment.paid) {
        dailyMap[day].paid += amt;
        totalPaid += amt;
        if (payment.user?.name) {
          dailyMap[day].paidBy.push({ name: payment.user.name, amount: amt });
        }
      } else {
        dailyMap[day].unpaid += amt;
        totalUnpaid += amt;
      }
    });

    setDailyData(
      Object.values(dailyMap).sort((a, b) => new Date(a.day) - new Date(b.day))
    );
    setMonthlyPaidTotal(totalPaid);
    setMonthlyUnpaidTotal(totalUnpaid);
  }, [selectedMonth, payments]);

  return (
    <div className="container">
      <hr />
      <div className="space-y-6">
        <h3>Payment Chart Board</h3>
        <div>
          <label className="font-medium mr-2">Select Payment Month:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <span className="text-xl font-bold">
          ✅ Total Paid & Un-paid (for {selectedMonth}): ₹{monthlyPaidTotal} & ₹{monthlyUnpaidTotal}
        </span>
        {dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="paid"
                stroke="#28a745"
                strokeWidth={2}
                strokeDasharray="5 5"
                activeDot={{ r: 6, stroke: "#000", strokeWidth: 1 }}
                connectNulls
                name="Paid (₹)"
                label={{ position: "top", fill: "#28a745", fontSize: 12 }}
                isAnimationActive={true}
                animationDuration={1000}
                legendType="circle"
                dot={<CustomDot />}
              />
              <Line
                type="monotone"
                dataKey="unpaid"
                stroke="#dc3545"
                name="Unpaid (₹)"
                isAnimationActive={true}
              />
              <Brush dataKey="day" height={20} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p>No payment data for {selectedMonth}.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentDashboard;
