import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;

function AddNewStock() {
    const navigate = useNavigate();
    const [stock, setStock] = useState<Stock>({
        stockName: '',
        stockDescription: '',
        stockPrice: 0,
        stockQuantity: 0,
        stockLogoURL: '',
        dateAdded: new Date,
        stockOwner: ''
    });

    const handleOnChangeStockName = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockName: event.target.value }));
    }

    const handleOnChangeStockDescription = (event: ChangeEvent<HTMLInputElement>) => {
        setStock(prev => ({ ...prev, stockDesription: event.target.value }));
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
            newStock.dateAdded = new Date();
            newStock.stockOwner = currentUser;
            await saveNewStock(newStock);
        }
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Add New Stock <FontAwesomeIcon icon={faBusinessTime} /></h1>
                <hr />
            </div>

            <div className="container mx-auto mt-16">
                <form onSubmit={handleOnSubmitAddNewStock} className="card p-5 bg-gradient-to-r from-slate-100 via-white to-slate-100">
                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Name
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
                            <input onChange={handleOnChangeStockDescription} className="form-control" type={'text'} maxLength={40} placeholder='Type a Description' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Price
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input onChange={handleOnChangeStockPrice} className="form-control" type={'number'} maxLength={40} placeholder='Type a Price' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Quantity
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
                            <input onChange={handleOnChangeStockLogoURL} className="form-control" type={'text'} maxLength={40} placeholder='Paste Your Logo URL' />
                        </div>
                    </div>

                    <div className="text-center mt-20 mb-10">
                        <button type="submit" className="btn-primary">Add New Stock</button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddNewStock;