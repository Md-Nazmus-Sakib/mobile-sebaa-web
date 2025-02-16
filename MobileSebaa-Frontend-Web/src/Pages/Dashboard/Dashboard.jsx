/* eslint-disable react/prop-types */
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Sector,
} from "recharts";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import HelmetComponent from "../../Hooks/HelmetComponent";

const Dashboard = () => {
  const token = localStorage.getItem("token");
  const { axiosPublic } = useAxiosPublic();
  const { data, isLoading } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const res = await axiosPublic.get(`/api/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalUsers = data?.data?.totalUsers || 0;
  const totalShops = data?.data?.totalShops || 0;
  const totalPendingShop = data?.data?.totalPendingShop || 0;
  const totalUsersAdmin = data?.data?.totalUsersAdmin || 0;
  const totalUsersAsUser = data?.data?.totalUsersAsUser || 0;
  const totalUsersBlocked = data?.data?.totalUsersBlocked || 0;
  const totalUsersSp = data?.data?.totalUsersSp || 0;

  // Pie Chart Data
  const chartData = [
    { name: "Admin", value: totalUsersAdmin, color: "#0088FE" },
    { name: "User", value: totalUsersAsUser, color: "#00C49F" },
    { name: "Blocked", value: totalUsersBlocked, color: "#FFBB28" },
    { name: "Service Provider", value: totalUsersSp, color: "#FF8042" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  // Active Shape Rendering
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
    } = props;
    const RADIAN = Math.PI / 180;
    const cos = Math.cos(-RADIAN * midAngle);
    const sin = Math.sin(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={fill}
          className="text-lg font-bold"
        >
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>
    );
  }

  // Bar Chart Data
  const barData = [
    { name: "Total Shops", count: totalShops },
    { name: "Total Users", count: totalUsers },
  ];

  const COLORS = ["#6366F1", "#c906a6"];

  return (
    <div className="sm:p-6">
      <HelmetComponent
  title="Dashboard | Overview and Insights"
  description="Get an overview of key metrics, user activity, and system performance. Stay on top of your operations with real-time insights and reports."
></HelmetComponent>
      {/* Dashboard Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-secondary text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium">Active Shops</h3>
          <p className="text-2xl font-bold">{totalShops}</p>
        </div>
        <div className="bg-accent text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium">Pending Requests</h3>
          <p className="text-2xl font-bold">{totalPendingShop}</p>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Bar Chart */}
        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium mb-4">
            Total Shops & Users Overview
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count">
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-medium mb-4">
            Users Distribution By Role
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape} // 🔹 Use the function here
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
