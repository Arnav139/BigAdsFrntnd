import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface User {
  userId: string;
  walletAddress: string;
  saAddress: string;
}

interface Event {
  eventId: string;
  eventType: string;
  eventdescription: string;
}

interface Game {
  gameId: string;
  Gamename: string;
  Gametype: string;
  description: string;
}

interface Transaction {
  transactionHash: string;
  transactionChain: string;
  user: User;
  event: Event;
  game: Game;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterTransactions, setFilterTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<any>("Filter");
  const [showFilterOptions, setShowFilterOptions] = useState<any>(false);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  // New state for tooltip
  const [tooltip, setTooltip] = useState<{ hash: string; visible: boolean }>({
    hash: "",
    visible: false,
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${backendUrl}user/transactions`);
        setTransactions(response.data.transactions);
        setFilterTransactions(response.data.transactions);
      } catch (error) {
        setError("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert("No transactions to download.");
      return;
    }

    const dataToExport = transactions.map((item, index) => ({
      "Sl.No": index + 1,
      Player: item.user.userId,
      "Transaction Hash": item.transactionHash,
      "Eventവ Type": item.event.eventType,
      Game: `${item.game.Gamename} (${item.game.Gametype})`,
      "Event ID": item.event.eventId,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 60 },
      { wch: 25 },
      { wch: 30 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(data, "transactions.xlsx");
  };

  const filter = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const selectFilter = (option: any) => {
    if (option === "polygon" || option === "Diamante") {
      const filtered: any = transactions.filter(
        (transaction: any) =>
          transaction?.transactionChain ===
          (option === "polygon" ? "Polygon" : "Diamante")
      );
      setFilterTransactions(filtered);
      setSelectedFilter(option === "polygon" ? "Polygon" : "Diamante");
      setCurrentFilter(option);
    } else if (option === "all") {
      setFilterTransactions(transactions);
      setSelectedFilter("Filter");
      setCurrentFilter(null);
    }
    setShowFilterOptions(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Show tooltip for 2 seconds
        setTooltip({ hash: text, visible: true });
        setTimeout(() => {
          setTooltip({ hash: "", visible: false });
        }, 500);
      },
      (err) => {
        console.error("Failed to copy transaction hash: ", err);
      }
    );
  };

  return (
    <div className="h-full w-full bg-white border border-black rounded-md p-2">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md p-2 gap-2">
        <p className="text-[14px] md:text-xl font-semibold text-black">
          Transaction Analytics
        </p>
        {/* You can keep your filter and download button as it was */}
      </div>

      {/* Table */}
      <div className="w-full h-[400px] md:h-[calc(100%-70px)] overflow-auto mt-4 scroll-hidden">
        {/* Table Header */}
        <div className="text-black bg-indigo-200 w-full min-w-[1040px] flex gap-2 items-center rounded-md p-2 sticky top-0 z-10 border border-black">
          <div className="w-[5%] min-w-[40px]">
            <p>Sl.No</p>
          </div>
          <div className="w-[15%] min-w-[150px]">
            <p>Player</p>
          </div>
          <div className="w-[35%] min-w-[350px]">
            <p>Transaction Hash</p>
          </div>
          <div className="w-[15%] min-w-[150px]">
            <p>Event Type</p>
          </div>
          <div className="w-[10%] min-w-[100px]">
            <p>Game</p>
          </div>
          <div className="w-[10%] min-w-[100px]">
            <p>Event ID</p>
          </div>
          <div className="w-[10%] min-w-[100px]">
            <p>Status</p>
          </div>
        </div>

        {/* Table Body */}
        <div className="w-full h-[calc(100%-40px)] min-w-[1040px] pt-4">
          {loading ? (
            <p className="text-center mt-4">Loading...</p>
          ) : error ? (
            <p className="text-center mt-4 text-red-500">{error}</p>
          ) : (
            filterTransactions?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`text-[#f1f1f1c0] w-full min-w-[800px] md:min-w-full flex gap-2 items-center py-3 px-4 ${
                    index === transactions.length - 1 ? "" : "border-b"
                  } border-[#31373F46] hover:bg-[#14191F50] transition-all duration-300 cursor-pointer`}
                >
                  <div className="w-[5%] min-w-[40px] text-center text-black">
                    <p>{index + 1}</p>
                  </div>
                  <div className="w-[15%] min-w-[150px] text-black">
                    <p>{item.user.userId}</p>
                  </div>
                  <div className="w-[35%] min-w-[350px] text-black flex items-center gap-2 relative">
                    <p
                      onClick={() => copyToClipboard(item.transactionHash)}
                      className="bg-off-white px-2 py-1 rounded-md cursor-pointer hover:bg-gray-200"
                      aria-checked="true"
                    >
                      {item.transactionHash.slice(0, 14)}...
                      {item.transactionHash.slice(-14)}
                    </p>
                    {/* Tooltip */}
                    {tooltip.visible && tooltip.hash === item.transactionHash && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-indigo-300 text-black text-xs rounded py-1 px-2 whitespace-nowrap z-20">
                        Copied to clipboard!
                      </span>
                    )}
                  </div>
                  <div className="w-[15%] min-w-[150px] text-black">
                    <p>
                      {item.event.eventType.slice(0, 6)}...
                      {item.event.eventType.slice(-6)}
                    </p>
                  </div>
                  <div className="w-[10%] min-w-[100px] text-black">
                    <p>
                      {item.game.Gamename.slice(0, 10)}...(
                      {item.game.Gametype.slice(0, 6)})
                    </p>
                  </div>
                  <div className="w-[15%] min-w-[100px] text-black">
                    <p>{item.event.eventId}</p>
                  </div>
                  <div className="w-[10%] min-w-[100px] text-black">
                    <p>Success</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;