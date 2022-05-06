import { faHandHoldingDollar, faHistory, faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';

function TradeStock() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Trade Stocks <FontAwesomeIcon icon={faHandHoldingDollar} /></h1>
                <hr />
            </div>

            <motion.div
                initial={{
                    opacity: 0,
                    translateX: -200
                }}

                animate={{
                    opacity: 1,
                    translateX: 0
                }}
                className="card flex flex-row w-4/5 mt-16">
                <div className="w-2/4">
                    <img src={'/images/Trade.jpg'} className="w-[45rem]" />
                </div>

                <div className="w-2/4">
                    <div className="p-5 mr-10">
                        <h2 className="font-bold">Welcome to Trade Stocks!</h2>
                        <hr />

                        <p className="mt-2">Here you can trade a stocks with other users! It means you can give the price you want to any stock you have. Make deals, make contacts,
                            make profit.
                        </p>

                        <h3 className="font-bold mt-10">To Get Started...</h3>
                        <div className="flex flex-row justify-content-evenly mt-10 border border-gray-400 p-5 rounded-md bg-black/5">
                            <button onClick={() => navigate('newTrade')} className="btn-success"><FontAwesomeIcon icon={faPlus} /> New Trade</button>
                            <button onClick={() => navigate('currentTrades')} className="btn-dark"><FontAwesomeIcon icon={faList} /> Current Trades</button>
                            <button onClick={() => navigate('history')} className="btn-secondary"><FontAwesomeIcon icon={faHistory} /> History</button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default TradeStock;