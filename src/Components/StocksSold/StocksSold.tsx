import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "../../Services/auth.service";

interface StockSold {
    email: string,
    stockName: string,
    quantityBought: number,
    transactionDate: string,
    transactionTotal: number
}

const STOCK_SOLD_URL = `${process.env.REACT_APP_API_URL}/StockSolds`;

function StocksSold() {
    const params = useParams();
    const [stockSold, setStockSold] = useState<StockSold[]>();

    const getStockSoldByEmailAndStockName = async (email: string, stockName: string) => {
        await axios.get(`${STOCK_SOLD_URL}/GetStockBoughtByEmailAndStockName/${email}/${stockName}`).then(response => {
            setStockSold(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        let stockName: string = params.stockName!;
        let email: string = authService.getCurrentUser!;

        getStockSoldByEmailAndStockName(email, stockName);
    }, []);

    return (
        <div>
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
                                    <td className="p-5"><span className="font-bold">{element.stockName}</span></td>
                                    <td className="p-5">{element.quantityBought}</td>
                                    <td className="p-5">{element.transactionDate.split('T')[0]}</td>
                                    <td className="p-5">${(element.transactionTotal).toFixed(2)}</td>
                                    <td className="p-5">${(element.transactionTotal / element.quantityBought).toFixed(2)}</td>
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default StocksSold;