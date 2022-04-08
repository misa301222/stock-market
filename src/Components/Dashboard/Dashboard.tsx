import { faGaugeHigh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
import UserProfitCard from "../Cards/UserProfitCard";

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number
}

interface UserProfit {
    email: string,
    money: number
}

const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;

function Dashboard() {
    const [userPortfolio, setUserPortfolio] = useState<UserPortfolio[]>();
    const [userProfit, setUserProfit] = useState<UserProfit>();

    const getUserPortfolioByEmail = async (email: string) => {
        await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmail/${email}`).then(response => {
            setUserPortfolio(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const getUserProfitByEmail = async (email: string) => {
        await axios.get(`${USER_PROFIT_URL}/${email}`).then(response => {
            console.log(response);
            setUserProfit(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnClickSellStock = async (userPortfolio: UserPortfolio) => {
        let currentUser: string = authService.getCurrentUser!;

        Swal.fire({
            title: "Sell Stocks!",
            text: "How many Stocks do you want to sell?",
            input: 'number',
            showCancelButton: true
        }).then(async (result) => {
            if (result.value) {
                if (result.value <= userPortfolio.stockQuantity) {
                    userPortfolio.stockQuantity -= result.value;
                    userProfit!.money += (userPortfolio.stockPrice * result.value);
                    await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentUser}/${userPortfolio.stockName}`, userPortfolio);
                    await axios.put(`${USER_PROFIT_URL}/${currentUser}`, userProfit);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Transaction done succesfully!',
                        showConfirmButton: true,
                    });

                    await getUserProfitByEmail(currentUser);
                    await getUserPortfolioByEmail(currentUser);
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'warning',
                        title: 'You dont have enough stocks!',
                        showConfirmButton: true,
                    });
                }
            }
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getUserPortfolioByEmail(currentUser);
        getUserProfitByEmail(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Your Dashboard <FontAwesomeIcon icon={faGaugeHigh} /></h1>
                <hr />
            </div>

            <div className="container mx-auto">
                <UserProfitCard userProfit={userProfit} />
            </div>

            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Stock Name
                            </th>

                            <th className="p-5">
                                Quantity
                            </th>

                            <th className="p-5">
                                Current Price
                            </th>

                            <th className="p-5">
                                Sell
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            userPortfolio?.map((element: UserPortfolio, index: number) => (
                                <tr key={index}>
                                    <td className="p-5"><span className="font-bold">{element.stockName}</span></td>
                                    <td className="p-5">{element.stockQuantity}</td>
                                    <td className="p-5">${element.stockPrice}</td>
                                    <td><button onClick={async () => handleOnClickSellStock(element)} className="btn-primary" type="button">Sell Stocks</button></td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Dashboard;