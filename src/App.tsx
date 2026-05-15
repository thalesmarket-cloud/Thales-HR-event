import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LeadForm } from "./components/LeadForm";
import { AdminDashboard } from "./components/AdminDashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-[#1B3769] flex items-center justify-center p-4">
            <main className="w-full">
              <LeadForm />
            </main>
          </div>
        } />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

