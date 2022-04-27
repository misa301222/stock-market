import { faCalculator, faDollarSign, faFolderOpen, faGaugeHigh, faHandHoldingDollar, faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
import UserProfitCard from "../Cards/UserProfitCard";
import { motion } from 'framer-motion';

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    stockPriceYesterday?: number
}

interface UserProfit {
    email: string,
    money: number
}

interface StockSold {
    email: string,
    stockName: string,
    quantityBought: number,
    transactionDate: string,
    transactionTotal: number
}

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    education: string[],
    imagesURL: string[],
    fullName?: string
}

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: any,
    stockPrice: number
}

interface UserProfitHistory {
    email: string,
    money: number,
    transactionDate: string
}

const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;
const STOCK_SOLD_URL = `${process.env.REACT_APP_API_URL}/StockSolds`;
const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;
const USER_PROFIT_HISTORY_URL = `${process.env.REACT_APP_API_URL}/UserProfitHistories`;

function Dashboard() {
    const navigate = useNavigate();
    const [userPortfolio, setUserPortfolio] = useState<UserPortfolio[]>();
    const [userProfit, setUserProfit] = useState<UserProfit>();
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isSellStocksOpen, setIsSellStocksOpen] = useState<boolean>();
    const [sellStockQuantity, setSellStockQuantity] = useState<number>(0);
    const [currentUserPortfolio, setCurrentUserPortfolio] = useState<UserPortfolio>();
    const [selectedPrice, setSelectedPrice] = useState<number>(0);
    const [stockQuantity, setStockQuantity] = useState<number>(0);

    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

    const getUserProfileByEmail = async (email: string) => {
        const responseUser = await axios.get(`${USER_URL}/GetCurrentUser/${email}`);

        await axios.get(`${USER_PROFILE_URL}/${email}`).then(response => {
            response.data.fullName = responseUser.data.dataSet.fullName;
            setUserProfile(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnClickCalculate = (element: UserPortfolio) => {
        setSelectedPrice(element.stockPrice);
        setIsOpen(true);
    }

    const getUserPortfolioByEmail = async (email: string) => {
        let yesterdayDate: string = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
        const responseUserPortfolio = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmail/${email}`);
        for (let i = 0; i < responseUserPortfolio.data.length; i++) {
            const responseDateYesterday = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${responseUserPortfolio.data[i].stockName}/${yesterdayDate}`);
            responseUserPortfolio.data[i].stockPriceYesterday = responseDateYesterday.data.stockPrice;
        }
        setUserPortfolio(responseUserPortfolio.data);
    }

    const getUserProfitByEmail = async (email: string) => {
        await axios.get(`${USER_PROFIT_URL}/${email}`).then(response => {
            setUserProfit(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnClickSellStockModal = (userPortfolio: UserPortfolio) => {
        setIsSellStocksOpen(true);
        setCurrentUserPortfolio(userPortfolio);
    }

    const handleOnClickSellStock = async () => {
        let currentUser: string = authService.getCurrentUser!;
        let quantity: number = sellStockQuantity;
        console.log(currentUserPortfolio);

        Swal.fire({
            title: `Are you sure you want to sell ${quantity} stock(s)?`,
            text: ``,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (currentUserPortfolio) {
                    if (quantity <= currentUserPortfolio.stockQuantity) {
                        currentUserPortfolio.stockQuantity -= quantity;
                        userProfit!.money += (currentUserPortfolio.stockPrice * quantity);
                        await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentUser}/${currentUserPortfolio.stockName}`, currentUserPortfolio);
                        await axios.put(`${USER_PROFIT_URL}/${currentUser}`, userProfit);

                        let stockSold: StockSold = {
                            email: currentUser,
                            stockName: currentUserPortfolio.stockName,
                            quantityBought: quantity,
                            transactionDate: moment(new Date()).format('YYYY-MM-DD'),
                            transactionTotal: quantity * currentUserPortfolio.stockPrice
                        }

                        await axios.post(`${STOCK_SOLD_URL}`, stockSold);

                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Transaction done succesfully!',
                            showConfirmButton: true,
                        });

                        let userProfitHistory: UserProfitHistory = {
                            email: currentUser,
                            money: userProfit!.money,
                            transactionDate: moment(new Date()).format('YYYY-MM-DD')
                        }

                        await axios.post(`${USER_PROFIT_HISTORY_URL}`, userProfitHistory);

                        await getUserProfitByEmail(currentUser);
                        await getUserPortfolioByEmail(currentUser);

                        setIsSellStocksOpen(false);
                        setSellStockQuantity(0);
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'You dont have enough stocks!',
                            showConfirmButton: true,
                        });
                    }
                }
            }
        });
    }

    const handleOnClickSeePurchaseHistory = (stockName: string) => {
        navigate(`/stocksBoughtHistory/${stockName}`)
    }

    const handleOnClickSeeSoldHistory = (stockName: string) => {
        navigate(`/stocksSoldHistory/${stockName}`)
    }

    const handleOnClickMoneyHistory = () => {
        navigate(`/settings/moneyHistory`)
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getUserPortfolioByEmail(currentUser);
        getUserProfitByEmail(currentUser);
        getUserProfileByEmail(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Your Dashboard <FontAwesomeIcon icon={faGaugeHigh} /></h1>
                <hr />
                <div className="mt-4 flex flex-row justify-end">
                    <button onClick={() => handleOnClickMoneyHistory()} type="button" className="btn-dark"><FontAwesomeIcon icon={faDollarSign} /> Money History</button>
                </div>
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    translateX: -100,
                    scale: 0.9
                }}
                animate={{
                    opacity: 1,
                    translateX: 0,
                    scale: 1
                }}
                transition={{
                    duration: 1,
                }}
                className="container mx-auto">
                <UserProfitCard userProfit={userProfit} userProfile={userProfile} />
            </motion.div>

            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Stock Name
                            </th>

                            <th className="p-5">
                                Quantity
                            </th>

                            <th className="p-5">
                                Yesterday's Price
                            </th>

                            <th className="p-5">
                                Current Price
                            </th>

                            <th className="p-5">
                                Difference
                            </th>

                            <th className="p-5">
                                %
                            </th>

                            <th className="p-5">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            userPortfolio?.map((element: UserPortfolio, index: number) => (
                                <tr key={index}>
                                    <td className="p-5"><span className="font-bold text-blue-800 underline"><Link to={`/stockDetailedInfo/${element.stockName}`}>{element.stockName}</Link></span></td>
                                    <td className="p-5 font-bold underline">{element.stockQuantity}</td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold" style={{
                                            color: `${element.stockPriceYesterday! < 0 ? '#991b1b' : ''}`
                                        }}>
                                        ${(element.stockPriceYesterday!) ? (element.stockPriceYesterday!).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0'}</motion.td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold"
                                        style={{
                                            color: `${element.stockPrice < 0 ? '#991b1b' : ''}`
                                        }}>${(element.stockPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</motion.td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold"
                                        style={{
                                            color: `${(element.stockPrice - element.stockPriceYesterday!) < 0 ? '#991b1b' : 'green'}`
                                        }}>
                                        {(element.stockPrice - element.stockPriceYesterday!) > 0 ? '+' : ''} {(element.stockPriceYesterday!) ? (element.stockPrice - element.stockPriceYesterday!).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0'}
                                    </motion.td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold"
                                        style={{
                                            color: `${((element.stockPrice - element.stockPriceYesterday!) * 100 / element.stockPrice) < 0 ? '#991b1b' : 'green'}`
                                        }}>
                                        {((element.stockPrice - element.stockPriceYesterday!) * 100 / element.stockPrice) > 0 ? '+' : ''}{(element.stockPriceYesterday!) ? ((element.stockPrice - element.stockPriceYesterday!) * 100 / element.stockPrice).toFixed(2) : '0'}%
                                    </motion.td>
                                    <td><div className="flex flex-row justify-evenly">
                                        <button onClick={() => handleOnClickCalculate(element)} className="btn-dark w-40" type="button"><FontAwesomeIcon icon={faCalculator} /> Calculate Pricing</button>
                                        <button onClick={async () => handleOnClickSellStockModal(element)} className="btn-success" type="button"><FontAwesomeIcon icon={faHandHoldingDollar} /> Sell Stocks</button>
                                        <button onClick={async () => handleOnClickSeePurchaseHistory(element.stockName)} className="btn-primary w-56" type="button"><FontAwesomeIcon icon={faFolderOpen} /> See Purchase History</button>
                                        <button onClick={async () => handleOnClickSeeSoldHistory(element.stockName)} className="btn-primary w-56" type="button"><FontAwesomeIcon icon={faFolderOpen} /> See Sold History</button>
                                    </div></td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>

            <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Calculate Stock <FontAwesomeIcon icon={faCalculator} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <div className="flex flex-row justify-center">
                                <div className="p-5">
                                    <h3 className="font-bold">Stock Quantity</h3>
                                    <br />
                                    <input onChange={(e) => setStockQuantity(Number(e.target.value))} className="form-control text-center" type={'number'} />
                                </div>
                            </div>

                            <div className="flex flex-row justify-center mt-10 mb-6">
                                <h2 className="font-bold text-blue-800"><u>{stockQuantity} Stocks</u> <span className="text-black">x</span> <u>${selectedPrice}</u> <span className="text-black">=</span> <u>${(selectedPrice * stockQuantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</u></h2>
                            </div>
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">
                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={isSellStocksOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Sell Stocks <FontAwesomeIcon icon={faMoneyBill1Wave} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <div className="flex flex-row justify-center">
                                <div className="p-5">
                                    <h3 className="font-bold">Stock Quantity</h3>
                                    <br />
                                    <input onChange={(e) => setSellStockQuantity(Number(e.target.value))} className="form-control text-center" type={'number'} />
                                </div>
                            </div>

                            <div className="flex flex-row">
                                <h3 className="font-bold text-black mx-auto">
                                    You are selling a quantity of {sellStockQuantity} stock(s) at ${currentUserPortfolio?.stockPrice ? (currentUserPortfolio?.stockPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}.<br /><br />
                                    <span className="text-blue-800"><u>{sellStockQuantity} Stock(s)</u> <span className="text-black"> x</span> <u>${currentUserPortfolio?.stockPrice ? (currentUserPortfolio?.stockPrice!).toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0}</u> = <u>${(sellStockQuantity * currentUserPortfolio?.stockPrice!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</u>
                                        <span className="text-black"> Profit</span></span>
                                </h3>
                            </div>

                            <div className="flex flex-row justify-center mt-10 mb-6">
                                <button onClick={async () => handleOnClickSellStock()} disabled={sellStockQuantity <= 0} className="btn-primary">Sell</button>
                            </div>
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">
                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsSellStocksOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Dashboard;