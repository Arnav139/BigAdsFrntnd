import React from 'react'
import DashboardHome from './DashboardHome'

const Analytics = () => {
  return (
    <div>
      <DashboardHome/>
    </div>
  )
}

export default Analytics


// import React from 'react';

// const Analytics = () => {
//   return (
//     <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
//       {/* Dashboard Header
//       <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Dashboard</h1> */}

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         {/* Current Users */}
//         <div className="bg-indigo-100 rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg text-gray-900 font-semibold mb-2">Current Users</h2>
//           <p className="text-4xl font-bold text-indigo-800">110</p>
//         </div>

//         {/* Current Transactions */}
//         <div className="bg-indigo-100 rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg text-gray-900 font-semibold mb-2">Current Transactions</h2>
//           <p className="text-4xl font-bold text-indigo-800">150</p>
//         </div>

//         {/* Current Games */}
//         <div className="bg-indigo-100 rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg text-gray-900 font-semibold mb-2">Current Games</h2>
//           <p className="text-4xl font-bold text-indigo-800">21</p>
//         </div>

//         {/* Current Events */}
//         <div className="bg-indigo-100 rounded-lg p-6 shadow-lg">
//           <h2 className="text-lg text-gray-900 font-semibold mb-2">Current Events</h2>
//           <p className="text-4xl font-bold text-indigo-800">33</p>
//         </div>
//       </div>

//       {/* Middle Section Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
//         {/* Coming Soon Section */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
//           <p className="text-gray-500">Exciting new features are on the way!</p>
//         </div>

//         {/* Transaction Analytics Section */}
//         <div className="bg-white rounded-lg p-6 shadow-lg">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-900">Transaction Analytics</h2>
//             <button className="text-indigo-800 hover:text-indigo-600">View All</button>
//           </div>

//           {/* Progress Bars */}
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-900">Polygon</span>
//                 <span className="text-gray-500">25%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-indigo-800 h-2.5 rounded-full" style={{ width: '25%' }}></div>
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between mb-1">
//                 <span className="text-gray-900">Diamante</span>
//                 <span className="text-gray-500">75%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transaction Table Section */}
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="p-6 flex justify-between items-center">
//           <h2 className="text-2xl font-bold text-gray-900">Transaction Analytics</h2>
//           <div className="space-x-2">
//             <button className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-600">
//               Filter
//             </button>
//             <button className="bg-indigo-800 text-white px-4 py-2 rounded hover:bg-indigo-600">
//               Download CSV
//             </button>
//           </div>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-indigo-800">
//               <tr>
//                 <th className="px-6 py-3 text-left text-white">Sl.No</th>
//                 <th className="px-6 py-3 text-left text-white">Player</th>
//                 <th className="px-6 py-3 text-left text-white">Transaction Hash</th>
//                 <th className="px-6 py-3 text-left text-white">Event Type</th>
//                 <th className="px-6 py-3 text-left text-white">Game</th>
//                 <th className="px-6 py-3 text-left text-white">Event ID</th>
//                 <th className="px-6 py-3 text-left text-white">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               <tr className="hover:bg-gray-100">
//                 <td className="px-6 py-4 text-gray-900">1</td>
//                 <td className="px-6 py-4 text-gray-900">user_LFFCQIVX</td>
//                 <td className="px-6 py-4 text-gray-900">0x3c1dc80bf2bd21e3c83adbee59b864e482f94ed9a359d4e475</td>
//                 <td className="px-6 py-4 text-gray-900">Creative Mode</td>
//                 <td className="px-6 py-4 text-gray-900">Fortnite Galaxy</td>
//                 <td className="px-6 py-4 text-gray-900">event_KREJID7</td>
//                 <td className="px-6 py-4 text-green-500">success</td>
//               </tr>
//               {/* Add more rows as needed */}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analytics;