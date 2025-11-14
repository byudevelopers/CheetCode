import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import React from "react";
import { ArrowRight, Zap, Brain, TrendingUp, Clock } from 'lucide-react';

function Home() {
	return (
		<>
			<Header />
			<ToastContainer />

			<div style={{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				minHeight: '100vh'
			}}>
				{/* Navigation */}
				<nav className="container py-4">
					<div className="d-flex justify-content-between align-items-center">
						<div className="d-flex align-items-center gap-2">
							<Zap size={32} color="white" />
							<span className="h3 mb-0 text-white fw-bold">Cheetcode</span>
						</div>
						<div className="d-flex gap-3">
							<button className="btn btn-link text-white text-decoration-none">
								Login
							</button>
							<button className="btn btn-light fw-semibold">
								Sign Up
							</button>
						</div>
					</div>
				</nav>

				{/* Hero Section */}
				<div className="container text-center py-5">
					<div className="mb-4">
						<span className="badge rounded-pill px-4 py-2"
							  style={{
								  backgroundColor: 'rgba(255,255,255,0.2)',
								  color: 'white',
								  border: '1px solid rgba(255,255,255,0.3)'
							  }}>
							⚡ Master coding interviews faster
						</span>
					</div>

					<h1 className="display-1 fw-bold text-white mb-4">
						Cheetcode
					</h1>

					<p className="h2 text-white mb-4 fw-normal">
						A better way to prepare for coding interviews
					</p>

					<p className="lead text-white mb-5 mx-auto" style={{ maxWidth: '700px', opacity: 0.95 }}>
						Stop grinding through hundreds of problems. Our intelligent spaced repetition system
						helps you master coding patterns and retain knowledge long-term.
					</p>

					<button className="btn btn-light btn-lg px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
						Start Learning Free
						<ArrowRight size={20} />
					</button>
				</div>

				{/* Features Section */}
				<div className="bg-white py-5">
					<div className="container">
						<div className="row g-4">
							{/* Feature 1 */}
							<div className="col-md-4">
								<div className="card h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' }}>
									<div className="card-body p-4">
										<div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-3 p-3"
											 style={{
												 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												 width: '60px',
												 height: '60px'
											 }}>
											<Brain size={28} color="white" />
										</div>
										<h3 className="h4 fw-bold mb-3">
											Spaced Repetition
										</h3>
										<p className="text-secondary">
											Our flashcard system automatically schedules reviews at optimal intervals,
											ensuring you remember concepts when it matters most—during your interview.
										</p>
									</div>
								</div>
							</div>

							{/* Feature 2 */}
							<div className="col-md-4">
								<div className="card h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' }}>
									<div className="card-body p-4">
										<div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-3 p-3"
											 style={{
												 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												 width: '60px',
												 height: '60px'
											 }}>
											<TrendingUp size={28} color="white" />
										</div>
										<h3 className="h4 fw-bold mb-3">
											Pattern Recognition
										</h3>
										<p className="text-secondary">
											Focus on understanding problem-solving patterns rather than memorizing solutions.
											Build intuition that applies to any coding challenge.
										</p>
									</div>
								</div>
							</div>

							{/* Feature 3 */}
							<div className="col-md-4">
								<div className="card h-100 border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' }}>
									<div className="card-body p-4">
										<div className="mb-4 d-inline-flex align-items-center justify-content-center rounded-3 p-3"
											 style={{
												 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
												 width: '60px',
												 height: '60px'
											 }}>
											<Clock size={28} color="white" />
										</div>
										<h3 className="h4 fw-bold mb-3">
											Efficient Learning
										</h3>
										<p className="text-secondary">
											Study smarter, not harder. Spend just 20 minutes a day and retain more
											than hours of traditional practice. Perfect for busy schedules.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* How It Works */}
				<div style={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
				}} className="py-5">
					<div className="container">
						<div className="card border-0 shadow-lg mx-auto"
							 style={{
								 maxWidth: '900px',
								 background: 'rgba(255,255,255,0.1)',
								 backdropFilter: 'blur(10px)',
								 border: '1px solid rgba(255,255,255,0.2)'
							 }}>
							<div className="card-body p-5">
								<h2 className="h2 fw-bold mb-4 text-center text-white">
									How Spaced Repetition Works
								</h2>
								<p className="lead text-white text-center mb-5 mx-auto" style={{ maxWidth: '700px', opacity: 0.95 }}>
									Instead of cramming all problems at once, our algorithm shows you each concept
									right before you're about to forget it. This scientifically-proven method builds
									long-term memory and genuine understanding.
								</p>
								<div className="text-center">
									<button className="btn btn-light btn-lg px-5 py-3 fw-bold">
										See How It Works
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Footer />
		</>
	);
}

export default Home;