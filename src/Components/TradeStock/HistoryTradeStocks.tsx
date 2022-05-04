import { faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import authService from "../../Services/auth.service";
import { motion } from 'framer-motion';
import TradeCard from "../Cards/TradeCard";
import { useNavigate } from "react-router-dom";

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

const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;

function HistoryTradeStocks() {
    const navigate = useNavigate();
    const [currentTrades, setCurrentTrades] = useState<TradeStockHistory[]>();

    const getTradeStockHistoriesBySourceEmailAndStatus = async (email: string) => {                
        await axios.get(`${TRADE_STOCK_HISTORY_URL}/GetDistinctPendingTradeStockHistoriesBySourceEmail/${email}`).then(response => {
            setCurrentTrades(response.data);
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getTradeStockHistoriesBySourceEmailAndStatus(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Trades History <FontAwesomeIcon icon={faHistory} /></h1>
                <hr />
            </div>

            <div className="mt-20">
                {
                    currentTrades?.map((element: TradeStockHistory, index: number) => (
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
                            onClick={() => navigate(`/tradeStocks/viewTrade/${element.tradeStockHistoryId}`)}
                        >
                            <TradeCard emailSource={element.sourceEmail} emailDestiny={element.destinyEmail} status={element.status} />
                        </motion.div>
                    ))
                }
            </div>

        </div>
    )

}

export default HistoryTradeStocks;