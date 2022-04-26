import { faArrowTrendUp, faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
import StockCardBig from "../Cards/StockCardBig";
import UserProfitCard from "../Cards/UserProfitCard";
import { motion } from 'framer-motion';

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string
}

interface StockBought {
    email: string,
    stockName: string,
    quantityBought: number
    transactionDate: string,
    transactionTotal: number
}

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

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    education: string[],
    imagesURL: string[],
    fullName?: string
}

interface UserProfitHistory {
    email: string,
    money: number,
    transactionDate: string
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_BOUGHT_URL = `${process.env.REACT_APP_API_URL}/StockBoughts`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;
const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const USER_PROFIT_HISTORY_URL = `${process.env.REACT_APP_API_URL}/UserProfitHistories`;

function BuyStock() {
    const params = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState<number>(0);
    const [stock, setStock] = useState<Stock>();
    const [userProfit, setUserProfit] = useState<UserProfit>();
    const [userProfile, setUserProfile] = useState<UserProfile>();

    const getUserProfileByEmail = async (email: string) => {
        const responseUser = await axios.get(`${USER_URL}/GetCurrentUser/${email}`);

        await axios.get(`${USER_PROFILE_URL}/${email}`).then(response => {
            response.data.fullName = responseUser.data.dataSet.fullName;
            setUserProfile(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const getStockByStockName = async (stockName: string) => {
        await axios.get(`${STOCK_URL}/${stockName}`).then(response => {
            console.log(response);
            setStock(response.data);
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

    const handleOnSubmitBuyStock = async (event: SyntheticEvent) => {
        event.preventDefault();

        let currentUser: string = authService.getCurrentUser!;
        Swal.fire({
            title: `Are you sure you want to buy ${quantity} stock(s)?`,
            text: "The money will be discounted from your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const responseIsEnough = await axios.get(`${STOCK_URL}/EnoughStocksAvailable/${stock?.stockName}/${quantity}`);
                const responseEnoughMoney = await axios.get(`${USER_PROFIT_URL}/${currentUser}`);
                let money: number = responseEnoughMoney.data.money;

                if (currentUser && stock?.stockName) {
                    if (responseIsEnough.data) {
                        if (money >= (stock?.stockPrice! * quantity)) {
                            let newUserProfit: UserProfit = {
                                email: currentUser,
                                money: money - (stock.stockPrice * quantity)
                            }

                            const response = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${currentUser}/${stock?.stockName}`);

                            //IF EXISTS, MODIFY ADDING NEW QUANTITY, ELSE CREATE IT
                            if (response.data) {
                                let userPorfolio: UserPortfolio = response.data;
                                userPorfolio.stockQuantity += quantity;

                                let stockBought: StockBought = {
                                    email: currentUser,
                                    stockName: stock?.stockName!,
                                    quantityBought: quantity,
                                    transactionDate: moment(new Date()).format('YYYY-MM-DD'),
                                    transactionTotal: stock.stockPrice * quantity
                                }

                                await axios.post(`${STOCK_BOUGHT_URL}`, stockBought).then(async (response) => {
                                    await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentUser}/${userPorfolio.stockName}`, userPorfolio).then(async (response) => {
                                        console.log(response);
                                        let newStock: Stock = stock!;
                                        newStock.stockQuantity -= quantity;
                                        await axios.put(`${STOCK_URL}/${stock?.stockName}`, newStock);
                                        await axios.put(`${USER_PROFIT_URL}/${currentUser}`, newUserProfit);
                                        await getStockByStockName(params.stockName!);
                                        await getUserProfitByEmail(currentUser);

                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: 'Transaction done succesfully!',
                                            showConfirmButton: true,
                                        });
                                    });
                                }).catch(err => {
                                    console.log(err);
                                });

                                let userProfitHistory: UserProfitHistory = {
                                    email: currentUser,
                                    money: money - (stock.stockPrice * quantity),
                                    transactionDate: moment(new Date()).format('YYYY-MM-DD')
                                }

                                await axios.post(`${USER_PROFIT_HISTORY_URL}`, userProfitHistory);

                            } else {
                                let newUserProfit: UserProfit = {
                                    email: currentUser,
                                    money: money - (stock.stockPrice * quantity)
                                }

                                let stockBought: StockBought = {
                                    email: currentUser,
                                    stockName: stock?.stockName,
                                    quantityBought: quantity,
                                    transactionDate: moment(new Date()).format('YYYY-MM-DD'),
                                    transactionTotal: stock.stockPrice * quantity
                                }

                                let userPortfolio: UserPortfolio = {
                                    email: currentUser,
                                    stockName: stock.stockName,
                                    stockQuantity: quantity,
                                    stockPrice: stock.stockPrice,
                                }

                                await axios.post(`${STOCK_BOUGHT_URL}`, stockBought).then(async (response) => {
                                    console.log(response);
                                    if (response.data) {
                                        await axios.post(`${USER_PORTFOLIOS_URL}`, userPortfolio).then(async (response) => {
                                            console.log(response);
                                            let newStock: Stock = stock!;
                                            newStock.stockQuantity -= quantity;
                                            await axios.put(`${STOCK_URL}/${stock?.stockName}`, newStock);
                                            await axios.put(`${USER_PROFIT_URL}/${currentUser}`, newUserProfit);
                                            await getStockByStockName(params.stockName!);
                                            await getUserProfitByEmail(currentUser);

                                            Swal.fire({
                                                position: 'center',
                                                icon: 'success',
                                                title: 'Transaction done succesfully!',
                                                showConfirmButton: true,
                                            });

                                        }).catch(err => {
                                            console.log(err);
                                        });
                                    }
                                }).catch(err => {
                                    console.log(err);
                                });

                                let userProfitHistory: UserProfitHistory = {
                                    email: currentUser,
                                    money: money - (stock.stockPrice * quantity),
                                    transactionDate: moment(new Date()).format('YYYY-MM-DD')
                                }

                                await axios.post(`${USER_PROFIT_HISTORY_URL}`, userProfitHistory);
                            }
                        } else {
                            Swal.fire({
                                position: 'center',
                                icon: 'warning',
                                title: 'You dont have enough Money Available.',
                                showConfirmButton: true,
                            });
                        }
                    } else {
                        Swal.fire({
                            position: 'center',
                            icon: 'warning',
                            title: 'There is not enough Quantity Available! Check the data and Try Again.',
                            showConfirmButton: true,
                        });
                    }
                }
            }
        });
    }

    const handleClickViewInfo = () => {
        navigate(`/stockDetailedInfo/${params.stockName}`);
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getStockByStockName(params.stockName!);
        getUserProfitByEmail(currentUser);
        getUserProfileByEmail(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Buy Stock <FontAwesomeIcon icon={faArrowTrendUp} /></h1>
                <hr />
                <div className="flex flex-row justify-end">
                    <button onClick={() => handleClickViewInfo()} type="button" className="btn-primary w-56"><FontAwesomeIcon icon={faFileLines} /> View Detailed Info</button>
                </div>
            </div>

            <motion.div
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
                className="mt-20">
                <StockCardBig stock={stock} />
            </motion.div>

            {
                stock ?
                    stock.stockPrice > 0 ?
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                duration: 1,
                            }}
                            className="flex flex-row mt-20 container mx-auto rounded-md shadow-black/50 shadow-md p-5">
                            <div className="w-[20%] p-3">
                                <h3 className="font-bold mb-5">Buy Stocks</h3>
                                <form onSubmit={handleOnSubmitBuyStock} className="">
                                    <div className="mb-5">
                                        <label className="font-bold">Quantity</label>
                                        <input onChange={(e) => setQuantity(Number(e.target.value))} type={'number'} max={99999} className="form-control text-center" />
                                    </div>
                                    <div>
                                        <button disabled={quantity < 1} type='submit' className="btn-primary">Buy</button>
                                    </div>
                                </form>
                            </div>
                            <div className="w-[80%]">
                                <div>
                                    <h2 className="font-bold">Calculations</h2>
                                    <hr />
                                    <h3 className="font-bold mt-5 text-green-700"><u>${(stock?.stockPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</u> x <u>{quantity}</u> <span className="text-black">Stocks to buy = </span>
                                        <u>${((stock?.stockPrice ? stock.stockPrice : 0) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</u> Total</h3>

                                    <h3 className="font-bold mt-10 text-blue-600">${((stock?.stockPrice ? stock.stockPrice : 0) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-black">substracted from your account will leave a total of </span>${(userProfit?.money! - ((stock?.stockPrice ? stock.stockPrice : 0) * quantity)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                </div>
                            </div>
                        </motion.div>
                        :
                        <div className="flex flex-row mt-20 container mx-auto rounded-md shadow-black/50 shadow-md p-5">
                            <h1 className="font-bold text-red-700">This Stock's Value is 0! Or it probably went bakrupt. You cannot buy anymore shares.</h1>
                        </div>
                    : null
            }

            <motion.div
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
            >
                <UserProfitCard userProfit={userProfit} userProfile={userProfile} />
            </motion.div>
        </div>
    )
}

export default BuyStock;