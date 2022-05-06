import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import authService from "../../Services/auth.service";
import TradeCard from "../Cards/TradeCard";
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";

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

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;

function CurrentTrades() {
    const [currentTrades, setCurrentTrades] = useState<TradeStockHistory[]>();
    const navigate = useNavigate();

    const getTradeStockHistoriesBySourceEmailAndStatus = async (email: string) => {
        const status: string = 'PENDING';
        await axios.get(`${TRADE_STOCK_HISTORY_URL}/GetTradeStockHistoriesBySourceEmailAndStatus/${email}/${status}`).then(response => {
            setCurrentTrades(response.data);
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getTradeStockHistoriesBySourceEmailAndStatus(currentUser);
    }, [])


    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Current Trades <FontAwesomeIcon icon={faHandHoldingDollar} /></h1>
                <hr />
            </div>

            <div className="mt-20">
                {
                    currentTrades?.length ?
                        currentTrades.map((element: TradeStockHistory, index: number) => (
                            <motion.div key={index} className='mb-10 cursor-pointer w-fit mx-auto'
                                initial={{
                                    opacity: 0.4,
                                    translateX: -300
                                }}
                                animate={{
                                    opacity: 1,
                                    translateX: 0
                                }}
                                whileHover={{
                                    scale: 1.1
                                }}
                                onClick={() => navigate(`/tradeStocks/viewTrade/${element.tradeStockHistoryId}`)}>
                                <TradeCard tradeElement={element} />
                            </motion.div>
                        ))
                        :
                        <div>
                            <h2 className="font-bold text-red-700">It seems there's no current trades going on...</h2>
                            <Link to={'/tradeStocks'} className='text-4xl font-bold text-blue-500 underline hover:text-blue-800 duration-150 ease-in-out'>Go Back</Link>
                        </div>
                }
            </div>

        </div>
    )
}

export default CurrentTrades;