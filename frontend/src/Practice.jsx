import "./App.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/auth.jsx";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CheckCircle, Code, Terminal, ArrowRight } from 'lucide-react';

function Practice() {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [selectedConfidence, setSelectedConfidence] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getData();
    }, [token]);

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
            setSelectedConfidence(null); // Reset selection for new card
        } catch (error) {
            console.error('Error fetching practice data:', error);
        }
    }

    async function handleNextCard() {
        if (selectedConfidence === null) {
            alert('Please select a confidence level first');
            return;
        }

        setIsSubmitting(true);

        try {
            // TO-DO: Is this the correct format to send it back in??
            const response = await fetch('/api/practice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    problemId: data.id,
                    confidence: selectedConfidence
                })
            });

            if (response.ok) {
                await getData();
            } else {
                console.error('Error submitting confidence level');
            }
        } catch (error) {
            console.error('Error submitting confidence:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const confidenceLevels = [
        { level: 1, label: 'Again', color: 'danger', description: 'Completely forgot' },
        { level: 2, label: 'Hard', color: 'warning', description: 'Struggled to recall' },
        { level: 3, label: 'Good', color: 'info', description: 'Recalled with effort' },
        { level: 4, label: 'Easy', color: 'success', description: 'Recalled easily' }
    ];

    return (
        <div className="gradient-leaderboard min-vh-100">
            <Header />

            {data ? (
                <div className="container-fluid py-4">
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="card shadow-sm h-100 border-0">
                                <div className="card-body p-4">
                                    {/* Problem Title */}
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <Code size={28} className="text-primary" />
                                        <h2 className="mb-0 fw-bold">{data.title}</h2>
                                    </div>

                                    <hr className="my-3" />

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

                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="card shadow-sm border-0">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">How well did you understand this problem?</h5>

                                    {/* Confidence Level Buttons */}
                                    <div className="row g-3 mb-4">
                                        {confidenceLevels.map((conf) => (
                                            <div key={conf.level} className="col-md-3 col-sm-6">
                                                <button
                                                    className={`btn btn-${conf.color} w-100 py-3 ${
                                                        selectedConfidence === conf.level ? 'shadow-lg' : 'btn-outline-' + conf.color
                                                    }`}
                                                    onClick={() => setSelectedConfidence(conf.level)}
                                                    disabled={isSubmitting}
                                                >
                                                    <div className="fw-bold fs-5">{conf.label}</div>
                                                    <small className="d-block mt-1">{conf.description}</small>
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <button
                                            className="btn btn-primary btn-lg px-5"
                                            onClick={handleNextCard}
                                            disabled={selectedConfidence === null || isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Loading...
                                                </>
                                            ) : (
                                                <>
                                                    Next Card
                                                    <ArrowRight size={20} className="ms-2" />
                                                </>
                                            )}
                                        </button>
                                    </div>
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