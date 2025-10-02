import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthContext } from "./context/auth";
import { ToastContainer, toast } from "react-toastify";
import React, { useState, useContext, useEffect, useRef } from "react";

function Home() {



	return (
		<div className="gradient-home gradient">
			<Header />
			<ToastContainer />
			<main>
				<div className="mt-5 container-fluid">

					<div className="row justify-content-center">
					</div>
				</div>
			</main >
			<Footer />
		</div >
	);
}


export default Home;
