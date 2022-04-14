import moment from "moment";

interface Stock {
    stockName: string,
    stockDescription: string,
    stockPrice: number,
    stockQuantity: number,
    stockLogoURL: string,
    dateAdded: Date,
    stockOwner: string
}

function StockCardGold({ stock }: any) {
    return (
        <div className="stock-card-gold cursor-pointer">
            <div className="mt-1 text-right pr-2">
                <label className="text-xs">Added on: {moment(stock.dateAdded).format('MM/DD/YYYY')}</label>
            </div>

            <div className="mt-1 truncate">
                <label>{stock.stockName}</label>
            </div>

            <div className="h-[10rem] p-2 mt-2">
                <img className="h-[9rem] w-[9rem] mx-auto" src={`${stock.stockLogoURL ? stock.stockLogoURL : '/images/NotFound.png'}`} />
            </div>

            <div className="">
                <div className="flex flex-row">
                    <div className="w-1/2 text-right">
                        <label>Price: </label>
                    </div>

                    <div className="w-1/2 text-left">
                        <label>${stock.stockPrice}</label>
                    </div>
                </div>

                <div className="flex flex-row">
                    <div className="w-1/2 text-right">
                        <label>Stocks Left: </label>
                    </div>

                    <div className="w-1/2 text-left">
                        <label>{stock.stockQuantity}</label>
                    </div>
                </div>

                <div className="flex flex-row">
                    <div className="p-3 text-center">
                        <p className="line-clamp-4">{stock.stockDescription}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StockCardGold;