import { faCircleInfo, faCompass, faFireAlt, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useState } from "react";
import StockCard from "../Cards/StockCard";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

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

function Browse() {
    const [searchStock, setSearchStock] = useState<string>();
    const [stocks, setStocks] = useState<Stock[]>();
    const [selectedStock, setSelectedStock] = useState<Stock>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

    const handleOpenModal = (selectedStock: Stock) => {
        setIsOpen(true);
        setSelectedStock(selectedStock);
    }

    const handleOnClickBuyStock = (stockName: string) => {
        navigate(`/buyStock/${stockName}`);
    }

    const handleOnSubmitSearchForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        await axios.get(`${STOCK_URL}/GetStockByStockNameLike/${searchStock}`).then(response => {
            setStocks(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleClickViewInfo = (stockName: string) => {
        navigate(`/stockDetailedInfo/${stockName}`);
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Browse <FontAwesomeIcon icon={faCompass} /></h1>
                <hr />
                <form onSubmit={handleOnSubmitSearchForm} className="flex flex-row w-1/4 gap-5 ml-auto mt-2">
                    <button disabled={!searchStock} type="submit" className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    <input onChange={(e) => setSearchStock(e.target.value)} className="form-control" type={'text'} maxLength={25} />
                </form>
            </div>

            <div className="flex justify-center flex-wrap mt-20 mb-10 w-4/5 mx-auto gap-10">
                {
                    stocks?.map((element: Stock, index: number) => (
                        <motion.div key={index}
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
                            className='text-center'
                            onClick={() => handleOpenModal(element)}
                        >
                            <StockCard stock={element} />
                        </motion.div>
                    ))
                }
            </div>

            <div className="container mx-auto">
                <h2 className="header mt-10">Trending <FontAwesomeIcon icon={faFireAlt} /></h2>
                <hr />
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
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">
                            <button type="button"
                                className="btn-primary"
                                onClick={() => handleClickViewInfo(selectedStock?.stockName!)}>
                                View Detailed Info
                            </button>

                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                            <button onClick={() => handleOnClickBuyStock(selectedStock?.stockName!)} type="button"
                                className="btn-primary">
                                Buy Stocks
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Browse;