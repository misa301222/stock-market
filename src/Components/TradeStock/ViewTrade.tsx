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

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;

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

    }

    const handleOnClickRejectOffer = async () => {
        //TODO HACER EL REJECT
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

            {
                // JSON.stringify(moment(currentTrade?.transactionDate).local().format('MM/DD/YYYY HH:mm'))
                JSON.stringify(currentTrade)
            }

            <div className="card p-5">
                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Seller: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.sourceEmail}</h3>
                    </div>
                </div>

                <div className="flex flex-row mb-5">
                    <div className="w-1/3 text-right">
                        <h3><span className="font-bold">Offering To: </span></h3>
                    </div>

                    <div className="w-1/2">
                        <h3>{currentTrade?.destinyEmail}</h3>
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
                currentTrade?.destinyEmail === currentUser ?
                    <div className="mt-20">
                        <button onClick={async () => handleOnClickAcceptOffer()} className="btn-primary">Accept Offer</button>
                        <button onClick={async () => handleOnClickRejectOffer()} className="btn-primary">Reject Offer</button>
                    </div>
                    : null
            }

            {
                currentTrade?.sourceEmail === currentUser ?
                    <div className="mt-20">
                        <button onClick={async () => handleOnClickCancelOffer()} className="btn-primary"><FontAwesomeIcon icon={faXmark} /> Cancel Offer</button>
                    </div>
                    : null
            }
        </div>
    )
}

export default ViewTrade;