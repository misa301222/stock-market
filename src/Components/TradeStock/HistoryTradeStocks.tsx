import { faHistory, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
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
    const [currentUser, setCurrentUser] = useState<string>();
    const [currentTrades, setCurrentTrades] = useState<TradeStockHistory[]>();
    const [notFound, setNotFound] = useState<boolean>();
    const [searchDay, setSearchDay] = useState<number>();
    const [searchMonth, setSearchMonth] = useState<number>();
    const [searchYear, setSearchYear] = useState<number>();

    const getTradeStockHistoriesBySourceEmailAndStatus = async (email: string) => {
        const responseTradeStocks = await axios.get(`${TRADE_STOCK_HISTORY_URL}/GetDistinctPendingTradeStockHistoriesBySourceEmail/${email}`);
        setCurrentTrades(responseTradeStocks.data);
        if (responseTradeStocks.data.length) {
            setNotFound(false);
        } else {
            setNotFound(true);
        }
    }

    const handleOnSubmitSearchDate = async (event: SyntheticEvent) => {
        event.preventDefault();

        const responseTradeStocks = await axios.get(`${TRADE_STOCK_HISTORY_URL}/GetTradeStockHistoriesByDate/${searchDay}/${searchMonth}/${searchYear}/${currentUser}`);
        setCurrentTrades(responseTradeStocks.data);

        if (responseTradeStocks.data.length) {
            setNotFound(false);
        } else {
            setNotFound(true);
        }
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getTradeStockHistoriesBySourceEmailAndStatus(currentUser);
        setCurrentUser(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Trades History <FontAwesomeIcon icon={faHistory} /></h1>
                <hr />
                <div className="flex flex-row justify-end">
                    <button className="btn-success" type="button" onClick={async () => await getTradeStockHistoriesBySourceEmailAndStatus(currentUser!)}>Search All</button>
                </div>
            </div>

            <form className="w-80 mx-auto card p-5 mt-10" onSubmit={handleOnSubmitSearchDate}>
                <h3 className="font-bold mb-5">Search by Date</h3>
                <div>
                    <label>Day</label>
                    <input onChange={(e) => setSearchDay(Number(e.target.value))} className="form-control mb-6 text-center" type={'number'} />
                </div>
                <div>
                    <label>Month</label>
                    <input onChange={(e) => setSearchMonth(Number(e.target.value))} className="form-control mb-6 text-center" type={'number'} />
                </div>
                <div>
                    <label>Year</label>
                    <input onChange={(e) => setSearchYear(Number(e.target.value))} className="form-control mb-6 text-center" type={'number'} />
                </div>
                <button disabled={!searchDay || !searchMonth || !searchYear} type="submit" className="btn-dark"><FontAwesomeIcon icon={faSearch} /> Search</button>
            </form>

            <div className="mt-20">
                {
                    !notFound ?
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
                                <TradeCard tradeElement={element} />
                            </motion.div>
                        ))
                        :

                        <motion.h1
                            initial={{
                                opacity: 0
                            }}

                            animate={{
                                opacity: 1
                            }}
                            className="font-bold mx-auto">No results found! Try searching again.</motion.h1>
                }
            </div>

        </div>
    )

}

export default HistoryTradeStocks;