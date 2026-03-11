import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/dashboard";
import CardMaintenance from "@/pages/card-maintenance";
import CardDetails from "@/pages/card-details";
import NotFound from "@/pages/not-found";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/manage/card-maintenance" element={<CardMaintenance />} />
      <Route path="/manage/card-maintenance/:id" element={<CardDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
