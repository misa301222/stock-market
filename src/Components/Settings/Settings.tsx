import { faChartLine, faCogs, faDatabase, faDollarSign, faUserGear, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../Services/auth.service";

function Settings() {
    const navigate = useNavigate();
    const [role, setRole] = useState<string>();

    const handleOnClickManageStockHistory = () => {
        navigate(`manageStockHistory`);
    }

    const handleOnClickManageWallet = () => {
        navigate(`manageWallet`);
    }

    const handleOnClickEditProfileInfo = () => {
        navigate('editProfileInfo');
    }

    const handleOnClickManageStocks = () => {
        navigate('manageStocks');
    }

    const handleOnClickUserProfitHistory = () => {
        navigate('moneyHistory')
    }

    useEffect(() => {
        const role: string = authService.getRoles!;
        setRole(role);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Settings <FontAwesomeIcon icon={faCogs} /></h1>
                <hr />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
                {
                    role === 'ADMINISTRATOR' ?
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
                        : null
                }

                <motion.div
                    whileHover={{
                        scale: 1.1
                    }}
                    transition={{
                        type: "spring"
                    }}
                    className="card w-[15rem] p-5 cursor-pointer"
                    onClick={() => handleOnClickManageWallet()}>
                    <div className="p-2">
                        <FontAwesomeIcon className="text-[10rem]" icon={faWallet} />
                    </div>

                    <div className="border border-gray-300 rounded-md mt-5">
                        <h5> Manage Wallet </h5>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{
                        scale: 1.1
                    }}
                    transition={{
                        type: "spring"
                    }}
                    className="card w-[15rem] p-5 cursor-pointer"
                    onClick={() => handleOnClickManageStocks()}>
                    <div className="p-2">
                        <FontAwesomeIcon className="text-[10rem]" icon={faChartLine} />
                    </div>

                    <div className="border border-gray-300 rounded-md mt-5">
                        <h5> Manage Stocks </h5>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{
                        scale: 1.1
                    }}
                    transition={{
                        type: "spring"
                    }}
                    className="card w-[15rem] p-5 cursor-pointer"
                    onClick={() => handleOnClickEditProfileInfo()}>
                    <div className="p-2">
                        <FontAwesomeIcon className="text-[10rem]" icon={faUserGear} />
                    </div>

                    <div className="border border-gray-300 rounded-md mt-5">
                        <h5> Edit Profile Info </h5>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{
                        scale: 1.1
                    }}
                    transition={{
                        type: "spring"
                    }}
                    className="card w-[15rem] p-5 cursor-pointer"
                    onClick={() => handleOnClickUserProfitHistory()}>
                    <div className="p-2">
                        <FontAwesomeIcon className="text-[10rem]" icon={faDollarSign} />
                    </div>

                    <div className="border border-gray-300 rounded-md mt-5">
                        <h5> Money History </h5>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Settings;