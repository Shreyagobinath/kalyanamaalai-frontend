import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/protectedroute";
import Register from "./pages/register";

const App =()=>{
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/login" element = {<Login/>}/>
      <Route path ="/register" element = {<Register/>}/>
      <Route
      path="/dashboard"
      element = {
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }
      />
      <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>
      }
      />
      <Route path="*" element = {<Login/>}/>
    </Routes>
    </BrowserRouter>
  );
};

export default App;