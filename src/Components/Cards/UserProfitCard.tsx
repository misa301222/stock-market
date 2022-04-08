function UserProfitCard({ userProfit }: any) {
    return (
        <div className="card mt-10">
            <div className="flex flex-row">
                <div className="w-1/3">
                    1
                </div>

                <div className="w-2/3">
                    <div className="p-5">
                        <div className="mb-3">
                            <label className="underline">{userProfit?.email}</label>
                        </div>

                        <div className="">
                            <h3 className="font-bold">${userProfit?.money}</h3>
                            <small>Total Money</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfitCard;