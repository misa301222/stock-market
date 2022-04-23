import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authService from "../../Services/auth.service";
import StockCardBig from "../Cards/StockCardBig";
import { motion } from 'framer-motion';

interface StockBought {
    email: string,
    stockName: string,
    quantityBought: number,
    transactionDate: string,
    transactionTotal: number
}

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string
}

const STOCK_BOUGHT_URL = `${process.env.REACT_APP_API_URL}/StockBoughts`;
const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;

function StocksBought() {
    const params = useParams();
    const [stockBought, setStockBought] = useState<StockBought[]>();
    const [stock, setStock] = useState<Stock>();
    const [totalTransactionTotal, setTotalTransactionTotal] = useState<number>();

    const getStockBoughtByEmailAndStockName = async (email: string, stockName: string) => {
        let stockBoughtList: StockBought[] = [];
        await axios.get(`${STOCK_BOUGHT_URL}/GetStockBoughtByEmailAndStockName/${email}/${stockName}`).then(response => {
            console.log(response.data);
            stockBoughtList = response.data;
            setStockBought(response.data);
        }).catch(err => {
            console.log(err);
        });

        let totalTransaction: number = 0;
        for (let i = 0; i < stockBoughtList.length; i++) {
            totalTransaction += stockBoughtList[i].transactionTotal;
        }
        setTotalTransactionTotal(totalTransaction);
    }

    const getStockByStockName = async (stockName: string) => {
        await axios.get(`${STOCK_URL}/${stockName}`).then(response => {
            console.log(response);
            setStock(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        let stockName: string = params.stockName!;
        let email: string = authService.getCurrentUser!;

        getStockBoughtByEmailAndStockName(email, stockName);
        getStockByStockName(stockName);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Stock Bougth <FontAwesomeIcon icon={faFolderOpen} /></h1>
                <hr />
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

            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Stock Name
                            </th>

                            <th className="p-5">
                                Quantity Bought
                            </th>

                            <th className="p-5">
                                Date Of Transaction
                            </th>

                            <th className="p-5">
                                Transaction Total
                            </th>

                            <th className="p-5">
                                Unit/Price
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            stockBought?.map((element: StockBought, index: number) => (
                                <tr key={index}>
                                    <td className="p-5"><span className="font-bold text-blue-800 underline"><Link to={`/stockDetailedInfo/${element.stockName}`}>{element.stockName}</Link></span></td>
                                    <td className="p-5">{element.quantityBought}</td>
                                    <td className="p-5">{element.transactionDate.split('T')[0]}</td>
                                    <td className="p-5 font-bold">${(element.transactionTotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                    <td className="p-5 font-bold">${(element.transactionTotal / element.quantityBought).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
            <h2 className="font-bold mt-20">Total From Stocks Transaction(s): ${totalTransactionTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
        </div>
    )
}

export default StocksBought;
