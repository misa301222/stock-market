import { faHandHoldingDollar, faHistory, faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function TradeStock() {
    const navigate = useNavigate();

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Trade Stocks <FontAwesomeIcon icon={faHandHoldingDollar} /></h1>
                <hr />
            </div>

            <div className="flex flex-row justify-content-evenly">

                <button onClick={() => navigate('newTrade')} className="btn-primary"><FontAwesomeIcon icon={faPlus} /> New Trade</button>
                <button className="btn-primary"><FontAwesomeIcon icon={faList} /> Current Trades</button>
                <button className="btn-primary"><FontAwesomeIcon icon={faHistory} /> History</button> 
            </div>
        </div>
    )
}

export default TradeStock;