import React, { useState, useEffect } from "react";
import { IndiaMap } from "@vishalvoid/react-india-map";
import { API_BASE_URL } from "@/services/api";

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



// Initialize EMPTY state data (no static data)
const initializeEmptyStateStats = (): StateStatsMap => {
  const stateCodes = [
    "IN-AN", "IN-AP", "IN-AR", "IN-AS", "IN-BR", "IN-CH", "IN-CT", "IN-DD",
    "IN-DL", "IN-DN", "IN-GA", "IN-GJ", "IN-HP", "IN-HR", "IN-JH", "IN-JK",
    "IN-KA", "IN-KL", "IN-LD", "IN-MP", "IN-MH", "IN-ML", "IN-MN", "IN-MZ",
    "IN-NL", "IN-OR", "IN-PB", "IN-PY", "IN-RJ", "IN-SK", "IN-TN", "IN-TG",
    "IN-TR", "IN-UP", "IN-UT", "IN-WB"
  ];
  
  const stateNames: { [key: string]: string } = {
    "IN-AN": "Andaman & Nicobar", "IN-AP": "Andhra Pradesh", "IN-AR": "Arunachal Pradesh",
    "IN-AS": "Assam", "IN-BR": "Bihar", "IN-CH": "Chandigarh", "IN-CT": "Chhattisgarh",
    "IN-DD": "Daman & Diu", "IN-DL": "Delhi", "IN-DN": "Dadra & Nagar Haveli",
    "IN-GA": "Goa", "IN-GJ": "Gujarat", "IN-HP": "Himachal Pradesh", "IN-HR": "Haryana",
    "IN-JH": "Jharkhand", "IN-JK": "Jammu & Kashmir", "IN-KA": "Karnataka", "IN-KL": "Kerala",
    "IN-LD": "Lakshadweep", "IN-MP": "Madhya Pradesh", "IN-MH": "Maharashtra", "IN-ML": "Meghalaya",
    "IN-MN": "Manipur", "IN-MZ": "Mizoram", "IN-NL": "Nagaland", "IN-OR": "Odisha",
    "IN-PB": "Punjab", "IN-PY": "Puducherry", "IN-RJ": "Rajasthan", "IN-SK": "Sikkim",
    "IN-TN": "Tamil Nadu", "IN-TG": "Telangana", "IN-TR": "Tripura", "IN-UP": "Uttar Pradesh",
    "IN-UT": "Uttarakhand", "IN-WB": "West Bengal"
  };



  const emptyStats: StateStatsMap = {};
  stateCodes.forEach(code => {
    emptyStats[code] = {
      name: stateNames[code],
      companies: 0,
      hiredInternships: 0,
      pmInternships: 0,
      activeInternships: 0,
      studentsHired: 0
    };
  });
  
  return emptyStats;
};



export const IndiaInternshipMap: React.FC = () => {
  const [activeStateId, setActiveStateId] = useState("IN-MH");
  const [stateStats, setStateStats] = useState<StateStatsMap>(initializeEmptyStateStats());
  const [summary, setSummary] = useState<StateSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isDatabaseEmpty, setIsDatabaseEmpty] = useState<boolean>(true);



  // CHANGE THIS TO YOUR BACKEND URL



  // Fetch REAL-TIME data from MongoDB
  const fetchLiveData = async () => {
    try {
      setLoading(true);
      setError(null);



      console.log("🔄 Fetching REAL-TIME data from MongoDB...");



      // Fetch state statistics
      const stateResponse = await fetch(`${API_BASE_URL}/api/v1/map/state-statistics`);
      
      if (!stateResponse.ok) {
        throw new Error(`Backend returned ${stateResponse.status}`);
      }
      
      const stateData = await stateResponse.json();
      
      // Check if database has any data
      const hasData = Object.values(stateData.stateStats).some(
        (stats: any) => stats.companies > 0 || stats.activeInternships > 0
      );
      
      setIsDatabaseEmpty(!hasData);
      setStateStats(stateData.stateStats);
      
      if (hasData) {
        console.log("✅ Using LIVE data from MongoDB database");
      } else {
        console.log("⚠️ Database is empty - showing zero values");
      }



      // Fetch summary statistics
      const summaryResponse = await fetch(`${API_BASE_URL}/api/v1/map/statistics-summary`);
      
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }



      setLastUpdated(new Date());
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Cannot connect to backend. Please ensure the backend server is running.");
      setLoading(false);
    }
  };



  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    fetchLiveData();
    
    const interval = setInterval(fetchLiveData, 30000);
    
    return () => clearInterval(interval);
  }, []);



  const selectedStats = stateStats[activeStateId] || {
    name: "State",
    companies: 0,
    hiredInternships: 0,
    pmInternships: 0,
    activeInternships: 0,
    studentsHired: 0
  };



  // Prepare data for map component
  const mapData = Object.keys(stateStats).map(id => ({
    id,
    customData: stateStats[id]
  }));



  // Loading state
  if (loading && !lastUpdated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="bg-white rounded-2xl shadow-2xl p-10 backdrop-blur-sm border border-gray-100">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-indigo-300 opacity-20"></div>
            </div>
            <p className="text-xl text-gray-800 font-semibold">Loading Real-Time Data...</p>
            <p className="text-sm text-gray-500 mt-2 animate-pulse">Connecting to MongoDB database</p>
          </div>
        </div>
      </div>
    );
  }



  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md border border-red-100">
          <div className="flex flex-col items-center">
            <div className="text-red-500 mb-4 animate-bounce">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl text-red-600 font-bold mb-2">Backend Connection Error</p>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <button
              onClick={fetchLiveData}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Custom CSS for map hover effects */}
      <style jsx>{`
        .india-map-container :global(svg path) {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }
        
        .india-map-container :global(svg path:hover) {
          transform: scale(1.05);
          filter: drop-shadow(0 10px 20px rgba(79, 70, 229, 0.3)) 
                  drop-shadow(0 6px 6px rgba(79, 70, 229, 0.2));
          stroke-width: 2;
        }
      `}</style>

      {/* Database Status Banner */}
      {isDatabaseEmpty && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-5 rounded-xl shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600 text-2xl">⚠️</div>
            <div className="text-yellow-800">
              <p className="font-bold text-lg">Database is Empty</p>
              <p className="text-sm mt-1">The map will automatically update when employers add internships to the database.</p>
            </div>
          </div>
        </div>
      )}



      {/* Summary Statistics */}
      {summary && (
        <div className="mb-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                India Internship Overview
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="text-sm font-medium text-green-600">LIVE DATA from MongoDB</p>
              </div>
            </div>
            {lastUpdated && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-2">
                  Last updated: <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
                </p>
                <button
                  onClick={fetchLiveData}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  {loading ? "Refreshing..." : "🔄 Refresh Now"}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
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
      <div className="flex flex-col lg:flex-row gap-8">
        {/* India Map Section */}
        <div className="flex-1 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-gray-100">
          <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Dynamic India Internship Map
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm">
            <span className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
              <span className="text-indigo-600">👆</span>
              Hover over any state to view detailed statistics • Auto-updates every 30 seconds
            </span>
          </p>
          <div className="india-map-container flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-inner">
            <IndiaMap
              data={mapData}
              hoverColor="#6366F1"
              activeStateId={activeStateId}
              onStateHover={setActiveStateId}
            />
          </div>
        </div>



        {/* Right-side Stats Card */}
        <div className="lg:w-96 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Selected State</h2>
            {loading && (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-200 border-t-indigo-600"></div>
            )}
          </div>
          <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
            {selectedStats.name}
          </h3>



          <div className="space-y-4">
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



          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic text-center font-medium">
              "Expert in anything, was once a beginner"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};



// Helper Components
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
    <div className={`p-5 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${colorClasses[color]}`}>
      <p className="text-xs font-bold mb-2 uppercase tracking-wide opacity-80">{label}</p>
      <p className="text-3xl font-extrabold">{value.toLocaleString()}</p>
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
    <div className="flex justify-between items-center p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-102 border border-gray-100">
      <div className="flex items-center gap-3">
        {icon && <span className="text-3xl filter drop-shadow-sm">{icon}</span>}
        <span className="text-sm text-gray-700 font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        {value}
      </span>
    </div>
  );
};



export default IndiaInternshipMap;
