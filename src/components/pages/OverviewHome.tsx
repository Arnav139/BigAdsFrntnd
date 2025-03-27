import React, { useEffect, useState } from "react";
import axios from "axios";
// import Profit from "./Profit";
// import TotalRevenue from "./TotalRevenue";
// import TotalConvertion from "./TotalConvertion";
import TransactionHistory from "./TransactionHistory";
import Card from "./Card";
import AnalyticCounts from "./AnalyticsCounts";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
import LineGraph from "./LineGraph";
import { Loader } from "lucide-react";

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface CountData {
  users: number;
  transactions: number;
  games: number;
  events: number;
  polygon: number;
  diamante: number;
}

const OverViewHome = () => {
  // const dispatch = useDispatch();

   const sampleData = [
      { name: "Jan", users: 400, transactions: 240, games: 300, events: 200 },
      { name: "Feb", users: 500, transactions: 350, games: 420, events: 280 },
      { name: "Mar", users: 600, transactions: 410, games: 390, events: 350 },
      { name: "Apr", users: 700, transactions: 480, games: 500, events: 450 },
      { name: "May", users: 800, transactions: 520, games: 550, events: 470 },
      { name: "Jun", users: 900, transactions: 600, games: 650, events: 550 },
      { name: "Jul", users: 1000, transactions: 720, games: 750, events: 600 },
      { name: "Aug", users: 1100, transactions: 810, games: 820, events: 700 },
      { name: "Sep", users: 1200, transactions: 900, games: 890, events: 750 },
      { name: "Oct", users: 1300, transactions: 1020, games: 960, events: 800 },
      { name: "Nov", users: 1400, transactions: 1100, games: 1000, events: 850 },
      { name: "Dec", users: 1500, transactions: 1200, games: 1100, events: 900 },
    ];

//   const lastCreated = useSelector(
//     (state: RootState) => state.loggedInUser.loggedInUser
//   );

  const [countData, setCountData] = useState<CountData>({
    users: 0,
    transactions: 0,
    games: 0,
    events: 0,
    polygon: 0,
    diamante: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCountData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}user/count`
        );
        //  console.log(response.data, "count data");
        setCountData(response.data.data); // Store only the 'data' object
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchCountData();
  },[]);

  const polygon = countData?.polygon;
  const diamante = countData?.diamante;

  if (loading) return  <Loader className="w-6 h-6 text-white animate-spin flex justify-center items-center" /> //<p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // console.log(countData.users ,"usersssssssssssssssssssss")
  return (
    <div className=" text-white w-full flex flex-col h-full gap-4">
      <div className="w-full md:h-[25vh] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Current Users" value={countData?.users} />
        <Card title="Current Transactions" value={countData?.transactions} />
        <Card title="Current Games" value={countData?.games} />
        <Card title="Current Events" value={countData?.events} />
      </div>
      {/* Middle Section */}
      {/* <div className="w-full flex flex-col md:flex-row gap-4 items-start h-auto md:h-[30vh]"> */}
        {/* <div className="w-full h-full md:w-[50%] rounded-lg backdrop-blur-sm"> */}
          {/* <div className="flex flex-col h-full items-center justify-center"> */}
            {/* <LineGraph  data={sampleData} /> */}
          {/* </div> */}
        {/* </div> */}
        {/* <div className="w-full h-full md:w-[50%] md:mb-10 flex flex-col"> */}
          {/* <AnalyticCounts */}
            {/* total={countData?.transactions} */}
            {/* a={polygon} */}
            {/* b={diamante} */}
          {/* /> */}
        {/* </div> */}
      {/* </div> */}
      <div className="w-full md:h-[60vh] pb-6 md:pb-0 ">
        <TransactionHistory />
      </div>
    </div>
  );
};

export default OverViewHome;
