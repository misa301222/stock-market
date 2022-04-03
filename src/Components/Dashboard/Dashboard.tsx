import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Dashboard() {
    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Your Dashboard <FontAwesomeIcon icon={faGaugeHigh} /></h1>
                <hr />
            </div>

            <div>
                
            </div>
        </div>
    )
}

export default Dashboard;