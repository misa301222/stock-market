import { faBusinessTime } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
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

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;

function UpdateStock() {
    const params = useParams();
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

    const getStockByName = async (stockName: string) => {
        await axios.get(`${STOCK_URL}/${stockName}`).then(response => {
            setStock(response.data);
        });
    }

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

    const handleOnSubmitUpdateStock = async (event: SyntheticEvent) => {
        event.preventDefault();

        await axios.put(`${STOCK_URL}/${stock.stockName}`, stock);

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Transaction done succesfully!',
            showConfirmButton: true,
        }).then(() => {
            navigate('/settings/manageStocks');
        });
    }

    useEffect(() => {
        const stockName: string = params.stockName!;
        getStockByName(stockName);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Update Stock <FontAwesomeIcon icon={faBusinessTime} /></h1>
                <hr />
            </div>

            <div className="mt-16 flex flex-row justify-evenly">
                <form onSubmit={handleOnSubmitUpdateStock} className="mx-0 card p-5">
                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Name <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input value={stock.stockName} disabled className="form-control" type={'text'} maxLength={40} placeholder='Type a Name' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Description
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input value={stock.stockDescription} onChange={handleOnChangeStockDescription} className="form-control" type={'text'} maxLength={80} placeholder='Type a Description' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Price <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input value={stock.stockPrice} disabled className="form-control" type={'number'} maxLength={40} placeholder='Type a Price' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-5">
                        <div className="w-1/5 text-right mr-4">
                            <label>
                                Stock Quantity <span className="text-red-600 font-bold">*</span>
                            </label>
                        </div>

                        <div className="w-4/5">
                            <input disabled value={stock.stockQuantity} className="form-control" type={'number'} maxLength={40} placeholder='Type your Quantity' />
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
                        <button type="submit" disabled={!stock.stockName || !stock.stockPrice || !stock.stockQuantity} className="btn-primary w-40">Update New Stock</button>
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
        </div>
    )
}

export default UpdateStock;