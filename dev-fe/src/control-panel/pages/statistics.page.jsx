import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { UserContext } from "../../App";
import Loader from "../../components/loader.component";

const StatisticsPage = () => {

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="bg-white border border-grey p-2 text-sm text-black drop-shadow-sm">
        <p>{label}</p>
        <p className="text-royalblue">Users: {payload[0].value}</p>
      </div>
    );
  };

  const [days, setDays] = useState(14);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  let { userAuth: { access_token, isAdmin } } = useContext(UserContext);

  const fetchData = async () => {
    setLoading(true);
    const page = 1; // щоб отримати всі нові реєстрації, змінюй пагінацію за потребою

    try {
      const { data: res } = await axios.post(
        `${import.meta.env.VITE_SERVER_DOMAIN}/get-users`,
        {
          page,
          filter: "all",
          query: "",
          userFilter: {},
          isAdmin: true,
          deletedDocCount: 0,
          sortField: "joinedAt",
          sortOrder: "asc"
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`
          }
        }
      );

      const now = new Date();
      const fromDate = new Date();
      fromDate.setDate(now.getDate() - days);

      const filteredUsers = res.users.filter(user => {
        const joinedDate = new Date(user.joinedAt);
        return joinedDate >= fromDate && joinedDate <= now;
      });

      const counts = {};
      filteredUsers.forEach(user => {
        const date = new Date(user.joinedAt).toISOString().split("T")[0];
        counts[date] = (counts[date] || 0) + 1;
      });

      const graphData = [];
      for (let i = 0; i <= days; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        graphData.unshift({ date: dateStr, count: counts[dateStr] || 0 });
      }

      setData(graphData);
    } catch (err) {
      console.error("Error while getting data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [days]);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Users Registered</h1>

      <label className="mb-2 flex items-center">
        Period (days):
        <select className="text-black bg-white outline-none" value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value="7">7</option>
          <option value="14">14</option>
          <option value="30">30</option>
          <option value="180">180</option>
          <option value="365">365</option>
        </select>
        <div className="flex flex-wrap ml-4 gap-2 max-sm:hidden">
          <button onClick={() => setDays(7)} className={`btn-filter px-2 py-1 ${days == 7 ? 'bg-black text-white' : 'bg-grey text-black'}`}>7 Days</button>
          <button onClick={() => setDays(14)} className={`btn-filter px-2 py-1 ${days == 14 ? 'bg-black text-white' : 'bg-grey text-black'}`}>2 Weeks</button>
          <button onClick={() => setDays(30)} className={`btn-filter px-2 py-1 ${days == 30 ? 'bg-black text-white' : 'bg-grey text-black'}`}>1 Month</button>
          <button onClick={() => setDays(180)} className={`btn-filter px-2 py-1 ${days == 180 ? 'bg-black text-white' : 'bg-grey text-black'}`}>Half a Year</button>
          <button onClick={(e) => setDays(365)} className={`btn-filter px-2 py-1 ${days == 365 ? 'bg-black text-white' : 'bg-grey text-black'}`}>1 Year</button>
        </div>
      </label>

      {loading ? (
        <Loader />
      ) : (
        <ResponsiveContainer width="100%" className="text-black" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={CustomTooltip} />
            <Line type="monotone" dataKey="count" stroke="royalblue" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StatisticsPage;
