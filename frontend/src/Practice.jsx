import "./App.css";

import React, { useContext, useEffect, useState } from "react";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from "./context/auth.jsx";
import Header from "./components/Header";
import Error from "./components/Error";
import Footer from "./components/Footer";

function Practice() {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);

    const [problems, setProblems] = useState([]);


    useEffect(() => {

        async function getData() {
            const response = await fetch('/api/practice', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });


            const data = await response.json();
            console.log(data);
            setData(data);
        }

        getData();



    }, [token]);


    return (
        <div className="gradient-leaderboard vh-100">
            <Header />
            <div className="row align-items-start w-100 m-0">
                {data ? (
                    <>
                        <div className="col-6">
                            <h2>{data.title}</h2>
                            <p>{data.desc}</p>
                        </div>
                        <div className="col-6">
                            <h3>Example Questions</h3>
                            <ul>
                                {data.examples.map((ex, idx) => (
                                    <li key={idx}>
                                        <strong>Input:</strong> {ex.input} <br />
                                        <strong>Output:</strong> {ex.output}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <p>Loading problem...</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Practice;
