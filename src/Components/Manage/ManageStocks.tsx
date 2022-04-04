import { faArrowTrendUp, faCircleInfo, faPlus, faSuitcase } from "@fortawesome/free-solid-svg-icons";
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
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
                                    onClick={() => setIsOpen(true)}
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
            <button data-bs-toggle="modal" data-bs-target="#exampleModalCenteredScrollable" type="button">asd</button>
            {/* <button onClick={() => setIsOpen(true)} type="button">asd</button> */}
            
                <div className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                    <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                        <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                                <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                    Stock Information <FontAwesomeIcon icon={faCircleInfo} />
                                </h5>
                                <button type="button"
                                    className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                    data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body relative p-4">
                                <p>This is some placeholder content to show a vertically centered modal. We've added some extra copy here to show how vertically centering the modal works when combined with scrollable modals. We also use some repeated line breaks to quickly extend the height of the content, thereby triggering the scrolling. When content becomes longer than the predefined max-height of modal, content will be cropped and scrollable within the modal.</p>

                                <p>Just like that.</p>
                            </div>
                            <div
                                className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                                <button type="button"
                                    className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                    data-bs-dismiss="modal">
                                    Close
                                </button>
                                <button type="button"
                                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             

        </div>
    )
}

export default ManageStocks;