import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import authService from "../../Services/auth.service";
import { motion } from 'framer-motion';

interface UserProfitHistory {
    email: string,
    money: number,
    previousMoney?: number,
    transactionDate: Date
}

const USER_PROFIT_HISTORY_URL = `${process.env.REACT_APP_API_URL}/UserProfitHistories`;

function UserProfileHistory() {
    const [userProfitHistory, setUserProfitHistory] = useState<UserProfitHistory[]>();

    const getUserProfitHistoryByEmail = async (email: string) => {
        let userProfitHistoryArray: UserProfitHistory[] = [];
        const responseUserProfitHistory = await axios.get(`${USER_PROFIT_HISTORY_URL}/GetUserProfitHistoryByEmail/${email}`);
        console.log(responseUserProfitHistory.data);
        for (let i = 0; i < responseUserProfitHistory.data.length; i++) {
            let userProfitHistory: UserProfitHistory = responseUserProfitHistory.data[i];
            if (i < responseUserProfitHistory.data.length - 1) {
                userProfitHistory.previousMoney = responseUserProfitHistory.data[i + 1].money;
            } else {
                userProfitHistory.previousMoney = 0;
            }
            userProfitHistoryArray.push(userProfitHistory);
        }

        setUserProfitHistory(userProfitHistoryArray);
    }

    useEffect(() => {
        const currentUser: string = authService.getCurrentUser!;
        getUserProfitHistoryByEmail(currentUser);
    }, []);

    return (
        <div>

            <div className="container mx-auto">
                <h1 className="header mt-10">Money History <FontAwesomeIcon icon={faDollarSign} /></h1>
                <hr />
            </div>
            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Date
                            </th>

                            <th className="p-5">
                                Money
                            </th>

                            <th className="p-5">
                                Change
                            </th>

                            <th className="p-5">
                                %
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            userProfitHistory?.map((element: UserProfitHistory, index: number) => (
                                <tr key={index}>
                                    <td className="p-5 font-bold">{moment(element.transactionDate).local().format('MM/DD/YYYY HH:mm')}</td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold">${element.money.toLocaleString(undefined, { minimumFractionDigits: 2 })}</motion.td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold"
                                        style={{
                                            color: `${(element.money - element.previousMoney!) > -1 ? 'green' : '#991b1b'}`
                                        }}>{(element.money - element.previousMoney!) > 0 ? '+' : ''} {(element.money - element.previousMoney!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</motion.td>
                                    <motion.td
                                        initial={{
                                            opacity: 0,
                                            translateX: -100,
                                            scale: 0.9
                                        }}
                                        animate={{
                                            opacity: 1,
                                            translateX: 0,
                                            scale: 1
                                        }}
                                        transition={{
                                            duration: 1,
                                        }}
                                        className="p-5 font-bold"
                                        style={{
                                            color: `${((element.money - element.previousMoney!) * 100 / element.previousMoney!) > 0 ? 'green' : '#991b1b'}`
                                        }
                                        }>{((element.money - element.previousMoney!) * 100 / element.previousMoney!) > 0 ? '+' : ''}{element.previousMoney !== 0 ? ((element.money - element.previousMoney!) * 100 / element.previousMoney!).toFixed(2) : '0'}%</motion.td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserProfileHistory;