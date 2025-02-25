import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Sample data structure
interface GraphData {
  name: string; // Represents time (e.g., "Jan", "Feb", etc.)
  users: number;
  transactions: number;
  games: number;
  events: number;
}

const LineGraph: React.FC<{ data: GraphData[] }> = ({ data }) => {
  return (
    <div className="w-full h-full bg-white border border-black rounded-lg p-4 backdrop-blur-sm">
      <div className="flex h-full flex-col items-center justify-center">
       <p className="text-2xl font-semibol text-black">Coming Soon</p>
            <p className="text-sm text-black mt-2">
              Exciting new features are on the way!
            </p>
            </div>
      {/* <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#31373F" />
          <XAxis dataKey="name" stroke="#FFFFFF" />
          <YAxis stroke="#FFFFFF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#14191F",
              border: "1px solid #31373F",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#8B5CF6" // Purple
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#3B82F6" // Blue
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="games"
            stroke="#10B981" // Green
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="events"
            stroke="#EF4444" // Red
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer> */}
    </div>
  );
};

export default LineGraph;