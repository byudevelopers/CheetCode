import "./App.css";

import React, { useContext, useEffect, useState } from "react";
import Login from "./Login.jsx";
import Home from "./Home.jsx";
import Register from "./Register.jsx";

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthContext } from "./context/auth.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function Dashboard() {
    const { token } = useContext(AuthContext);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        async function getData() {
            try {
                const response = await fetch("/api/dashboard", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                setProblems(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        getData();
    }, [token]);

    if (loading) return <p>Loading dashboard...</p>;

    // Group problems by type
    const problemsByType = problems.reduce((acc, problem) => {
        const type = problem.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(problem);
        return acc;
    }, {});

    const toggleCompletion = (id) => {
        setProblems((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, completed: !p.completed } : p
            )
        );
    };

    const getDifficultyClass = (difficulty) => {
        switch (difficulty.trim().toLowerCase()) {
            case "easy":
                return "bg-success text-white";
            case "medium":
                return "bg-warning text-dark";
            case "hard":
                return "bg-danger text-white";
            default:
                return "bg-secondary text-white";
        }
    };

    return (
        <div className="container mt-4">
            <h1>Dashbored</h1>
            <div className="accordion mt-3" id="problemsAccordion">
                {Object.entries(problemsByType).map(([type, typeProblems], idx) => (
                    <div className="accordion-item" key={type}>
                        <h2 className="accordion-header" id={`heading-${idx}`}>
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse-${idx}`}
                                aria-expanded="false"
                                aria-controls={`collapse-${idx}`}
                            >
                                {type} ({typeProblems.length})
                            </button>
                        </h2>
                        <div
                            id={`collapse-${idx}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${idx}`}
                            data-bs-parent="#problemsAccordion"
                        >
                            <div className="accordion-body">
                                {typeProblems.map((problem) => (
                                    <div
                                        key={problem.id}
                                        className={`d-flex justify-content-between align-items-center border rounded p-2 mb-2 ${
                                            problem.completed ? "bg-light" : ""
                                        }`}
                                    >
                                        <div>
                                            <a
                                                href={problem.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="fw-bold text-decoration-none"
                                            >
                                                {problem.title}
                                            </a>
                                            <span
                                                className={`badge ms-2 ${getDifficultyClass(
                                                    problem.difficulty
                                                )}`}
                                            >
                                                {problem.difficulty.trim()}
                                            </span>
                                        </div>
                                        <button
                                            className={`btn btn-sm ${
                                                problem.completed
                                                    ? "btn-success"
                                                    : "btn-outline-secondary"
                                            }`}
                                            onClick={() => toggleCompletion(problem.id)}
                                        >
                                            {problem.completed ? "Completed" : "Incomplete"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
