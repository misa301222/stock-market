import { faCircleInfo, faCoins, faCompass, faFileLines, faFireAlt, faList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import StockCard from "../Cards/StockCard";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import StockCardGold from "../Cards/StockCardGold";
import moment from "moment";

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string,
    stockPriceYesterday?: number
}

interface StockBought {
    email: string,
    stockName: string,
    quantityBought: number
    transactionDate: string,
    transactionTotal: number
}

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: any,
    stockPrice: number
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_BOUGHT_URL = `${process.env.REACT_APP_API_URL}/StockBoughts`;
const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;

function Browse() {
    const [searchStock, setSearchStock] = useState<string>();
    const [stocks, setStocks] = useState<Stock[]>();
    const [selectedStock, setSelectedStock] = useState<Stock>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [lastStocks, setLastStocks] = useState<Stock[]>();
    const [trendingStocks, setTrendingStocks] = useState<Stock[]>();
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

        const responseStocks = await axios.get(`${STOCK_URL}/GetStockByStockNameLike/${searchStock}`);
        let yesterdayDate: string = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
        let stockArray: Stock[] = [];
        for (let i = 0; i < responseStocks.data.length; i++) {
            let stock: Stock = responseStocks.data[i];

            const responseStockHistory = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${stock.stockName}/${yesterdayDate}`);
            stock.stockPriceYesterday = responseStockHistory.data.stockPrice;

            stockArray.push(stock);
        }
        setStocks(stockArray);
    }

    const handleClickViewInfo = (stockName: string) => {
        navigate(`/stockDetailedInfo/${stockName}`);
    }

    const getStocksLastTwenty = async () => {
        const responseLastStocks = await axios.get(`${STOCK_URL}/GetStocksLastTwenty`);

        let yesterdayDate: string = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
        let lastStocksArray: Stock[] = [];
        for (let i = 0; i < responseLastStocks.data.length; i++) {
            let stock: Stock = responseLastStocks.data[i];

            const responseStockHistory = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${stock.stockName}/${yesterdayDate}`);
            stock.stockPriceYesterday = responseStockHistory.data.stockPrice;
            lastStocksArray.push(stock);
        }
        setLastStocks(lastStocksArray);
    }

    const getTrendingStocks = async () => {
        const stockNames = await axios.get(`${STOCK_BOUGHT_URL}/GetFrequentlyBoughtStocks`);
        let stocks: Stock[] = [];
        for (let i = 0; i < stockNames.data.length; i++) {
            let stockName: string = stockNames.data[i].stockName;
            const stock = await axios.get(`${STOCK_URL}/${stockName}`);
            stocks.push(stock.data);
        }

        let yesterdayDate: string = moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD');
        let stocksTrendingArray: Stock[] = [];
        for (let i = 0; i < stocks.length; i++) {
            let stock: Stock = stocks[i];

            const responseStockHistory = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${stock.stockName}/${yesterdayDate}`);
            stock.stockPriceYesterday = responseStockHistory.data.stockPrice;

            stocksTrendingArray.push(stock);
        }

        setTrendingStocks(stocksTrendingArray);
    }

    useEffect(() => {
        // Some synchronous code.

        (async () => {
            await getStocksLastTwenty();
            await getTrendingStocks();
        })();

        return () => {
            // Component unmount code.
        };
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Browse <FontAwesomeIcon icon={faCompass} /></h1>
                <hr />
                <form onSubmit={handleOnSubmitSearchForm} className="flex flex-row w-1/4 gap-5 ml-auto mt-2">
                    <button disabled={!searchStock} type="submit" className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    <input onChange={(e) => setSearchStock(e.target.value)} className="form-control" type={'text'} maxLength={25} placeholder={'Type the name of a stock...'} />
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
                <h2 className="header mt-10">Last Stocks <FontAwesomeIcon icon={faList} /></h2>
                <hr />
            </div>

            <div className="flex flex-wrap gap-10 w-4/5 mx-auto mt-10 justify-center">
                {
                    lastStocks?.map((element: Stock, index: number) => (
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

            {
                trendingStocks?.length ?
                    <div className="container mx-auto">
                        <h2 className="header mt-10">Trending <FontAwesomeIcon icon={faFireAlt} /></h2>
                        <hr />
                    </div>
                    : null
            }

            <div className="flex flex-wrap gap-10 w-4/5 mx-auto mt-10 justify-center">
                {
                    trendingStocks?.map((element: Stock, index: number) => (
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
                            <StockCardGold stock={element} />
                        </motion.div>
                    ))
                }
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
                                    {
                                        selectedStock?.stockPriceYesterday ?
                                            <div className="mb-2">
                                                <h2><b>Yesterday's Price:</b> ${selectedStock?.stockPriceYesterday!.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                            </div>
                                            : null
                                    }
                                    <div className="mb-2">
                                        <h2><b>Current Price:</b> ${selectedStock?.stockPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
                                    </div>
                                    {
                                        selectedStock?.stockPriceYesterday ?
                                            <div className="mb-2">
                                                <h2><b>Difference:</b> <span style={{
                                                    color: `${(selectedStock?.stockPrice! - selectedStock?.stockPriceYesterday!) > 0 ? 'green' : 'red'}`
                                                }}>{(selectedStock?.stockPrice! - selectedStock?.stockPriceYesterday!) > 0 ? '+' : ''}{(selectedStock?.stockPrice! - selectedStock?.stockPriceYesterday!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></h2>
                                            </div>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">
                            <button type="button"
                                className="btn-primary w-56"
                                onClick={() => handleClickViewInfo(selectedStock?.stockName!)}>
                                <FontAwesomeIcon icon={faFileLines} /> View Detailed Info
                            </button>

                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                            <button onClick={() => handleOnClickBuyStock(selectedStock?.stockName!)} type="button"
                                className="btn-primary">
                                <FontAwesomeIcon icon={faCoins} /> Buy Stocks
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Browse;