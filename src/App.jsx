import { useEffect, useState } from "react";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardMobile from "./pages/dashboard/DashboardMobile";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <DashboardMobile /> : <Dashboard />;
}