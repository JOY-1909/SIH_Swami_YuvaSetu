// import React, { useState, useEffect } from "react";
// import { IndiaMap } from "@vishalvoid/react-india-map";
// import { API_BASE_URL } from "@/services/api";

// interface StateStats {
//   name: string;
//   companies: number;
//   hiredInternships: number;
//   pmInternships: number;
//   activeInternships: number;
//   studentsHired: number;
// }



// interface StateStatsMap {
//   [key: string]: StateStats;
// }



// interface StateSummary {
//   total_companies: number;
//   total_internships: number;
//   active_internships: number;
//   closed_internships: number;
//   pm_internships: number;
//   total_applications: number;
//   students_hired: number;
// }



// // Initialize EMPTY state data (no static data)
// const initializeEmptyStateStats = (): StateStatsMap => {
//   const stateCodes = [
//     "IN-AN", "IN-AP", "IN-AR", "IN-AS", "IN-BR", "IN-CH", "IN-CT", "IN-DD",
//     "IN-DL", "IN-DN", "IN-GA", "IN-GJ", "IN-HP", "IN-HR", "IN-JH", "IN-JK",
//     "IN-KA", "IN-KL", "IN-LD", "IN-MP", "IN-MH", "IN-ML", "IN-MN", "IN-MZ",
//     "IN-NL", "IN-OR", "IN-PB", "IN-PY", "IN-RJ", "IN-SK", "IN-TN", "IN-TG",
//     "IN-TR", "IN-UP", "IN-UT", "IN-WB"
//   ];
  
//   const stateNames: { [key: string]: string } = {
//     "IN-AN": "Andaman & Nicobar", "IN-AP": "Andhra Pradesh", "IN-AR": "Arunachal Pradesh",
//     "IN-AS": "Assam", "IN-BR": "Bihar", "IN-CH": "Chandigarh", "IN-CT": "Chhattisgarh",
//     "IN-DD": "Daman & Diu", "IN-DL": "Delhi", "IN-DN": "Dadra & Nagar Haveli",
//     "IN-GA": "Goa", "IN-GJ": "Gujarat", "IN-HP": "Himachal Pradesh", "IN-HR": "Haryana",
//     "IN-JH": "Jharkhand", "IN-JK": "Jammu & Kashmir", "IN-KA": "Karnataka", "IN-KL": "Kerala",
//     "IN-LD": "Lakshadweep", "IN-MP": "Madhya Pradesh", "IN-MH": "Maharashtra", "IN-ML": "Meghalaya",
//     "IN-MN": "Manipur", "IN-MZ": "Mizoram", "IN-NL": "Nagaland", "IN-OR": "Odisha",
//     "IN-PB": "Punjab", "IN-PY": "Puducherry", "IN-RJ": "Rajasthan", "IN-SK": "Sikkim",
//     "IN-TN": "Tamil Nadu", "IN-TG": "Telangana", "IN-TR": "Tripura", "IN-UP": "Uttar Pradesh",
//     "IN-UT": "Uttarakhand", "IN-WB": "West Bengal"
//   };



//   const emptyStats: StateStatsMap = {};
//   stateCodes.forEach(code => {
//     emptyStats[code] = {
//       name: stateNames[code],
//       companies: 0,
//       hiredInternships: 0,
//       pmInternships: 0,
//       activeInternships: 0,
//       studentsHired: 0
//     };
//   });
  
//   return emptyStats;
// };



// export const IndiaInternshipMap: React.FC = () => {
//   const [activeStateId, setActiveStateId] = useState("IN-MH");
//   const [stateStats, setStateStats] = useState<StateStatsMap>(initializeEmptyStateStats());
//   const [summary, setSummary] = useState<StateSummary | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
//   const [isDatabaseEmpty, setIsDatabaseEmpty] = useState<boolean>(true);



//   // CHANGE THIS TO YOUR BACKEND URL



//   // Fetch REAL-TIME data from MongoDB
//   const fetchLiveData = async () => {
//     try {
//       setLoading(true);
//       setError(null);



//       console.log("🔄 Fetching REAL-TIME data from MongoDB...");



//       // Fetch state statistics
//       const stateResponse = await fetch(`${API_BASE_URL}/api/v1/map/state-statistics`);
      
//       if (!stateResponse.ok) {
//         throw new Error(`Backend returned ${stateResponse.status}`);
//       }
      
//       const stateData = await stateResponse.json();
      
//       // Check if database has any data
//       const hasData = Object.values(stateData.stateStats).some(
//         (stats: any) => stats.companies > 0 || stats.activeInternships > 0
//       );
      
//       setIsDatabaseEmpty(!hasData);
//       setStateStats(stateData.stateStats);
      
//       if (hasData) {
//         console.log("✅ Using LIVE data from MongoDB database");
//       } else {
//         console.log("⚠️ Database is empty - showing zero values");
//       }



//       // Fetch summary statistics
//       const summaryResponse = await fetch(`${API_BASE_URL}/api/v1/map/statistics-summary`);
      
//       if (summaryResponse.ok) {
//         const summaryData = await summaryResponse.json();
//         setSummary(summaryData);
//       }



//       setLastUpdated(new Date());
//       setError(null);
//       setLoading(false);
//     } catch (err) {
//       console.error("❌ Error fetching data:", err);
//       setError("Cannot connect to backend. Please ensure the backend server is running.");
//       setLoading(false);
//     }
//   };



//   // Auto-refresh every 30 seconds for real-time updates
//   useEffect(() => {
//     fetchLiveData();
    
//     const interval = setInterval(fetchLiveData, 30000);
    
//     return () => clearInterval(interval);
//   }, []);



//   const selectedStats = stateStats[activeStateId] || {
//     name: "State",
//     companies: 0,
//     hiredInternships: 0,
//     pmInternships: 0,
//     activeInternships: 0,
//     studentsHired: 0
//   };



//   // Prepare data for map component
//   const mapData = Object.keys(stateStats).map(id => ({
//     id,
//     customData: stateStats[id]
//   }));



//   // Loading state
//   if (loading && !lastUpdated) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         <div className="bg-white rounded-2xl shadow-2xl p-10 backdrop-blur-sm border border-gray-100">
//           <div className="flex flex-col items-center">
//             <div className="relative">
//               <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
//               <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-300 opacity-20"></div>
//             </div>
//             <p className="text-xl text-gray-800 font-semibold">Loading Real-Time Data...</p>
//             <p className="text-sm text-gray-500 mt-2 animate-pulse">Connecting to MongoDB database</p>
//           </div>
//         </div>
//       </div>
//     );
//   }



//   // Error state
//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
//         <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md border border-red-100">
//           <div className="flex flex-col items-center">
//             <div className="text-red-500 mb-4 animate-bounce">
//               <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <p className="text-2xl text-red-600 font-bold mb-2">Backend Connection Error</p>
//             <p className="text-gray-600 text-center mb-6">{error}</p>
//             <button
//               onClick={fetchLiveData}
//               className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//             >
//               Retry Connection
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }



//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
//       {/* Custom CSS for map hover effects */}
//       <style jsx>{`
//         .india-map-container :global(svg path) {
//           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//           filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
//         }
        
//         .india-map-container :global(svg path:hover) {
//           transform: scale(1.05);
//           filter: drop-shadow(0 10px 20px rgba(79, 70, 229, 0.3)) 
//                   drop-shadow(0 6px 6px rgba(79, 70, 229, 0.2));
//           stroke-width: 2;
//         }
//       `}</style>

//       {/* Database Status Banner */}
//       {isDatabaseEmpty && (
//         <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-md backdrop-blur-sm">
//           <div className="flex items-center gap-3">
//             <div className="text-yellow-600 text-2xl">⚠️</div>
//             <div className="text-yellow-800">
//               <p className="font-bold text-lg">Database is Empty</p>
//               <p className="text-sm mt-1">The map will automatically update when employers add internships to the database.</p>
//             </div>
//           </div>
//         </div>
//       )}



//       {/* Summary Statistics */}
//       {summary && (
//         <div className="mb-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//             <div>
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//                 India Internship Overview
//               </h2>
//               <div className="flex items-center gap-2 mt-2">
//                 <span className="relative flex h-3 w-3">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                 </span>
//                 <p className="text-sm font-medium text-green-600">LIVE DATA from MongoDB</p>
//               </div>
//             </div>
//             {lastUpdated && (
//               <div className="text-right">
//                 <p className="text-sm text-gray-600 mb-2">
//                   Last updated: <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
//                 </p>
//                 <button
//                   onClick={fetchLiveData}
//                   disabled={loading}
//                   className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
//                 >
//                   {loading ? "Refreshing..." : "🔄 Refresh Now"}
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//             <SummaryCard label="Total Companies" value={summary.total_companies} color="blue" />
//             <SummaryCard label="Total Internships" value={summary.total_internships} color="indigo" />
//             <SummaryCard label="Active Internships" value={summary.active_internships} color="green" />
//             <SummaryCard label="Closed Internships" value={summary.closed_internships} color="gray" />
//             <SummaryCard label="PM Internships" value={summary.pm_internships} color="purple" />
//             <SummaryCard label="Total Applications" value={summary.total_applications} color="yellow" />
//             <SummaryCard label="Students Hired" value={summary.students_hired} color="red" />
//           </div>
//         </div>
//       )}



//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row gap-8">
//         {/* India Map Section */}
//         <div className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100">
//           <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Dynamic India Internship Map
//           </h1>
//           <p className="text-center text-gray-600 mb-8 text-sm">
//             <span className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
//               <span className="text-indigo-600">👆</span>
//               Hover over any state to view detailed statistics • Auto-updates every 30 seconds
//             </span>
//           </p>
//           <div className="india-map-container flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-inner">
//             <IndiaMap
//               data={mapData}
//               hoverColor="#6366F1"
//               activeStateId={activeStateId}
//               onStateHover={setActiveStateId}
//             />
//           </div>
//         </div>



//         {/* Right-side Stats Card */}
//         <div className="lg:w-96 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Selected State</h2>
//             {loading && (
//               <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-200 border-t-indigo-600"></div>
//             )}
//           </div>
//           <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
//             {selectedStats.name}
//           </h3>



//           <div className="space-y-4">
//             <StatItem
//               label="Companies providing internships"
//               value={selectedStats.companies}
//               icon="🏢"
//             />
//             <StatItem
//               label="Hired internships"
//               value={selectedStats.hiredInternships}
//               icon="✅"
//             />
//             <StatItem
//               label="PM internships"
//               value={selectedStats.pmInternships}
//               icon="🏛️"
//             />
//             <StatItem
//               label="Active internships"
//               value={selectedStats.activeInternships}
//               icon="🔥"
//             />
//             <StatItem
//               label="Students hired"
//               value={selectedStats.studentsHired}
//               icon="🎓"
//             />
//           </div>



//           <div className="mt-10 pt-6 border-t border-gray-200">
//             <p className="text-sm text-gray-600 italic text-center font-medium">
//               "Expert in anything, was once a beginner"
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// // Helper Components
// interface SummaryCardProps {
//   label: string;
//   value: number;
//   color: string;
// }



// const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => {
//   const colorClasses: { [key: string]: string } = {
//     blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200",
//     indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200",
//     green: "bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-200",
//     gray: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 hover:from-gray-100 hover:to-gray-200",
//     purple: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:from-purple-100 hover:to-purple-200",
//     yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200",
//     red: "bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200 hover:from-red-100 hover:to-red-200",
//   };



//   return (
//     <div className={`p-5 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${colorClasses[color]}`}>
//       <p className="text-xs font-bold mb-2 uppercase tracking-wide opacity-80">{label}</p>
//       <p className="text-3xl font-extrabold">{value.toLocaleString()}</p>
//     </div>
//   );
// };



// interface StatItemProps {
//   label: string;
//   value: number;
//   icon?: string;
// }



// const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
//   return (
//     <div className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-102 border border-gray-100">
//       <div className="flex items-center gap-3">
//         {icon && <span className="text-3xl filter drop-shadow-sm">{icon}</span>}
//         <span className="text-sm text-gray-700 font-medium">{label}</span>
//       </div>
//       <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//         {value}
//       </span>
//     </div>
//   );
// };



// export default IndiaInternshipMap;



import React, { useState } from "react";
import { IndiaMap } from "@vishalvoid/react-india-map";

// =========================================================================
// TYPES
// =========================================================================

interface StateStats {
  name: string;
  companies: number;
  hiredInternships: number;
  pmInternships: number;
  activeInternships: number;
  studentsHired: number;
}

interface StateStatsMap {
  [key: string]: StateStats;
}

interface StateSummary {
  total_companies: number;
  total_internships: number;
  active_internships: number;
  closed_internships: number;
  pm_internships: number;
  total_applications: number;
  students_hired: number;
}

// =========================================================================
// DUMMY DATA (Comprehensive Data for all 36 States/UTs)
// =========================================================================

const DUMMY_SUMMARY: StateSummary = {
  total_companies: 1550,
  total_internships: 6890,
  active_internships: 4120,
  closed_internships: 2770,
  pm_internships: 850,
  total_applications: 25000,
  students_hired: 3600,
};

/**
 * Generates comprehensive dummy statistics for all 36 States and Union Territories.
 * This ensures the map is fully colored and all state panels show non-zero data.
 */
const generateComprehensiveDummyStats = (): StateStatsMap => {
  const stateCodes = [
    "IN-AN", "IN-AP", "IN-AR", "IN-AS", "IN-BR", "IN-CH", "IN-CT", "IN-DD",
    "IN-DL", "IN-DN", "IN-GA", "IN-GJ", "IN-HP", "IN-HR", "IN-JH", "IN-JK", // JK is now UT, map comp. uses IN-JK
    "IN-KA", "IN-KL", "IN-LD", "IN-MP", "IN-MH", "IN-ML", "IN-MN", "IN-MZ",
    "IN-NL", "IN-OR", "IN-PB", "IN-PY", "IN-RJ", "IN-SK", "IN-TN", "IN-TG",
    "IN-TR", "IN-UP", "IN-UT", "IN-WB"
  ];
  
  const stateNames: { [key: string]: string } = {
    "IN-AN": "Andaman & Nicobar", "IN-AP": "Andhra Pradesh", "IN-AR": "Arunachal Pradesh",
    "IN-AS": "Assam", "IN-BR": "Bihar", "IN-CH": "Chandigarh", "IN-CT": "Chhattisgarh",
    "IN-DD": "Daman & Diu", "IN-DL": "Delhi", "IN-DN": "Dadra & Nagar Haveli",
    "IN-GA": "Goa", "IN-GJ": "Gujarat", "IN-HP": "Himachal Pradesh", "IN-HR": "Haryana",
    "IN-JH": "Jharkhand", "IN-JK": "Jammu & Kashmir", // Kept for map compatibility
    "IN-KA": "Karnataka", "IN-KL": "Kerala", "IN-LD": "Lakshadweep", "IN-MP": "Madhya Pradesh",
    "IN-MH": "Maharashtra", "IN-ML": "Meghalaya", "IN-MN": "Manipur", "IN-MZ": "Mizoram",
    "IN-NL": "Nagaland", "IN-OR": "Odisha", "IN-PB": "Punjab", "IN-PY": "Puducherry",
    "IN-RJ": "Rajasthan", "IN-SK": "Sikkim", "IN-TN": "Tamil Nadu", "IN-TG": "Telangana",
    "IN-TR": "Tripura", "IN-UP": "Uttar Pradesh", "IN-UT": "Uttarakhand", "IN-WB": "West Bengal"
  };

  const stats: StateStatsMap = {};
  stateCodes.forEach((code, index) => {
    // Generate unique, non-zero dummy data based on index (1 to 36)
    const base = index + 1; 
    const multiplier = Math.round(base / 3);
    
    // Default values for smaller states/UTs
    stats[code] = {
      name: stateNames[code],
      companies: 5 + base * 2,
      hiredInternships: 10 + base * 4,
      pmInternships: 1 + multiplier,
      activeInternships: 5 + base * 3,
      studentsHired: 7 + base * 3,
    };
    
    // Override key states with realistic, higher activity data
    if (code === "IN-MH") { // Maharashtra (Mumbai/Pune)
        stats[code].companies = 180;
        stats[code].hiredInternships = 450;
        stats[code].activeInternships = 300;
        stats[code].pmInternships = 75;
        stats[code].studentsHired = 350;
    } else if (code === "IN-KA") { // Karnataka (Bengaluru)
        stats[code].companies = 150;
        stats[code].hiredInternships = 400;
        stats[code].activeInternships = 270;
        stats[code].pmInternships = 60;
        stats[code].studentsHired = 320;
    } else if (code === "IN-DL") { // Delhi
        stats[code].companies = 100;
        stats[code].hiredInternships = 250;
        stats[code].activeInternships = 180;
        stats[code].pmInternships = 40;
        stats[code].studentsHired = 200;
    } else if (code === "IN-TG") { // Telangana (Hyderabad)
        stats[code].companies = 90;
        stats[code].hiredInternships = 230;
        stats[code].activeInternships = 160;
        stats[code].pmInternships = 35;
        stats[code].studentsHired = 190;
    } else if (code === "IN-TN") { // Tamil Nadu (Chennai)
        stats[code].companies = 80;
        stats[code].hiredInternships = 200;
        stats[code].activeInternships = 140;
        stats[code].pmInternships = 30;
        stats[code].studentsHired = 170;
    } else if (code === "IN-HR") { // Haryana (Gurgaon/Noida)
        stats[code].companies = 75;
        stats[code].hiredInternships = 190;
        stats[code].activeInternships = 130;
        stats[code].pmInternships = 28;
        stats[code].studentsHired = 150;
    } else if (code === "IN-GJ") { // Gujarat (Ahmedabad/Surat)
        stats[code].companies = 65;
        stats[code].hiredInternships = 170;
        stats[code].activeInternships = 110;
        stats[code].pmInternships = 25;
        stats[code].studentsHired = 130;
    }
  });
  
  return stats;
};

const DUMMY_STATE_STATS = generateComprehensiveDummyStats();


// =========================================================================
// HELPER COMPONENTS (SummaryCard and StatItem remain unchanged)
// =========================================================================

interface SummaryCardProps {
  label: string;
  value: number;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => {
  const colorClasses: { [key: string]: string } = {
    blue: "bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 border-blue-200 hover:from-blue-100 hover:to-blue-200",
    indigo: "bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-200 hover:from-indigo-100 hover:to-indigo-200",
    green: "bg-gradient-to-br from-green-50 to-green-100 text-green-800 border-green-200 hover:from-green-100 hover:to-green-200",
    gray: "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 border-gray-200 hover:from-gray-100 hover:to-gray-200",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100 text-purple-800 border-purple-200 hover:from-purple-100 hover:to-purple-200",
    yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-200 hover:from-yellow-100 hover:to-yellow-200",
    red: "bg-gradient-to-br from-red-50 to-red-100 text-red-800 border-red-200 hover:from-red-100 hover:to-red-200",
  };

  return (
    <div className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer min-w-0 ${colorClasses[color]}`}>
      <p className="text-[10px] sm:text-xs font-bold mb-1 sm:mb-2 uppercase tracking-wide opacity-80 break-words line-clamp-2">{label}</p>
      <p className="text-xl sm:text-2xl md:text-3xl font-extrabold break-words">{value.toLocaleString()}</p>
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: number;
  icon?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, icon }) => {
  return (
    <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-102 border border-gray-100 min-w-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        {icon && <span className="text-2xl sm:text-3xl filter drop-shadow-sm flex-shrink-0">{icon}</span>}
        <span className="text-xs sm:text-sm text-gray-700 font-medium break-words line-clamp-2">{label}</span>
      </div>
      <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex-shrink-0 ml-2">
        {value}
      </span>
    </div>
  );
};


// =========================================================================
// MAIN COMPONENT
// =========================================================================

export const IndiaInternshipMap: React.FC = () => {
  // Initialized with comprehensive dummy data and no loading/error
  const [activeStateId, setActiveStateId] = useState("IN-MH");
  const [stateStats] = useState<StateStatsMap>(DUMMY_STATE_STATS);
  const [summary] = useState<StateSummary | null>(DUMMY_SUMMARY);
  const [loading] = useState<boolean>(false);
  const [isDatabaseEmpty] = useState<boolean>(false); // Set to false as data exists
  
  // Manual last updated time
  const [lastUpdated] = useState<Date>(new Date());
  
  // Dummy refresh function for the button
  const dummyRefresh = () => {
    console.log("Using static dummy data. Refresh button is disabled for mock mode.");
    // In a real application, you would call your fetchLiveData here.
  };

  // Fallback state is no longer strictly needed but kept for safety, defaulting to Maharashtra
  const selectedStats = stateStats[activeStateId] || DUMMY_STATE_STATS["IN-MH"];

  // Prepare data for map component:
  const mapData = Object.keys(stateStats).map(id => ({
    id,
    customData: stateStats[id]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-3 sm:p-4 md:p-6 overflow-x-hidden w-full">
      {/* Custom CSS for map hover effects */}
      <style jsx>{`
        .india-map-container :global(svg) {
          width: 100%;
          height: auto;
          max-width: 100%;
          overflow: visible;
        }
        
        .india-map-container :global(svg path) {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        
        .india-map-container :global(svg path:hover) {
          transform: scale(1.005);
          filter: drop-shadow(0 5px 10px rgba(79, 70, 229, 0.3)) 
                  drop-shadow(0 3px 3px rgba(79, 70, 229, 0.2));
          stroke-width: 2;
        }
        
        @media (max-width: 640px) {
          .india-map-container :global(svg) {
            transform: scale(0.85);
            transform-origin: center;
          }
        }
        
        @media (max-width: 480px) {
          .india-map-container :global(svg) {
            transform: scale(0.75);
            transform-origin: center;
          }
        }
      `}</style>

      {/* Database Status Banner (Will only show if DUMMY_STATE_STATS had no data) */}
      {isDatabaseEmpty && (
        <div className="mb-4 sm:mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-md backdrop-blur-sm w-full">
          <div className="flex items-start sm:items-center gap-2 sm:gap-3">
            <div className="text-yellow-600 text-xl sm:text-2xl flex-shrink-0">⚠️</div>
            <div className="text-yellow-800 min-w-0 flex-1">
              <p className="font-bold text-sm sm:text-base md:text-lg break-words">Database is Empty</p>
              <p className="text-xs sm:text-sm mt-1 break-words">The map will automatically update when employers add internships to the database.</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {summary && (
        <div className="mb-6 sm:mb-8 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-100 w-full overflow-x-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent break-words">
                India Internship Overview
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="relative flex h-3 w-3 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-xs sm:text-sm font-medium text-green-600 break-words">DUMMY DATA - Displaying Mock Values for all States/UTs</p>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-left md:text-right w-full md:w-auto">
                <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">
                  Last updated: <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
                </p>
                <button
                  onClick={dummyRefresh}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 w-full sm:w-auto"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh Now (Mock)"}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4 min-w-0">
            <SummaryCard label="Total Companies" value={summary.total_companies} color="blue" />
            <SummaryCard label="Total Internships" value={summary.total_internships} color="indigo" />
            <SummaryCard label="Active Internships" value={summary.active_internships} color="green" />
            <SummaryCard label="Closed Internships" value={summary.closed_internships} color="gray" />
            <SummaryCard label="PM Internships" value={summary.pm_internships} color="purple" />
            <SummaryCard label="Total Applications" value={summary.total_applications} color="yellow" />
            <SummaryCard label="Students Hired" value={summary.students_hired} color="red" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8 w-full">
        {/* India Map Section - **Proper Map Layout with Data** */}
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-gray-100 w-full overflow-x-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent break-words px-2">
            Dynamic India Internship Map
          </h1>
          <p className="text-center text-gray-600 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm px-2">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-indigo-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full break-words">
              <span className="text-indigo-600 flex-shrink-0">👆</span>
              <span className="hidden sm:inline">Hover over any state to view detailed statistics • Click state to select it</span>
              <span className="sm:hidden">Tap any state for details</span>
            </span>
          </p>
          <div className="india-map-container flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-inner w-full overflow-x-auto">
            <div className="w-full max-w-full overflow-x-auto flex justify-center">
              <IndiaMap
                data={mapData}
                hoverColor="#6366F1" // Primary color on hover
                activeStateId={activeStateId}
                onStateHover={setActiveStateId}
                // Custom color function based on Active Internships for visualization
                colorScale={(data) => {
                  const active = data?.customData?.activeInternships || 0;
                  // Scale based on max dummy value (~300 for IN-MH)
                  if (active > 200) return "#1a207e"; // Deep Blue
                  if (active > 100) return "#4247ad"; // Medium Blue
                  if (active > 0) return "#8c94e0"; // Light Blue
                  return "#cccccc"; // Default gray for zero data (shouldn't happen with comprehensive data)
                }}
              />
            </div>
          </div>
        </div>

        {/* Right-side Stats Card - **Reflecting Dummy Data** */}
        <div className="lg:w-96 w-full bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider break-words">Selected State</h2>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-indigo-200 border-t-indigo-600 flex-shrink-0"></div>
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 sm:mb-8 md:mb-10 break-words">
            {selectedStats.name}
          </h3>

          <div className="space-y-3 sm:space-y-4">
            <StatItem
              label="Companies providing internships"
              value={selectedStats.companies}
              icon="🏢"
            />
            <StatItem
              label="Hired internships"
              value={selectedStats.hiredInternships}
              icon="✅"
            />
            <StatItem
              label="PM internships"
              value={selectedStats.pmInternships}
              icon="🏛️"
            />
            <StatItem
              label="Active internships"
              value={selectedStats.activeInternships}
              icon="🔥"
            />
            <StatItem
              label="Students hired"
              value={selectedStats.studentsHired}
              icon="🎓"
            />
          </div>

          <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 italic text-center font-medium break-words">
              "Expert in anything, was once a beginner"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaInternshipMap;
