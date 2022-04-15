import { faChartLine, faCompass, faGaugeHigh, faGears, faHome, faHouseChimneyWindow, faMoneyBillTrendUp, faPersonWalkingArrowRight, faRightToBracket, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();

    useEffect(() => {
        const loggedIn: string = localStorage.getItem('isLoggedIn')!;
        setIsLoggedIn(loggedIn === 'true' ? true : false);
    }, []);

    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-200 p-6 shadow-sm shadow-gray-400">
            <div className="w-54 flex justify-evenly items-center">
                <Link className="hover:text-red-300 hover:scale-110 ease-in-out duration-300" to={'/'}><h2 className="font-bold">StMarket App <FontAwesomeIcon icon={faMoneyBillTrendUp} /></h2></Link>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-lg lg:flex-grow">
                    <div className="p-1 w-fit m-auto">
                        <Link to={'/'} className="navbar-link"><h5><FontAwesomeIcon icon={faHouseChimneyWindow} /> Home</h5></Link>

                        <Link to={'/dashboard'} className="navbar-link"><h5><FontAwesomeIcon icon={faGaugeHigh} /> Dashboard</h5></Link>

                        <Link to={'/manageStocks'} className="navbar-link"><h5><FontAwesomeIcon icon={faChartLine} /> Manage Stocks</h5></Link>

                        <Link to={'/browse'} className="navbar-link"><h5><FontAwesomeIcon icon={faCompass} /> Browse</h5></Link>

                        <Link to={'/settings'} className="navbar-link"><h5><FontAwesomeIcon icon={faGears} /> Settings</h5></Link>

                        {
                            !isLoggedIn ?
                                <div className="navbar-link">
                                    <Link to={'/login'} className="navbar-link"><h5><FontAwesomeIcon icon={faRightToBracket} /> Login</h5></Link>

                                    <Link to={'/signUp'} className="navbar-link"><h5><FontAwesomeIcon icon={faUserCheck} /> Signup</h5></Link>
                                </div>
                                : null
                        }

                        {
                            isLoggedIn ?
                                <Link to={'/logout'} className="navbar-link"><h5><FontAwesomeIcon icon={faPersonWalkingArrowRight} /> Logout</h5></Link>
                                : null
                        }
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Navbar;