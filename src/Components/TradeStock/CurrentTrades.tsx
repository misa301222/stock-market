interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    eduaction: string[],
    imagesURL: string[],
    fullName?: string
}

interface TradeStockHistory {
    sourceEmail: string,
    destinyEmail: string,
    stockName: string,
    stockQuantity: number,
    stockPrice: number,
    transactionDate: Date,
    status: string
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;
const USER_PORTFOLIOS_URL = `${process.env.REACT_APP_API_URL}/UserPortfolios`;
const TRADE_STOCK_HISTORY_URL = `${process.env.REACT_APP_API_URL}/TradeStockHistories`;

function CurrentTrades() {



    return (
        <div>

        </div>
    )
}

export default CurrentTrades;