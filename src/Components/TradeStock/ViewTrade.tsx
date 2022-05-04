import { faHandHoldingDollar, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

interface TradeStockHistory {
    tradeStockHistoryId: number,
    sourceEmail: string,
    destinyEmail: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    transactionDate: Date,
    status: string
}

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    eduaction: string[],
    imagesURL: string[],
    fullName?: string
}

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    stockPriceYesterday?: number
}

interface UserProfitHistory {
    email: string,
    money: number,
    transactionDate: Date
}

interface UserProfit {
    email: string,
    money: number
}

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string,
    stockPriceYesterday?: number
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;
const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const USER_PROFIT_HISTORY_URL = `${process.env.REACT_APP_API_URL}/UserProfitHistories`;

function ViewTrade() {
    const [currentTrade, setCurrentTrade] = useState<TradeStockHistory>();
    const [currentUser, setCurrentUser] = useState<string>('');
    const navigate = useNavigate();
    const params = useParams();

    const getTradeStockHistoryById = async (tradeStockHistoryId: number) => {
        await axios.get(`${TRADE_STOCK_HISTORY_URL}/${tradeStockHistoryId}`).then(response => {
            setCurrentTrade(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnClickAcceptOffer = async () => {
        Swal.fire({
            title: `Are you sure you want to Accept this Offer?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let userPortfolioResponse = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${currentTrade?.destinyEmail}/${currentTrade?.stockName}`);

                const responseEnoughMoney = await axios.get(`${USER_PROFIT_URL}/${currentTrade?.destinyEmail}`);
                let totalToPay: number = (currentTrade?.stockPrice! * currentTrade?.stockQuantity!);

                if (totalToPay <= responseEnoughMoney.data.money) {
                    console.log(userPortfolioResponse.data);
                    if (!userPortfolioResponse.data) {
                        const responseStock = await axios.get(`${STOCK_URL}/${currentTrade?.stockName}`);

                        let newUserPortfolio: UserPortfolio = {
                            email: currentTrade?.destinyEmail!,
                            stockName: currentTrade?.stockName!,
                            stockPrice: responseStock.data.stockPrice,
                            stockQuantity: 0,
                        }
                        await axios.post(`${USER_PORTFOLIOS_URL}`, newUserPortfolio);
                    }
                    let newUserProfit: UserProfit = responseEnoughMoney.data;
                    newUserProfit.money -= (currentTrade?.stockPrice! * currentTrade?.stockQuantity!);

                    let userPortfolio: UserPortfolio = userPortfolioResponse.data;
                    userPortfolio.stockQuantity += currentTrade?.stockQuantity!;

                    await axios.put(`${USER_PROFIT_URL}/${currentTrade?.destinyEmail}`, newUserProfit);
                    await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentTrade?.destinyEmail}/${currentTrade?.stockName}`, userPortfolio);

                    const responseTradeStockHistory = await axios.get(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`);
                    let tradeStockHistory: TradeStockHistory = responseTradeStockHistory.data;
                    tradeStockHistory.status = 'ACCEPTED';
                    tradeStockHistory.transactionDate = new Date();
                    await axios.put(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`, tradeStockHistory);

                    let userProfitHistory: UserProfitHistory = {
                        email: currentTrade?.destinyEmail!,
                        money: (currentTrade?.stockPrice! * currentTrade?.stockQuantity!),
                        transactionDate: new Date()
                    }

                    console.log(userProfitHistory);

                    const responseEnoughMoneySource = await axios.get(`${USER_PROFIT_URL}/${currentTrade?.sourceEmail}`);
                    let userProfitHistorySource: UserProfitHistory = {
                        email: currentTrade?.sourceEmail!,
                        money: (currentTrade?.stockPrice! * currentTrade?.stockQuantity!),
                        transactionDate: new Date()
                    }

                    console.log(userProfitHistorySource);

                    await axios.post(`${USER_PROFIT_HISTORY_URL}/`, userProfitHistory);
                    await axios.post(`${USER_PROFIT_HISTORY_URL}/`, userProfitHistorySource);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Transaction done succesfully!',
                        showConfirmButton: true,
                    }).then(() => {
                        navigate('/tradeStocks/history');
                    });

                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'You dont have enough Money Available.',
                        showConfirmButton: true,
                    });
                }
            }
        });
    }

    const handleOnClickRejectOffer = async () => {
        Swal.fire({
            title: `Are you sure you want to cancel this Offer?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let userPortfolioResponse = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${currentTrade?.sourceEmail}/${currentTrade?.stockName}`);
                let userPortfolio: UserPortfolio = userPortfolioResponse.data;

                userPortfolio.stockQuantity += currentTrade?.stockQuantity!;
                await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentTrade?.sourceEmail}/${currentTrade?.stockName}`, userPortfolio);

                const responseTradeStockHistory = await axios.get(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`);
                let tradeStockHistory: TradeStockHistory = responseTradeStockHistory.data;
                tradeStockHistory.status = 'REJECTED';
                tradeStockHistory.transactionDate = new Date();
                await axios.put(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`, tradeStockHistory);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Transaction done succesfully!',
                    showConfirmButton: true,
                }).then(() => {
                    navigate('/tradeStocks/currentTrades');
                });
            }
        });
    }

    const handleOnClickCancelOffer = async () => {
        Swal.fire({
            title: `Are you sure you want to Cancel The Offer?`,
            text: ``,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${currentTrade?.sourceEmail}/${currentTrade?.stockName}`);
                let userPortfolio: UserPortfolio = response.data;
                userPortfolio.stockQuantity += currentTrade?.stockQuantity!;

                await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentTrade?.sourceEmail}/${currentTrade?.stockName}`, userPortfolio);

                const responseTradeStockHistory = await axios.get(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`);
                let tradeStockHistory: TradeStockHistory = responseTradeStockHistory.data;
                tradeStockHistory.status = 'CANCELLED';
                tradeStockHistory.transactionDate = new Date();
                await axios.put(`${TRADE_STOCK_HISTORY_URL}/${currentTrade?.tradeStockHistoryId}`, tradeStockHistory);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Transaction done succesfully!',
                    showConfirmButton: true,
                }).then(() => {
                    navigate('/tradeStocks/currentTrades');
                });
            }
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        setCurrentUser(currentUser);
        getTradeStockHistoryById(Number(params.tradeStockHistoryId));
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">View Trade #{params.tradeStockHistoryId} <FontAwesomeIcon icon={faHandHoldingDollar} /></h1>
                <hr />
            </div>

            <div className="card p-5 mt-10">
                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Seller: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.sourceEmail} <span className="font-bold">{currentTrade?.sourceEmail === currentUser ? '(You)' : ''}</span></h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Offering To: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.destinyEmail} <span className="font-bold">{currentTrade?.destinyEmail === currentUser ? '(You)' : ''}</span></h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Stock Name: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.stockName}</h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Selling a Quantity Of: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.stockQuantity}</h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">At a Price Of: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>${currentTrade?.stockPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Results in a Total Of: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3 className="font-bold text-green-700 underline">${(currentTrade?.stockPrice! * currentTrade?.stockQuantity!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>
                </div>
            </div>
            {
                currentTrade?.status === 'PENDING' ?
                    <h2 className="font-bold mt-10">Trade made at {moment(currentTrade?.transactionDate).local().format('MM/DD/YYYY HH:mm')}</h2>
                    : null
            }
            {
                currentTrade?.destinyEmail === currentUser && (currentTrade.status !== 'CANCELLED' && currentTrade.status !== 'REJECTED' && currentTrade.status !== 'ACCEPTED') ?
                    <div className="mt-20 flex flex-row justify-evenly">
                        <button onClick={async () => handleOnClickAcceptOffer()} className="btn-success">Accept Offer</button>
                        <button onClick={async () => handleOnClickRejectOffer()} className="btn-danger h-10 w-36">Reject Offer</button>
                    </div>
                    : null
            }

            {
                currentTrade?.sourceEmail === currentUser && (currentTrade.status !== 'CANCELLED' && currentTrade.status !== 'REJECTED' && currentTrade.status !== 'ACCEPTED') ?
                    <div className="mt-20">
                        <button onClick={async () => handleOnClickCancelOffer()} className="btn-primary"><FontAwesomeIcon icon={faXmark} /> Cancel Offer</button>
                    </div>
                    : null
            }

            {
                currentTrade?.status === 'CANCELLED' || currentTrade?.status === 'REJECTED' || currentTrade?.status === 'ACCEPTED' ?
                    <div className="mt-20">
                        <h2 className="font-bold">This Trade was <span className="text-red-600 underline">{currentTrade.status}</span> on {moment(currentTrade.transactionDate).local().format('MM/DD/YYYY HH:mm')}.
                            You are only able to view this Trade.</h2>
                    </div>
                    : null
            }
        </div>
    )
}

export default ViewTrade;