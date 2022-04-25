import { faArrowRotateRight, faDatabase, faPencil, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import Swal from "sweetalert2";

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: any,
    stockPrice: number
}

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string
}

interface UserPortfolio {
    email: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number
}

const STOCK_URL = `${process.env.REACT_APP_API_URL}/Stocks`;
const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;

function ManageStockHistory() {
    const [stockHistory, setStockHistory] = useState<StockHistory[]>();
    const [search, setSearch] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
    const [isRangeOpen, setIsRangeOpen] = useState<boolean>(false);
    const [stock, setStock] = useState<Stock[]>();
    const [fromDate, setFromDate] = useState<string>();
    const [toDate, setToDate] = useState<string>();
    const [newStockHistory, setNewStockHistory] = useState<StockHistory>({
        stockId: 0,
        stockName: '',
        stockDate: new Date(),
        stockPrice: 0
    });
    const [selectedStockHistory, setSelectedStockHistory] = useState<StockHistory>({
        stockId: 0,
        stockName: '',
        stockDate: new Date(),
        stockPrice: 0
    });

    const getStockHistoryByStockName = async () => {
        await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockName/${search}`).then(response => {
            //console.log(response);
            setStockHistory(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnChangeStockName = (event: ChangeEvent<HTMLInputElement>) => {
        setNewStockHistory(prev => ({ ...prev, stockName: event.target.value }))
    }

    const handleOnChangeStockDate = (event: any) => {
        setNewStockHistory(prev => ({ ...prev, stockDate: event.target.value }))
    }

    const handleOnChangeStockPrice = (event: ChangeEvent<HTMLInputElement>) => {
        setNewStockHistory(prev => ({ ...prev, stockPrice: Number(event.target.value) }))
    }
    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

    const handleOnSubmitSearchForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        await getStockHistoryByStockName();
    }

    const handleOnClickAddNewStockHistory = () => {
        setIsOpen(true);
    }

    const handleOnSubmitNewStockHistory = async (event: SyntheticEvent) => {
        event.preventDefault();
        let addStock: StockHistory = newStockHistory;
        addStock.stockDate = new Date(addStock.stockDate).toISOString().split('T')[0];
        await axios.post(`${STOCK_HISTORY_URL}/`, addStock).then(response => {

        }).catch(err => {
            console.log(err);
        });

        await getStockHistoryByStockName();
    }

    const handleOpenEditModal = (stockHistory: StockHistory) => {
        setIsEditOpen(true);
        setSelectedStockHistory(stockHistory);
        console.log(stockHistory);
    }

    const handleOnChangeSelectedStockDate = (event: any) => {
        setSelectedStockHistory(prev => ({ ...prev, stockDate: event.target.value }))
    }

    const handleOnChangeSelectedStockPrice = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedStockHistory(prev => ({ ...prev, stockPrice: Number(event.target.value) }))
    }

    const handleOnSubmitEditStockHistory = async (event: SyntheticEvent) => {
        event.preventDefault();

        await axios.put(`${STOCK_HISTORY_URL}/${selectedStockHistory.stockId}`, selectedStockHistory).then(response => {
            //console.log(response);
        }).catch(err => {
            console.log(err);
        });
        const responseStock = await axios.get(`${STOCK_URL}/${selectedStockHistory.stockName}`);
        let editedStock: Stock = responseStock.data;
        editedStock.stockPrice = selectedStockHistory.stockPrice;
        console.log(editedStock);
        await axios.put(`${STOCK_URL}/${editedStock.stockName}`, editedStock).then(response => {

        }).catch(err => {
            console.log(err);
        });

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Operation done succesfully!',
            showConfirmButton: true,
        });

        await getStockHistoryByStockName();
    }

    const handleOnClickUpdateToday = async () => {
        let dateToday: string = moment(new Date()).format('YYYY-MM-DD');
        console.log(dateToday);

        const response = await axios.get(`${STOCK_URL}`);
        setStock(response.data);
        if (response.data.length) {
            let stocks: Stock[] = response.data;
            for (let i = 0; i < response.data.length; i++) {
                stocks[i] = response.data[i];

                const stockToday = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${stocks[i].stockName}/${dateToday}`);
                // IF EXISTS DO A PUT, IF NOT POST
                if (stockToday.data) {
                    let editedStock: StockHistory = stockToday.data;
                    editedStock.stockPrice = Math.floor(Math.random() * 2000);
                    await axios.put(`${STOCK_HISTORY_URL}/${stockToday.data.stockId}`, editedStock).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err);
                    });

                    stocks[i].stockPrice = editedStock.stockPrice;
                    await axios.put(`${STOCK_URL}/${stocks[i].stockName}`, stocks[i]).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err);
                    });

                    const userPortfolios = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserProfitByStockName/${stocks[i].stockName}`);
                    for (let i = 0; i < userPortfolios.data.length; i++) {
                        let modifiedUserPortfolio: UserPortfolio = userPortfolios.data[i];
                        modifiedUserPortfolio.stockPrice = editedStock.stockPrice;
                        await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${userPortfolios.data[i].email}/${userPortfolios.data[i].stockName}`, modifiedUserPortfolio);
                    }

                } else {
                    let newStockHistory: StockHistory = {
                        stockId: 0,
                        stockName: stocks[i].stockName,
                        stockDate: dateToday,
                        stockPrice: stocks[i].stockPrice
                    }
                    await axios.post(`${STOCK_HISTORY_URL}`, newStockHistory).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err);
                    });

                    stocks[i].stockPrice = newStockHistory.stockPrice;
                    await axios.put(`${STOCK_URL}/${stockToday.data.stockName}`, stocks[i]).then(response => {
                        console.log(response);
                    }).catch(err => {
                        console.log(err);
                    });

                    const userPortfolios = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserProfitByStockName/${stocks[i].stockName}`);
                    for (let i = 0; i < userPortfolios.data.length; i++) {
                        let modifiedUserPortfolio: UserPortfolio = userPortfolios.data[i];
                        modifiedUserPortfolio.stockPrice = stocks[i].stockPrice
                        await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${userPortfolios.data[i].email}/${userPortfolios.data[i].stockName}`, modifiedUserPortfolio);
                    }
                }
            }
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'OK!',
                showConfirmButton: true,
            });
        }

    }

    const handleOnClickOpenUpdateRangeModal = () => {
        setIsRangeOpen(true);
    }

    const handleOnSubmitUpdateRangeForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        let currentDate = moment(fromDate);
        let toDateMoment = moment(toDate);

        if (currentDate.isBefore(toDateMoment)) {
            let i = 0;
            while (currentDate.isBefore(toDateMoment, 'day')) {
                currentDate = moment(fromDate).add(i, 'days');
                console.log(currentDate.format('YYYY-MM-DD'));

                const response = await axios.get(`${STOCK_URL}`);
                setStock(response.data);
                if (response.data.length) {
                    let stocks: Stock[] = response.data;
                    for (let i = 0; i < response.data.length; i++) {
                        stocks[i] = response.data[i];

                        const stockToday = await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockNameAndDate/${stocks[i].stockName}/${currentDate.format('YYYY-MM-DD')}`);
                        // IF EXISTS DO A PUT, IF NOT POST
                        if (stockToday.data) {
                            let editedStock: StockHistory = stockToday.data;
                            editedStock.stockDate = currentDate.format('YYYY-MM-DD');
                            editedStock.stockPrice = Math.floor(Math.random() * 2000) * (Math.floor(Math.random() * 9 + 1) < 8 ? 1 : -1);
                            await axios.put(`${STOCK_HISTORY_URL}/${stockToday.data.stockId}`, editedStock).then(response => {
                                console.log(response);
                            }).catch(err => {
                                console.log(err);
                            });

                            stocks[i].stockPrice = editedStock.stockPrice;
                            await axios.put(`${STOCK_URL}/${stocks[i].stockName}`, stocks[i]).then(response => {
                                console.log(response);
                            }).catch(err => {
                                console.log(err);
                            });

                            const userPortfolios = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserProfitByStockName/${stocks[i].stockName}`);
                            for (let i = 0; i < userPortfolios.data.length; i++) {
                                let modifiedUserPortfolio: UserPortfolio = userPortfolios.data[i];
                                modifiedUserPortfolio.stockPrice = editedStock.stockPrice;
                                await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${userPortfolios.data[i].email}/${userPortfolios.data[i].stockName}`, modifiedUserPortfolio);
                            }
                        } else {
                            let newStockHistory: StockHistory = {
                                stockId: 0,
                                stockName: stocks[i].stockName,
                                stockDate: currentDate.format('YYYY-MM-DD'),
                                stockPrice: Math.floor(Math.random() * 2000)
                            }
                            await axios.post(`${STOCK_HISTORY_URL}`, newStockHistory).then(response => {
                                console.log(response);
                            }).catch(err => {
                                console.log(err);
                            });

                            stocks[i].stockPrice = newStockHistory.stockPrice;
                            await axios.put(`${STOCK_URL}/${stockToday.data.stockName}`, stocks[i]).then(response => {
                                console.log(response);
                            }).catch(err => {
                                console.log(err);
                            });

                            const userPortfolios = await axios.get(`${USER_PORTFOLIOS_URL}/GetUserProfitByStockName/${stocks[i].stockName}`);
                            for (let i = 0; i < userPortfolios.data.length; i++) {
                                let modifiedUserPortfolio: UserPortfolio = userPortfolios.data[i];
                                modifiedUserPortfolio.stockPrice = stocks[i].stockPrice
                                await axios.put(`${USER_PORTFOLIOS_URL}/UpdateUserPortfolio/${userPortfolios.data[i].email}/${userPortfolios.data[i].stockName}`, modifiedUserPortfolio);
                            }
                        }
                    }
                }

                i++;
            }
        } else {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: '[To Date] must be less then [From Date]!',
                showConfirmButton: true,
            });
        }

        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'OK!',
            showConfirmButton: true,
        });
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Manage Stocks Historic <FontAwesomeIcon icon={faDatabase} /></h1>
                <hr />
            </div>

            <form onSubmit={handleOnSubmitSearchForm} className="flex flex-row w-[80%] mx-auto p-5 border border-gray-300 rounded-md mt-10">
                <div className="w-[20%] text-right mr-4">
                    <label>Stock Name </label>
                </div>

                <div className="w-[60%]">
                    <input onChange={(e) => setSearch(e.target.value)} className="form-control" type={'text'} />
                </div>

                <div className="w-[20%]">
                    <button className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                </div>
            </form>

            <div className="flex flex-row w-full gap-5 ml-auto mt-2 justify-evenly">
                <button type="button" onClick={handleOnClickUpdateToday} className="btn-primary"><FontAwesomeIcon icon={faArrowRotateRight} /> Update Today</button>
                <button type="button" onClick={handleOnClickOpenUpdateRangeModal} className="btn-primary"><FontAwesomeIcon icon={faArrowRotateRight} /> Update Range</button>
                <button type="button" onClick={handleOnClickAddNewStockHistory} className="btn-primary"><FontAwesomeIcon icon={faPlus} /> Add</button>
            </div>

            <div className="mt-10">
                <table className="border border-gray-300 w-5/6 mx-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 text-white">
                            <th className="p-5">
                                Stock Name
                            </th>

                            <th className="p-5">
                                Date
                            </th>

                            <th className="p-5">
                                Current Price
                            </th>

                            <th className="p-5">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            stockHistory?.map((element: StockHistory, index: number) => (
                                <tr key={index} className="">
                                    <td className="p-5">
                                        <span className="font-bold">{element.stockName}</span>
                                    </td>

                                    <td className="p-5">
                                        {moment(element.stockDate).format('MM/DD/YYYY')}
                                    </td>

                                    <td className="p-5">
                                        {element.stockPrice}
                                    </td>

                                    <td className="p-5">
                                        <button onClick={() => handleOpenEditModal(element)} className="btn-warning w-10" type="button"><FontAwesomeIcon icon={faPencil} /></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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
                                Add New Stock History <FontAwesomeIcon icon={faPlus} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <form onSubmit={handleOnSubmitNewStockHistory} className="w-[50%] mx-auto">
                                <div className="mb-3">
                                    <label>Stock Name</label>
                                    <input onChange={handleOnChangeStockName} className="form-control" type={'text'} maxLength={60} />
                                </div>

                                <div className="mb-3">
                                    <label>Stock Date</label>
                                    <input onChange={handleOnChangeStockDate} className="form-control text-center" type={'date'} maxLength={60} />
                                </div>

                                <div className="mb-3">
                                    <label>Stock Price</label>
                                    <input onChange={handleOnChangeStockPrice} className="form-control" type={'number'} />
                                </div>

                                <div className="mt-3">
                                    <button type="submit" className="btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                        <div
                            className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button type="button"
                                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                onClick={() => setIsOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={isEditOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Edit New Stock History <FontAwesomeIcon icon={faPlus} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsEditOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <form onSubmit={handleOnSubmitEditStockHistory} className="w-[50%] mx-auto">
                                <div className="mb-3">
                                    <label>Stock Name</label>
                                    <input value={selectedStockHistory.stockName} disabled className="form-control text-center" type={'text'} maxLength={60} />
                                </div>

                                <div className="mb-3">
                                    <label>Stock Date</label>
                                    <input onChange={handleOnChangeSelectedStockDate} value={selectedStockHistory.stockDate.toString().split('T')[0]} className="form-control text-center" type={'date'} maxLength={60} />
                                </div>

                                <div className="mb-3">
                                    <label>Stock Price</label>
                                    <input onChange={handleOnChangeSelectedStockPrice} value={selectedStockHistory.stockPrice} className="form-control text-center" type={'number'} />
                                </div>

                                <div className="mt-3">
                                    <button type="submit" className="btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                        <div
                            className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button type="button"
                                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                onClick={() => setIsEditOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={isRangeOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Update Range <FontAwesomeIcon icon={faArrowRotateRight} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsRangeOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4">
                            <form onSubmit={handleOnSubmitUpdateRangeForm} className="w-[50%] mx-auto">
                                <div className="mb-3">
                                    <label>From This Date</label>
                                    <input onChange={(e) => setFromDate(e.target.value)} className="form-control text-center" type={'date'} maxLength={60} />
                                </div>

                                <div className="mb-3">
                                    <label>To This Date</label>
                                    <input onChange={(e) => setToDate(e.target.value)} className="form-control text-center" type={'date'} maxLength={60} />
                                </div>

                                <div className="mt-3">
                                    <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faArrowRotateRight} /> Update Range</button>
                                </div>
                            </form>
                        </div>
                        <div
                            className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                            <button type="button"
                                className="inline-block px-6 py-2.5 bg-purple-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                                onClick={() => setIsRangeOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>


        </div>
    )
}

export default ManageStockHistory;