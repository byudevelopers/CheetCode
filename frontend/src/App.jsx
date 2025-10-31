import "./App.css";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";

import Stats from "./Stats.jsx";
import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/auth.jsx";
function App() {



	const { isAuthenticated } = useContext(AuthContext);

	const ProtectedRoute = ({ children }) => {
		debugger;
		if (!isAuthenticated && isAuthenticated !== null) {
			return <Navigate to="/login" replace />;
		}
		return children;
	};


	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/" element={<Home />} />
				<Route path="" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
