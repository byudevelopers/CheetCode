import "./App.css";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";
import Practice from "./Practice.jsx";
import Stats from "./Stats.jsx";
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/auth.jsx";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
	const { isAuthenticated } = useContext(AuthContext);

	const ProtectedRoute = ({ children }) => {
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

				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/practice"
					element={
						<ProtectedRoute>
							<Practice />
						</ProtectedRoute>
					}
				/>

				<Route path="/" element={<Home />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;