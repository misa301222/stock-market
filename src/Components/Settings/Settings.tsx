import { faCogs, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const handleOnClickManageStockHistory = () => {
        navigate(`manageStockHistory`);
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Settings <FontAwesomeIcon icon={faCogs} /></h1>
                <hr />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
                <motion.div 
                whileHover={{
                    scale: 1.1
                }}
                transition={{
                    type: "spring"
                }}
                className="card w-[15rem] p-5 cursor-pointer"
                onClick={() => handleOnClickManageStockHistory()}>
                    <div className="p-2">
                        <FontAwesomeIcon className="text-[10rem]" icon={faDatabase} />
                    </div>

                    <div className="border border-gray-300 rounded-md mt-5">
                        <h5> Manage Stock History </h5>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Settings;