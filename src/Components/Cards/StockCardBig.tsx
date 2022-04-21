function StockCardBig({ stock }: any) {
    return (
        <div className="flex flex-row w-[80%] mx-auto border-gray-300 border p-5 rounded-md shadow-md shadow-black/50">
            <div className="w-[30%]">
                <img className="w-80 h-80" src={`${stock?.stockLogoURL ? stock.stockLogoURL : '/images/NotFound.png'}`} />
            </div>

            <div className="w-[70%]">
                <div className="mb-2">
                    <h1 className="font-bold">{stock?.stockName}</h1>
                </div>
                <div className="mb-10">
                    <h5 className="line-clamp-4">{stock?.stockDescription}</h5>
                </div>
                <div className="mb-2">
                    <h2><b>Stocks Left:</b> {stock?.stockQuantity}</h2>
                </div>
                <div className="mb-2">
                    <h2><b>Current Price:</b> ${(stock?.stockPrice ? stock?.stockPrice.toLocaleString(undefined, { minimumFractionDigits: 2 }) : 0)}</h2>
                </div>

                <div className="mb-2">
                    <h2><b>Sold By:</b> {stock?.stockOwner}</h2>
                </div>
            </div>
        </div>
    )
}

export default StockCardBig;