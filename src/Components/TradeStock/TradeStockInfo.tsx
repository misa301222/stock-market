import { faArrowRight, faInfo, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    eduaction: string[],
    imagesURL: string[],
    fullName?: string
}

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    stockPriceYesterday?: number
}

interface TradeStockHistory {
    sourceEmail: string,
    destinyEmail: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    transactionDate: Date,
    status: string
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;

function TradeStockInfo() {
    const [userSource, setUserSource] = useState<UserProfile>();
    const [userDestiny, setUserDestiny] = useState<UserProfile>();
    const [userPortfolio, setUserPortfolio] = useState<UserPortfolio[]>();
    const params = useParams();
    const [selectedStock, setSelectedStock] = useState<UserPortfolio>();
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<string>();
    const navigate = useNavigate();

    const getUserProfilesSourceAndDestiny = async () => {
        const currentUser: string = authService.getCurrentUser!;
        const responseUser = await axios.get(`${USER_URL}/GetCurrentUser/${currentUser}`);
        await axios.get(`${USER_PROFILE_URL}/${currentUser}`).then(response => {
            response.data.fullName = responseUser.data.dataSet.fullName;
            setUserSource(response.data);
        }).catch(err => {
            console.log(err);
        });

        const responseUserDestiny = await axios.get(`${USER_URL}/GetCurrentUser/${params.email}`);
        await axios.get(`${USER_PROFILE_URL}/${params.email}`).then(response => {
            response.data.fullName = responseUserDestiny.data.dataSet.fullName;
            setUserDestiny(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const getUserPortfolioByEmail = async (email: string) => {
        await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmail/${email}`).then(response => {
            setUserPortfolio(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnChangeSelectedStock = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value);
        for (let i = 0; i < userPortfolio?.length!; i++) {
            if (userPortfolio![i].stockName === event.target.value) {
                setSelectedStock(userPortfolio![i]);
                setPrice(0);
                setQuantity(0);
            }
        }
    }

    const handleOnClickSendOffer = async () => {
        Swal.fire({
            title: `Are you sure you want to send the offer?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {

                let tradeStockHistory: TradeStockHistory = {
                    sourceEmail: userSource?.email!,
                    destinyEmail: userDestiny?.email!,
                    stockName: selectedStock?.stockName!,
                    stockQuantity: quantity,
                    stockPrice: price,
                    status: 'PENDING',
                    transactionDate: new Date()
                }

                await axios.post(`${TRADE_STOCK_HISTORY_URL}`, tradeStockHistory).then(response => {
                    console.log(response.data);
                }).catch(err => {
                    console.log(err);
                });

                const response = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${userSource?.email}/${selectedStock?.stockName}`);
                let userPortfolio: UserPortfolio = response.data;
                userPortfolio.stockQuantity -= quantity;
                await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${userSource?.email}/${selectedStock?.stockName}`, userPortfolio);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Transaction done succesfully!',
                    showConfirmButton: true,
                }).then(() => {
                    navigate('/tradeStocks/currentTrades');
                });
            }
        });
    }


    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getUserProfilesSourceAndDestiny();
        getUserPortfolioByEmail(currentUser);
        setCurrentUser(currentUser);
    }, [])

    return (
        <div>
            {
                currentUser !== params.email ?
                    <div className="mt-20">
                        <div className="container mx-auto">
                            <h1 className="header mt-10">Trade Information <FontAwesomeIcon icon={faInfoCircle} /></h1>
                            <hr />
                        </div>
                        <div className="mt-10">
                            <div className="card flex flex-row justify-content-evenly p-5 items-center">
                                <div>
                                    <div style={{
                                        backgroundImage: `url(${userSource?.profilePictureURL})`,
                                        backgroundSize: 'cover',
                                        height: '10rem',
                                        width: '10rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)',
                                        margin: '0 auto'
                                    }}></div>

                                    <h3 className="mt-2 font-bold">{userSource?.fullName}</h3>

                                </div>

                                <div className="">
                                    <FontAwesomeIcon icon={faArrowRight} className='text-[8rem]' />
                                    <h3 className="mt-2 font-bold underline">Trading</h3>
                                </div>
                                <div>
                                    <motion.div
                                        whileHover={{
                                            scale: 1.1
                                        }}
                                        onClick={() => navigate(`/userProfile/${userDestiny?.email}`)} style={{
                                            backgroundImage: `url(${userDestiny?.profilePictureURL})`,
                                            backgroundSize: 'cover',
                                            height: '10rem',
                                            width: '10rem',
                                            borderRadius: '12px',
                                            boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)',
                                            margin: '0 auto',
                                            cursor: 'pointer'
                                        }}></motion.div>

                                    <h3 className="mt-2 font-bold">{userDestiny?.fullName}</h3>

                                </div>
                            </div>
                        </div>

                        <div className="mt-20 container mx-auto">
                            <div className="flex flex-row justify-content-evenly gap-5">
                                <div className="card p-5">
                                    <h2 className="font-bold">Your Stocks</h2>
                                    <hr />

                                    <select className="form-control mt-10 cursor-pointer text-center" onChange={(e) => handleOnChangeSelectedStock(e)} defaultValue={-1}>
                                        <option value={-1} disabled>Select a value</option>
                                        {
                                            userPortfolio?.map((element: UserPortfolio, index: number) => (
                                                <option key={index} value={element.stockName}>{element.stockName}</option>
                                            ))
                                        }
                                    </select>
                                    {
                                        selectedStock ?
                                            <h3 className="mt-5"><span className="font-bold">Current Price of Selected Stock is:</span> ${selectedStock?.stockPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                            : null
                                    }

                                </div>

                                <div className="card p-5">
                                    <h2 className="font-bold">Price</h2>
                                    <hr />

                                    <input value={price} onChange={(e) => setPrice(Number(e.target.value))} className="form-control mt-10 text-center" type={'number'} placeholder={'Insert the Custom Price...'} />
                                </div>

                                <div className="card p-5">
                                    <h2 className="font-bold">Quantity</h2>
                                    <hr />

                                    <input value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="form-control mt-10 text-center" type={'number'} placeholder={'Insert the Custom Quantity...'} />
                                </div>


                            </div>

                            <div className="card p-5 mt-10">
                                <h2 className="font-bold">Review</h2>
                                <hr />
                                {
                                    selectedStock || !quantity || !price ?
                                        <h3 className="mt-5"><span className="font-bold">Calculations with actual price: </span> ${selectedStock?.stockPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })} x {quantity}
                                            = <span className="font-bold underline text-green-600">${(selectedStock?.stockPrice! * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })} </span></h3>
                                        : null
                                }

                                {
                                    selectedStock || !quantity || !price ?
                                        <h3 className="mt-5"><span className="font-bold">You're Selling: </span> ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })} x {quantity}
                                            = <span className="font-bold underline text-green-600">${(price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })} </span></h3>
                                        : null
                                }
                                <button disabled={!selectedStock || !quantity || !price} onClick={() => handleOnClickSendOffer()} className="btn-primary mt-10">Send Offer</button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="mt-60">
                        <h2 className="text-red-600 font-bold">You can't make a trade with yourself! <Link className="text-blue-400 underline hover:text-blue-600 duration-150 ease-in-out"
                            to={'/tradeStocks/newTrade'}>Go Back</Link></h2>
                    </div>
            }
        </div>

    )
}

export default TradeStockInfo;