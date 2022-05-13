import { faMoneyBillTrendUp, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { motion } from 'framer-motion';
import StockCard from "../Cards/StockCard";
import moment, { min } from "moment";
import StockCardBig from "../Cards/StockCardBig";
import Swal from "sweetalert2";

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: string,
    stockOwner: string,
    stockPriceYesterday?: number
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;

function AddStockQuantity() {
    const [stock, setStock] = useState<Stock>();
    const [search, setSearch] = useState<string>();
    const [notFound, setNotFound] = useState<boolean>();
    const [quantity, setQuantity] = useState<number>();

    const handleOnSubmitSearchStockForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        let yesterdayDate: string = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');

        const responseStock = await axios.get(`${STOCK_URL}/GetStockByStockName/${search}`);
        if (responseStock.data) {
            const responseStockHistory = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${responseStock.data.stockName}/${yesterdayDate}`);
            responseStock.data.stockPriceYesterday = responseStockHistory.data.stockPrice;

            setStock(responseStock.data);
            setNotFound(false);
        } else {
            setNotFound(true);
        }
    }

    const handleOnSubmitAddStockQuantity = async (event: SyntheticEvent) => {
        event.preventDefault();
        let newStock: Stock = stock!;
        newStock.stockQuantity += quantity!;
        await axios.put(`${STOCK_URL}/${stock?.stockName}`, newStock).then(response => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Transaction done succesfully!',
                showConfirmButton: true,
            }).then(async () => {
                await axios.get(`${STOCK_URL}/${newStock.stockName}`).then(response => {
                    setStock(response.data);
                });
            });
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Search Stocks <FontAwesomeIcon icon={faMoneyBillTrendUp} /></h1>
                <hr />
            </div>

            <form onSubmit={handleOnSubmitSearchStockForm} className="card mt-10">
                <div className="flex flex-row p-10 justify-center">
                    <div className="pr-5">
                        <label>Stock Name</label>
                    </div>

                    <div className="w-full">
                        <input onChange={(e) => setSearch(e.target.value)} className="form-control" placeholder="Type the name of the user you want to search.." />
                    </div>

                    <div className="pl-5">
                        <button type="submit" disabled={!search} className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    </div>

                </div>
            </form>

            {
                !notFound ?
                    stock ?
                        <div className="mt-20">
                            <StockCard stock={stock} />
                            <form onSubmit={handleOnSubmitAddStockQuantity} className="mt-20 card p-5">
                                <div>
                                    <div className="mb-10">
                                        <h2 className="font-bold mb-4">How many stocks do you want to add?</h2>
                                        <input onChange={(e) => setQuantity(Number(e.target.value))} className="text-center form-control w-[10rem]" type={'number'} />
                                    </div>

                                    <div className="">
                                        <button disabled={!quantity} type="submit" className="btn-primary">Accept</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        : null
                    :

                    <motion.h1
                        initial={{
                            opacity: 0
                        }}

                        animate={{
                            opacity: 1
                        }}
                        className="mt-20 font-bold mx-auto">No results found! Try searching again.</motion.h1>
            }
        </div>
    )
}

export default AddStockQuantity;