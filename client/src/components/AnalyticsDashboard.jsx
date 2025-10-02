import React, { useEffect, useState } from "react";
import SummaryApi from "../comman/summaryApi";
import Axios from "../utils/axios";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

const AnalyticsDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);

  // Fetch Overview KPIs
  const fetchOverview = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.analytics.overview.url,
        method: SummaryApi.analytics.overview.method,
        params: { compare: true },
      });
      setOverview(res.data.data);
    } catch (err) {
      console.error("Error fetching overview:", err);
    }
  };

  // Fetch Sales Trend
  const fetchSalesTrend = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.analytics.salesTrend.url,
        method: SummaryApi.analytics.salesTrend.method,
        params: { groupBy: "day" },
      });
      setSalesTrend(res.data.data);
    } catch (err) {
      console.error("Error fetching sales trend:", err);
    }
  };

  // Fetch Top Products
  const fetchTopProducts = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.analytics.topProducts.url,
        method: SummaryApi.analytics.topProducts.method,
        params: { limit: 5, by: "revenue" },
      });
      setTopProducts(res.data.data);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  // Fetch Category Performance
  const fetchCategoryPerformance = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.analytics.categoryPerformance.url,
        method: SummaryApi.analytics.categoryPerformance.method,
      });
      setCategoryPerformance(res.data.data);
    } catch (err) {
      console.error("Error fetching category performance:", err);
    }
  };

  // Fetch User Growth
  const fetchUserGrowth = async () => {
    try {
      const res = await Axios({
        url: SummaryApi.analytics.userGrowth.url,
        method: SummaryApi.analytics.userGrowth.method,
        params: { groupBy: "day" },
      });
      setUserGrowth(res.data.data);
    } catch (err) {
      console.error("Error fetching user growth:", err);
    }
  };

  useEffect(() => {
    fetchOverview();
    fetchSalesTrend();
    fetchTopProducts();
    fetchCategoryPerformance();
    fetchUserGrowth();
  }, []);

  return (
    <div className="p-6 space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow p-4 rounded">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">₹{overview?.kpis?.totalRevenue}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3>Total Orders</h3>
          <p className="text-2xl font-bold">{overview?.kpis?.totalOrders}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3>Average Order Value</h3>
          <p className="text-2xl font-bold">₹{overview?.kpis?.avgOrderValue?.toFixed(2)}</p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">{overview?.kpis?.totalUsers}</p>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="mb-2">Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalRevenue" stroke="#0088FE" />
            <Line type="monotone" dataKey="orders" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="mb-2">Top Products</h3>
        <ul className="space-y-2">
          {topProducts.map((p, i) => (
            <li key={p.productId} className="flex justify-between">
              <span>{i + 1}. {p.name}</span>
              <span>₹{p.revenue} ({p.quantitySold})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Category Performance */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="mb-2">Category Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryPerformance}
              dataKey="revenue"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryPerformance.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth */}
      <div className="bg-white shadow p-4 rounded">
        <h3 className="mb-2">User Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newUsers" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
