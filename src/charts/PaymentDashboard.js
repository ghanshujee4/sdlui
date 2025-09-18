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
  const [paymentDailyData, setPaymentDailyData] = useState([]);
  const [monthlyPaidTotal, setMonthlyPaidTotal] = useState(0);
  const [monthlyUnpaidTotal, setMonthlyUnpaidTotal] = useState(0);

  // 🔹 Fetch all payments for all users
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // Get all users
        const usersRes = await axios.get(`${config.BASE_URL}/users`);
        const users = usersRes.data || [];

        // Get each user's payments in parallel
        const promises = users.map((user) =>
          axios
            .get(`${config.BASE_URL}/payments/${user.id}`)
            .then((res) => (Array.isArray(res.data) ? res.data : []))
            .catch((err) => {
              console.error(`Error fetching payments for user ${user.id}`, err);
              return [];
            })
        );

        const results = await Promise.all(promises);
        const allPayments = results.flat();

        setPayments(allPayments);

        // Extract unique months from monthPaid
        const months = [
          ...new Set(
            allPayments
              .filter((p) => p.monthPaid)
              .map((p) => {
                const d = new Date(p.monthPaid);
                return `${d.toLocaleString("default", {
                  month: "short",
                })}-${d.getFullYear()}`;
              })
          ),
        ];

        // setAvailableMonths(months);
        if (months.length > 0) {
          // Sort months by date descending
          const sortedMonths = months.sort((a, b) => {
            const [ma, ya] = a.split("-");
            const [mb, yb] = b.split("-");
            const da = new Date(`${ma} 1, ${ya}`);
            const db = new Date(`${mb} 1, ${yb}`);
            return db - da; // latest first
          });

          setAvailableMonths(sortedMonths);
          setSelectedMonth(sortedMonths[0]); // ✅ most recent month
        }

      } catch (err) {
        console.error("Error fetching payments", err);
      }
    };

    fetchPayments();
  }, []);

  // 🔹 Process payments for chart + total
  useEffect(() => {
    if (!selectedMonth || payments.length === 0) return;

    const dailyMap = {}; // { "2025-06-02": { paid: 500, unpaid: 200 } }
    let totalPaid = 0;
    let totalUnpaid = 0;
    payments.forEach((payment) => {
      if (!payment.monthPaid) return;

      const monthDate = new Date(payment.monthPaid);
      const monthKey = `${monthDate.toLocaleString("default", {
        month: "short",
      })}-${monthDate.getFullYear()}`;

      if (monthKey === selectedMonth) {
        // use actual paymentDate if available, else fallback to monthPaid date
        const day = payment.paymentDate
          ? new Date(payment.paymentDate).toISOString().split("T")[0]
          : monthDate.toISOString().split("T")[0];

        if (!dailyMap[day]) {
          dailyMap[day] = { day, paid: 0, unpaid: 0, paidBy: [] };
        }

        if (payment.paid) {
          dailyMap[day].paid += payment.amount || 0;
          totalPaid += payment.amount || 0;
          if (payment.user?.name) {
            dailyMap[day].paidBy.push({
              name: payment.user.name,
              amount: payment.amount || 0
            });
          }

        } else {
          dailyMap[day].unpaid += payment.amount || 0;
          totalUnpaid += payment.amount || 0;
        }

      }
    });

    const dailyPaymentsArray = Object.values(dailyMap).sort(
      (a, b) => new Date(a.day) - new Date(b.day)
    );

    setPaymentDailyData(dailyPaymentsArray);
    setMonthlyPaidTotal(totalPaid);
    setMonthlyUnpaidTotal(totalUnpaid);
  }, [selectedMonth, payments]);

  // const handlePointClick = (data, index) => {
  //   if (data && data.payload && data.payload.paidBy) {
  //     alert(`Students who paid on ${data.payload.day}: ${data.payload.paidBy.join(", ")}`);
  //   }
  // };

  return (
    <div className="container">

      <hr></hr>

      <div className="space-y-6">
        {/* Month Selector */}
        <h3>  Payment Chart Board </h3>
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

        {/* Monthly Paid Total */}
        <b className="text-xl font-bold">
          ✅ Total Paid & Un-paid (for {selectedMonth}): ₹{monthlyPaidTotal} &  ₹{monthlyUnpaidTotal}
        </b>

        {/* Chart */}
        {paymentDailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentDailyData}>
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
                // dot={{ r: 2, fill: '#28a745' }}
                activeDot={{ r: 6, stroke: '#000', strokeWidth: 1 }}
                connectNulls
                name="Paid (₹)"
                label={{ position: 'top', fill: '#28a745', fontSize: 12 }}
                isAnimationActive={true}
                animationDuration={1000}
                legendType="circle"
                // onClick={handlePointClick} // ✅ added
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
