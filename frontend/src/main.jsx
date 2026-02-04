import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MyOrders from "./pages/MyOrders";
import AddEditOrder from "./pages/AddEditOrder";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/my-orders" />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/add-order" element={<AddEditOrder />} />
        <Route path="/add-order/:id" element={<AddEditOrder />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
