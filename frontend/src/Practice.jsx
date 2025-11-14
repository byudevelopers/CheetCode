import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/auth.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CheckCircle, Code, Terminal } from 'lucide-react';

function Practice() {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch('/api/practice', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });

                const result = await response.json();
                console.log(result);
                setData(result);
            } catch (error) {
                console.error('Error fetching practice data:', error);
            }
        }

        getData();
    }, [token]);

    return (
        <div className="gradient-leaderboard min-vh-100">
            <Header />

            {data ? (
                <div className="container-fluid py-4">
                    <div className="row g-4">
                        {/* Left Side - Problem Description */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body p-4">
                                    {/* Problem Title */}
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <Code size={28} className="text-primary" />
                                        <h2 className="mb-0 fw-bold">{data.title}</h2>
                                    </div>

                                    <hr className="my-3" />

                                    {/* Problem Description */}
                                    <div className="mb-4">
                                        <h5 className="fw-bold mb-3 text-secondary">
                                            <Terminal size={20} className="me-2" />
                                            Description
                                        </h5>
                                        <p className="lead text-dark" style={{ lineHeight: '1.8' }}>
                                            {data.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Examples */}
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold mb-4">
                                        <CheckCircle size={24} className="text-success me-2" />
                                        Examples
                                    </h4>

                                    {data.examples && data.examples.length > 0 ? (
                                        data.examples.map((ex, idx) => (
                                            <div key={idx} className="mb-4">
                                                <div className="border rounded p-3 bg-light">
                                                    <div className="mb-2">
                                                        <span className="badge bg-primary mb-2">Example {idx + 1}</span>
                                                    </div>

                                                    <div className="mb-2">
                                                        <strong className="text-secondary">Input:</strong>
                                                        <div className="mt-1 p-2 bg-white rounded border">
                                                            <code className="text-dark">{ex.input}</code>
                                                        </div>
                                                    </div>

                                                    <div className="mb-2">
                                                        <strong className="text-secondary">Output:</strong>
                                                        <div className="mt-1 p-2 bg-white rounded border">
                                                            <code className="text-success fw-bold">{ex.output}</code>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-muted">No examples available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading problem...</p>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Practice;
