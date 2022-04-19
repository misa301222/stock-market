import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
import StockCard from "../Cards/StockCard";

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: string,
    stockOwner: string
}

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: any,
    stockPrice: number
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;

function AddNewStock() {
    const navigate = useNavigate();
    const [stock, setStock] = useState<Stock>({
        stockName: '',
        stockDescription: '',
        stockPrice: 0,
        stockQuantity: 0,
        stockLogoURL: '',
        dateAdded: '',
        stockOwner: ''
    });

    const handleOnChangeStockName = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockName: event.target.value }));
    }

    const handleOnChangeStockDescription = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockDescription: event.target.value }));
    }

    const handleOnChangeStockPrice = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockPrice: Number(event.target.value) }));
    }

    const handleOnChangeStockQuantity = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockQuantity: Number(event.target.value) }));
    }

    const handleOnChangeStockLogoURL = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockLogoURL: event.target.value }));
    }

    const saveNewStock = async (newStock: Stock) => {
        console.log(newStock);
        await axios.post(`${STOCK_URL}`, newStock).then(response => {
            console.log(response);
            Swal.fire({
                title: 'Stock Added Successfully!',
                text: "Do you want to add another?",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then((result) => {
                if (result.isDismissed) {
                    navigate('/newStock');
                }
            });
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnSubmitAddNewStock = async (event: SyntheticEvent) => {
        event.preventDefault();
        let currentUser: string = authService.getCurrentUser!;
        if (currentUser) {
            let newStock: Stock = stock;
            newStock.dateAdded = moment(new Date()).format('YYYY-MM-DD');
            newStock.stockOwner = currentUser;
            await saveNewStock(newStock);            

            let newStockHistory: StockHistory = {
                stockId: 0,
                stockName: newStock.stockName,
                stockDate: newStock.dateAdded,
                stockPrice: newStock.stockPrice
            }

            await axios.post(`${STOCK_HISTORY_URL}`, newStockHistory).then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Add New Stock <FontAwesomeIcon icon={faBusinessTime} /></h1>
                <hr />
            </div>

            <div className="mt-16 flex flex-row justify-evenly">
                <form onSubmit={handleOnSubmitAddNewStock} className="mx-0 card p-5">
                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Name <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockName} className="form-control" type={'text'} maxLength={40} placeholder='Type a Name' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Description
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockDescription} className="form-control" type={'text'} maxLength={80} placeholder='Type a Description' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Price <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockPrice} className="form-control" type={'number'} maxLength={40} placeholder='Type a Price' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Quantity <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockQuantity} className="form-control" type={'number'} maxLength={40} placeholder='Type your Quantity' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Logo URL
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockLogoURL} className="form-control" type={'text'} placeholder='Paste Your Logo URL' />
                        </div>
                    </div>

                    <div className="text-center mt-20 mb-10">
                        <button type="submit" disabled={!stock.stockName || !stock.stockPrice || !stock.stockQuantity} className="btn-primary">Add New Stock</button>
                    </div>

                    <div className="mt-10 text-left">
                        <h5> <span className="text-red-600 font-bold">*</span> Required Data</h5>
                    </div>

                </form>

                <div className="">
                    <h3 className="font-bold">Preview</h3>
                    <h5 className="text-gray-400 underline mb-10">This is how your stock will be presented to the world</h5>
                    <StockCard stock={stock} />
                </div>

            </div>
        </div >
    )
}

export default AddNewStock;