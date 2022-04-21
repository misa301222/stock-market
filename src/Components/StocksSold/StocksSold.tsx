import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import authService from "../../Services/auth.service";
import StockCardBig from "../Cards/StockCardBig";

interface StockSold {
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

const STOCK_SOLD_URL = `${process.env.REACT_APP_API_URL}/StockSolds`;
const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;

function StocksSold() {
    const params = useParams();
    const [stockSold, setStockSold] = useState<StockSold[]>();
    const [stock, setStock] = useState<Stock>();
    const [totalTransactionTotal, setTotalTransactionTotal] = useState<number>();

    const getStockSoldByEmailAndStockName = async (email: string, stockName: string) => {
        let stockBoughtList: StockSold[] = [];
        await axios.get(`${STOCK_SOLD_URL}/GetStockBoughtByEmailAndStockName/${email}/${stockName}`).then(response => {
            stockBoughtList = response.data;
            setStockSold(response.data);
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

        getStockSoldByEmailAndStockName(email, stockName);
        getStockByStockName(stockName);
    }, []);

    return (
        <div>

            <div className="container mx-auto">
                <h1 className="header mt-10">Stock Sold <FontAwesomeIcon icon={faFolderOpen} /></h1>
                <hr />
            </div>

            <div className="mt-20">
                <StockCardBig stock={stock} />
            </div>

            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Stock Name
                            </th>

                            <th className="p-5">
                                Quantity Sold
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
                            stockSold?.map((element: StockSold, index: number) => (
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

export default StocksSold;