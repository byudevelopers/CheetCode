import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import {Zap} from "lucide-react";




function Header() {

    const { logout, isAuthenticated } = useContext(AuthContext);

    return (


        // <nav className="navbar navbar-expand-lg bg-body-tertiary">
        //     <div className="container-fluid p-2">
        //         <Link className="navbar-brand fs-3 animate-font-weight" to="/">Cheet Code</Link>
        //         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
        //             aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
        //             <span className="navbar-toggler-icon"></span>
        //         </button>
        //         <div className="collapse navbar-collapse" id="navbarToggler">
        //             <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        //                 {isAuthenticated ? <>
        //                     <li className="nav-item m-2 ">
        //                         <button className="btn btn-danger col" onClick={logout} >Logout</button>
        //                     </li>
        //
        //                     <li className="nav-item m-2">
        //                         <Link className="btn btn-outline-secondary col" to="/dashboard">Dashboard</Link>
        //                     </li>
        //                     <li className="nav-item m-2">
        //                         <Link className="btn btn-outline-secondary col" to="/practice">Practice</Link>
        //                     </li>
        //                 </> :
        //
        //                     <>
        //                         <li className="nav-item m-2 ">
        //                             <Link className="btn btn-primary col" to="/login">Login</Link>
        //                         </li>
        //                         <li className="nav-item m-2">
        //                             <Link className="btn btn-outline-secondary col" to="/register">Register</Link>
        //                         </li>
        //                         <li className="nav-item m-2">
        //                             <Link className="btn btn-outline-secondary col" to="/dashboard">Dashboard</Link>
        //                         </li>
        //                         <li className="nav-item m-2">
        //                             <Link className="btn btn-outline-secondary col" to="/practice">Practice</Link>
        //                         </li>
        //                     </>
        //
        //
        //                 }
        //
        //             </ul>
        //
        //         </div>
        //     </div>
        // </nav>

        <nav className="navbar navbar-expand-lg py-3" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center gap-2 text-white" to="/">
                    <Zap size={32} color="white" />
                    <span className="h3 mb-0 fw-bold">Cheetcode</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
                        aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation"
                        style={{ borderColor: 'white' }}>
                    <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarToggler">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {isAuthenticated ? (
                            <>
                                <li className="nav-item m-2">
                                    <Link className="btn btn-link text-white text-decoration-none" to="/dashboard">
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="nav-item m-2">
                                    <Link className="btn btn-link text-white text-decoration-none" to="/practice">
                                        Practice
                                    </Link>
                                </li>
                                <li className="nav-item m-2">
                                    <button className="btn btn-light fw-semibold" onClick={logout}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                {/*<li className="nav-item m-2">*/}
                                {/*    <Link className="btn btn-link text-white text-decoration-none" to="/dashboard">*/}
                                {/*        Dashboard*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/*<li className="nav-item m-2">*/}
                                {/*    <Link className="btn btn-link text-white text-decoration-none" to="/practice">*/}
                                {/*        Practice*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                <li className="nav-item m-2">
                                    <Link className="btn btn-link text-white text-decoration-none" to="/login">
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item m-2">
                                    <Link className="btn btn-light fw-semibold" to="/register">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>

    );
}

export default Header;