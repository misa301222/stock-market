import { faArrowTrendUp, faPlus, faSuitcase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import authService from "../../Services/auth.service";
import { animate, motion } from "framer-motion"
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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

function ManageStocks() {
    const [stocks, setStocks] = useState<Stock[]>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getStockByOwnerEmail = async () => {
        let currentUser: string = authService.getCurrentUser!;
        if (currentUser) {
            await axios.get(`${STOCK_URL}/GetStocksByOwner/${currentUser}`).then(response => {
                console.log(response);
                setStocks(response.data);
                setIsLoading(false);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const handleOnClickNavigateToNewStock = () => {
        Swal.fire({
            title: 'Do you want to Add a New Stock?',
            text: "If you accept, you will be redirected to the new stock page.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/newStock');
            }
        });
    }

    useEffect(() => {
        getStockByOwnerEmail();
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Your Stocks <FontAwesomeIcon icon={faSuitcase} /></h1>
                <hr />
                <div className="text-right">
                    <button onClick={handleOnClickNavigateToNewStock} type="button" className="btn-primary p-2 w-[15rem]"><FontAwesomeIcon icon={faPlus} /> Add a New Stock</button>
                </div>
            </div>

            <div className="container mx-auto mt-10">
                <div className="flex flex-wrap gap-10 w-full mx-auto">

                    {!isLoading ?
                        stocks ?
                            stocks.map((element: Stock, index: number) => (
                                <motion.div
                                    key={index} className="stock-card cursor-pointer"
                                    whileHover={{
                                        scale: 1.15,
                                        transition: {
                                            type: "spring"
                                        }
                                    }}
                                    initial={{
                                        opacity: 0
                                    }}
                                    animate={{
                                        opacity: 1
                                    }}
                                >
                                    <div className="mt-1">
                                        <label>{element.stockName}</label>
                                    </div>

                                    <div className="h-[10rem] p-2 mt-2">
                                        <img className="h-[9rem] w-[9rem] mx-auto" src={`${element.stockLogoURL ? element.stockLogoURL : ''}`} />
                                    </div>

                                    <div className="">
                                        <div className="flex flex-row">
                                            <div className="w-1/2 text-right">
                                                <label>Price: </label>
                                            </div>

                                            <div className="w-1/2 text-left">
                                                <label>${element.stockPrice}</label>
                                            </div>
                                        </div>

                                        <div className="flex flex-row">
                                            <div className="w-1/2 text-right">
                                                <label>Stocks Left: </label>
                                            </div>

                                            <div className="w-1/2 text-left">
                                                <label>{element.stockQuantity}</label>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                            : null
                        :
                        <div className="stock-card cursor-pointer animate-pulse opacity-50">
                            <div className="mt-1">
                            </div>
                            <div className="h-[10rem] p-2 mt-2">
                            </div>

                            <div className="">
                                <div className="flex flex-row">
                                    <div className="w-1/2 text-right">
                                        <label className="text-slate-400">Price: </label>
                                    </div>

                                    <div className="w-1/2 text-left">

                                    </div>
                                </div>

                                <div className="flex flex-row">
                                    <div className="w-1/2 text-right">
                                        <label className="text-slate-400">Stocks Left: </label>
                                    </div>

                                    <div className="w-1/2 text-left">

                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ManageStocks;