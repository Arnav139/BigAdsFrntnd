import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
// import Image from "next/image";

interface User {
  userId: string;
}

interface Event {
  eventType: string;
  eventId: string;
}

interface Game {
  name: string;
  type: string;
}

interface Transaction {
  toUser: User;
  transactionHash: string;
  transactionChain: string;
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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "https://data-center-7yhai.ondigitalocean.app/user/transactions"
        );
        setTransactions(response.data.data);
        setFilterTransactions(response.data.data);
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
      Player: item.toUser.userId,
      "Transaction Hash": item.transactionHash,
      "Event Type": item.event.eventType,
      Game: `${item.game.name} (${item.game.type})`,
      "Event ID": item.event.eventId,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = [
      { wch: 6 }, // Sl.No
      { wch: 20 }, // Player
      { wch: 60 }, // Transaction Hash
      { wch: 25 }, // Event Type
      { wch: 30 }, // Game
      { wch: 25 }, // Event ID
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
          (option === "polygon" ? "POLYGON Testnet" : "DIAMANTE Testnet")
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

  const resetFilter = () => {
    setFilterTransactions(transactions);
    setSelectedFilter("Filter");
    setCurrentFilter(null);
  };

  return (
    <div className="h-full w-full bg-white border border-black rounded-md p-2">
      <div className="w-full flex items-center justify-between rounded-md p-2">
        <p className="text-[14px] md:text-xl font-semibold text-black">
          Transaction Analytics
        </p>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="bg-indigo-200 cursor-pointer border border-black text-black flex items-center gap-2 rounded-md px-4 py-2"
              onClick={filter}
            >
              <button
                className="hidden md:block text-black rounded-md cursor-pointer"
              >
                {`${selectedFilter} ${
                  selectedFilter === "Polygon" || selectedFilter === "Diamante"
                    ? `(${filterTransactions.length})`
                    : ""
                }`}
              </button>
              <button
                className={`${
                  selectedFilter === "Polygon" || selectedFilter === "Diamante"
                    ? "hidden"
                    : "block"
                } md:hidden text-white rounded-md cursor-pointer`}
              >
                {/* <Image
                  width={15}
                  height={15}
                  src="/Icons/filter.svg"
                  alt="filter"
                /> */}
              </button>
              <p
                className={`cursor-pointer ${
                  selectedFilter === "Polygon" || selectedFilter === "Diamante"
                    ? "block"
                    : "hidden"
                }`}
                onClick={resetFilter}
              >
                {/* <Image
                  width={15}
                  height={15}
                  src="/Icons/refresh.svg"
                  alt=""
                /> */}
              </p>
            </div>
            <div
              className={`${
                showFilterOptions ? "block" : "hidden"
              } absolute top-10 left-0 bg-[#14191F] rounded-md p-2 z-50 border border-[#31373F46]`}
            >
              <ul className="flex flex-col">
                {currentFilter ? (
                  <>
                    <li
                      className="cursor-pointer border-b pb-1"
                      onClick={() => selectFilter("all")}
                    >
                      All
                    </li>
                    <li
                      className="cursor-pointer pt-1"
                      onClick={() =>
                        selectFilter(currentFilter === "polygon" ? "Diamante" : "polygon")
                      }
                    >
                      {currentFilter === "polygon" ? "Diamante" : "Polygon"}
                    </li>
                  </>
                ) : (
                  <>
                    <li
                      className="cursor-pointer border-b pb-1"
                      onClick={() => selectFilter("polygon")}
                    >
                      Polygon
                    </li>
                    <li
                      className="cursor-pointer pt-1"
                      onClick={() => selectFilter("Diamante")}
                    >
                      Diamante
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <button
            onClick={exportToExcel}
            className="hidden md:block bg-indigo-200 text-black px-4 py-2 rounded-md cursor-pointer border border-black"
          >
            Download CSV
          </button>
          <button
            onClick={exportToExcel}
            className="md:hidden bg-[#000020] text-white px-4 py-2 rounded-md cursor-pointer bg-gradient-to-b from-purple-600 to-black"
          >
            {/* <Image
              className=""
              width={15}
              height={15}
              src="/Icons/download.svg"
              alt=""
            /> */}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full h-[400px] md:h-[calc(100%-70px)] overflow-auto mt-4 scroll-hidden">
        {/* Table Header */}
        <div className="text-black bg-indigo-200 w-full min-w-[1040px] flex gap-2 items-center rounded-md p-2 sticky top-0 z-10 border border-black ">
          <div className="w-[5%] min-w-[40px]">
            <p>Sl.No</p>
          </div>
          <div className="w-[15%] min-w-[150px]">
            <p>Player</p>
          </div>
          <div className="w-[40%] min-w-[350px]">
            <p>Transaction Hash</p>
          </div>
          <div className="w-[10%] min-w-[100px]">
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
            filterTransactions.map((item, index) => {
              // Determine the link based on the transactionChain
              const link =
                item.transactionChain === "POLYGON Testnet"
                  ? `https://www.oklink.com/amoy/tx/${item.transactionHash}`
                  : item.transactionChain === "DIAMANTE Testnet"
                  ? `https://testnetexplorer.diamante.io/about-tx-hash/${item.transactionHash}`
                  : "#"; // Fallback link

              return (
                <div
                  key={index}
                  className={`text-[#f1f1f1c0] w-full min-w-[800px] md:min-w-full flex gap-2 items-start ${
                    index == transactions.length - 1 ? "" : "border-b"
                  } border-[#31373F46] py-2 hover:bg-[#14191F50] transition-all duration-300 cursor-pointer`}
                  onClick={() => (window.location.href = link)} // Navigate to the link
                >
                  <div className="w-[5%] min-w-[40px] truncate text-black">
                    <p className="text-center">{index + 1}</p>
                  </div>
                  <div className="w-[15%] min-w-[150px] truncate text-black">
                    <p>{item.toUser.userId}</p>
                  </div>
                  <div className="w-[40%] min-w-[350px] truncate text-black">
                    <p>{item.transactionHash}</p>
                  </div>
                  <div className="w-[10%] min-w-[100px] truncate text-black">
                    <p>{item.event.eventType}</p>
                  </div>
                  <div className="w-[10%] min-w-[100px] flex items-center truncate text-black">
                    <p>
                      {item.game.name} ({item.game.type})
                    </p>
                  </div>
                  <div className="w-[10%] min-w-[100px] flex items-center truncate text-black">
                    <p>{item.event.eventId}</p>
                  </div>
                  <div className="w-[10%] min-w-[100px] flex items-center truncate text-black">
                    <p>success</p>
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
