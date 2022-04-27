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

function StockCard({ stock }: any) {
    return (
        <div className="stock-card cursor-pointer">
            <div className="mt-1 text-right pr-2">
                <label className="text-xs">Added on: {stock.dateAdded ? moment(stock.dateAdded).format('MM/DD/YYYY') : moment(new Date()).format('MM/DD/YYYY')}</label>
            </div>

            <div className="mt-1 truncate">
                <label>{stock.stockName}</label>
            </div>

            <div className="h-[10rem] p-2 mt-2">
                <img className="h-[9rem] w-[9rem] mx-auto shadow-md shadow-black rounded-md" src={`${stock.stockLogoURL ? stock.stockLogoURL : '/images/NotFound.png'}`} />
            </div>

            <div className="mt-4">
                {stock.stockPriceYesterday ?
                    <div className="flex flex-row">

                        <div className="w-1/2 text-right">
                            <label>Yesterday's Price: </label>
                        </div>

                        <div className="w-1/2 text-left">
                            <label>${(stock.stockPriceYesterday!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>
                        </div>
                    </div>
                    : null
                }
                <div className="flex flex-row underline">
                    <div className="w-1/2 text-right">
                        <label>Current Price: </label>
                    </div>

                    <div className="w-1/2 text-left">
                        <label>${(stock.stockPrice!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>
                    </div>
                </div>

                {stock.stockPriceYesterday ?
                    <div className="flex flex-row">
                        <div className="w-1/2 text-right">
                            <label>Difference: </label>
                        </div>

                        <div className="w-1/2 text-left">
                            <label
                                style={{
                                    color: `${(stock.stockPrice! - stock.stockPriceYesterday!) > 0 ? 'green' : 'red'}`
                                }}>{(stock.stockPrice! - stock.stockPriceYesterday!) > 0 ? '+' : ''}{(stock.stockPrice! - stock.stockPriceYesterday!).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>
                        </div>
                    </div>
                    : null
                }

                <div className="flex flex-row">
                    <div className="w-1/2 text-right">
                        <label>Stocks Left: </label>
                    </div>

                    <div className="w-1/2 text-left">
                        <label> {stock.stockQuantity}</label>
                    </div>
                </div>

                <div className="flex flex-row">
                    <div className="p-3 text-center">
                        <p className="line-clamp-2">{stock.stockDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockCard;