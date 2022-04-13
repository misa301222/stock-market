import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authService from "../../Services/auth.service";

interface StockBought {
    email: string,
    stockName: string,
    quantityBought: number,
    transactionDate: string,
    transactionTotal: number
}

const STOCK_BOUGHT_URL = `${process.env.REACT_APP_API_URL}/StockBoughts`;

function StocksBought() {
    const params = useParams();
    const [stockBought, setStockBought] = useState<StockBought[]>();

    const getStockBoughtByEmailAndStockName = async (email: string, stockName: string) => {
        await axios.get(`${STOCK_BOUGHT_URL}/GetStockBoughtByEmailAndStockName/${email}/${stockName}`).then(response => {
            console.log(response.data);
            setStockBought(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        let stockName: string = params.stockName!;
        let email: string = authService.getCurrentUser!;

        getStockBoughtByEmailAndStockName(email, stockName);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Your Dashboard <FontAwesomeIcon icon={faFolderOpen} /></h1>
                <hr />
            </div>

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

export default StocksBought;
