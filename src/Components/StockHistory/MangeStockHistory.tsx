import { faDatabase, faPencil, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { motion } from "framer-motion";
import { ChangeEvent, SyntheticEvent, useState } from "react";

interface StockHistory {
    stockId: number,
    stockName: string,
    stockDate: Date,
    stockPrice: number
}

const STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/StockHistories`;

function ManageStockHistory() {
    const [stockHistory, setStockHistory] = useState<StockHistory[]>();
    const [search, setSearch] = useState<string>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newStockHistory, setNewStockHistory] = useState<StockHistory>({
        stockId: 0,
        stockName: '',
        stockDate: new Date(),
        stockPrice: 0
    });

    const getStockHistoryByStockName = async () => {
        await axios.get(`${STOCK_HISTORY_URL}/GetStockHistoryByStockName/${search}`).then(response => {
            console.log(response);
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
        addStock.stockDate = new Date(addStock.stockDate);
        await axios.post(`${STOCK_HISTORY_URL}/`, addStock).then(response => {

        }).catch(err => {
            console.log(err);
        });

        await getStockHistoryByStockName();
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

            <div className="flex flex-row w-1/5 gap-5 ml-auto mt-2">
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
                                        <button className="btn-warning w-10" type="button"><FontAwesomeIcon icon={faPencil} /></button>
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


        </div>
    )
}

export default ManageStockHistory;