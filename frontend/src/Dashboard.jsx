import "./App.css";

import React, { useContext, useEffect, useState } from "react";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from "./context/auth.jsx";

function Dashboard() {
    const { token } = useContext(AuthContext);

    const [problems, setProblems] = useState([]);


    useEffect(() => {

        async function getData() {
            const response = await fetch('/api/dashboard', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            

            const data = await response.json();

            console.log(data);

        }

        getData();

    }, []);




    return (
        <>
        </>
    );
};

export default Dashboard;
