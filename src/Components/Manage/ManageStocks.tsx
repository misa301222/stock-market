import { faArrowTrendUp, faCircleInfo, faPlus, faSuitcase, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import authService from "../../Services/auth.service";
import { animate, motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import StockCard from "../Cards/StockCard";

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
    const [selectedStock, setSelectedStock] = useState<Stock>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

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

    const handleOpenModal = (selectedStock: Stock) => {
        setIsOpen(true);
        setSelectedStock(selectedStock);
    }

    const handleOnClickDeleteStock = async () => {
        console.log(selectedStock);
        if (selectedStock) {
            Swal.fire({
                title: 'Are you sure you want to delete your stock?',
                text: "If you accept, everyone will lose the stock and you will lose all the utilities you have.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes!'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    setIsOpen(false);
                    await axios.delete(`${STOCK_URL}/${selectedStock.stockName}`).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err);
                    });

                    await getStockByOwnerEmail();
                }
            });
        }
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
                        stocks?.length ?
                            stocks.map((element: Stock, index: number) => (
                                <motion.div
                                    key={index} className=""
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
                                    onClick={() => handleOpenModal(element)}
                                >
                                    <StockCard stock={element} />
                                </motion.div>
                            ))
                            : <h1 className="font-bold text-red-600 mt-40">It seems you don't have any stocks yet. You can try adding some stocks
                                <Link to={'/newStock'} className='text-blue-500 underline'> here.</Link></h1>
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

            <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Stock Information <FontAwesomeIcon icon={faCircleInfo} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <div className="flex flex-row">
                                <div className="w-[30%]">
                                    <img className="w-80 h-80" src={`${selectedStock?.stockLogoURL ? selectedStock.stockLogoURL : '/images/NotFound.png'}`} />
                                </div>

                                <div className="w-[70%]">
                                    <div className="mb-2">
                                        <h1 className="font-bold">{selectedStock?.stockName}</h1>
                                    </div>
                                    <div className="mb-10">
                                        <h5 className="line-clamp-4">{selectedStock?.stockDescription}</h5>
                                    </div>
                                    <div className="mb-2">
                                        <h2><b>Stocks Left:</b> {selectedStock?.stockQuantity}</h2>
                                    </div>
                                    <div className="mb-2">
                                        <h2><b>Current Price:</b> ${selectedStock?.stockPrice}</h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col bg-black/80 rounded-md mt-10 p-2">
                                <div className="mb-2">
                                    <h3 className="text-gray-200 font-bold">TOOLS <FontAwesomeIcon className="text-amber-300" icon={faWarning} /></h3>
                                </div>
                                <div>
                                    <button onClick={async () => handleOnClickDeleteStock()} type="button" className="btn-danger">Delete Sock</button>
                                </div>
                            </div>
                        </div>
                        <div
                            className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button type="button"
                                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                            <button type="button"
                                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>


        </div>
    )
}

export default ManageStocks;