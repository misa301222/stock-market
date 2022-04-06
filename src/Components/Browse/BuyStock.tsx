import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

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
}

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_BOUGHT_URL = `${process.env.REACT_APP_API_URL}/StockBoughts`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;

function BuyStock() {
    const params = useParams();
    const [quantity, setQuantity] = useState<number>(0);
    const [stock, setStock] = useState<Stock>();

    const getStockByStockName = async (stockName: string) => {
        await axios.get(`${STOCK_URL}/${stockName}`).then(response => {
            console.log(response);
            setStock(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnSubmitBuyStock = async (event: SyntheticEvent) => {
        event.preventDefault();

        let currentUser: string = authService.getCurrentUser!;


        const responseIsEnough = await axios.get(`${STOCK_URL}/EnoughStocksAvailable/${stock?.stockName}/${quantity}`);
        if (currentUser && stock?.stockName) {
            if (responseIsEnough.data) {
                const response = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserPortfolioByEmailAndStockName/${currentUser}/${stock?.stockName}`);

                //IF EXISTS, MODIFY ADDING NEW QUANTITY, ELSE CREATE IT
                if (response.data) {
                    let userPorfolio: UserPortfolio = response.data;
                    userPorfolio.stockQuantity += quantity;

                    let stockBought: StockBought = {
                        email: currentUser,
                        stockName: stock?.stockName!,
                        quantityBought: quantity
                    }

                    await axios.post(`${STOCK_BOUGHT_URL}`, stockBought).then(async (response) => {
                        await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${currentUser}/${userPorfolio.stockName}`, userPorfolio).then(async (response) => {
                            console.log(response);
                            let newStock: Stock = stock!;
                            newStock.stockQuantity -= quantity;
                            await axios.put(`${STOCK_URL}/${stock?.stockName}`, newStock);
                            await getStockByStockName(params.stockName!);
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    let stockBought: StockBought = {
                        email: currentUser,
                        stockName: stock?.stockName,
                        quantityBought: quantity
                    }

                    let userPortfolio: UserPortfolio = {
                        email: currentUser,
                        stockName: stock.stockName,
                        stockQuantity: quantity,
                        stockPrice: stock.stockPrice
                    }

                    await axios.post(`${STOCK_BOUGHT_URL}`, stockBought).then(async (response) => {
                        console.log(response);
                        if (response.data) {
                            await axios.post(`${USER_PORTFOLIOS_URL}`, userPortfolio).then(async (response) => {
                                console.log(response);
                                let newStock: Stock = stock!;
                                newStock.stockQuantity -= quantity;
                                await axios.put(`${STOCK_URL}/${stock?.stockName}`, newStock);
                                await getStockByStockName(params.stockName!);
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                    }).catch(err => {
                        console.log(err);
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

    useEffect(() => {
        getStockByStockName(params.stockName!);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Buy Stock <FontAwesomeIcon icon={faArrowTrendUp} /></h1>
                <hr />
            </div>

            <div className="mt-20">
                <div className="flex flex-row w-[80%] mx-auto border-gray-300 border p-5 rounded-md shadow-md shadow-black/50">
                    <div className="w-[30%]">
                        <img className="w-80 h-80" src={`${stock?.stockLogoURL ? stock.stockLogoURL : '/images/NotFound.png'}`} />
                    </div>

                    <div className="w-[70%]">
                        <div className="mb-2">
                            <h1 className="font-bold">{stock?.stockName}</h1>
                        </div>
                        <div className="mb-10">
                            <h5 className="line-clamp-4">{stock?.stockDescription}</h5>
                        </div>
                        <div className="mb-2">
                            <h2><b>Stocks Left:</b> {stock?.stockQuantity}</h2>
                        </div>
                        <div className="mb-2">
                            <h2><b>Current Price:</b> ${stock?.stockPrice}</h2>
                        </div>

                        <div className="mb-2">
                            <h2><b>Sold By:</b> {stock?.stockOwner}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row mt-20 container mx-auto rounded-md shadow-black/50 shadow-md p-5">
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
                        <h3 className="font-bold mt-2"><u>${stock?.stockPrice}</u> x <u>{quantity}</u> Stocks to buy = <u>${(stock?.stockPrice ? stock.stockPrice : 0) * quantity}</u> Total</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BuyStock;