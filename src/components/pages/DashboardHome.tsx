

import React from "react";
import DashBoardNavBar from "./DashBoardNavBar";
import OverViewHome from "./OverviewHome";
// import { useSelector } from "react-redux";
// import NotificationHome from "./Notification/NotificationHome";
// import TradeHistoryHome from "./Trade History/TradeHistoryHome";

const DashboardHome = () => {
    // const [selectedNav, setSelectedNav] = useState("")
    // const selectedCom = () => {
    //     switch(setSelectedNav) {
    //         case "overview":
    //             return <OverViewHome />
    //         case "income":
    //             return <NotificationHome />
    //         case "profit":
    //             return <TradeHistoryHome />
    //         default:
    //             return <OverViewHome />
    //     }
    // }

    // const loggedInUser = useSelector((state:any) => state.loggedInUser.loggedInUser)
   // console.log(loggedInUser,"logged user")

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col gap-4 relative">
        <div className="sticky w-full top-0 left-0 z-50 rounded-md">
          {/* <DashBoardNavBar /> */}
        </div>
        <div className="w-full">
            <OverViewHome />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
