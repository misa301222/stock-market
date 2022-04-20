import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function UserProfitCard({ userProfit, userProfile }: any) {
    const navigate = useNavigate();

    const handleOnClickUserProfitCard = () => {
        navigate(`/userProfile/${userProfile?.email}`);
    }

    return (
        <motion.div className="card mt-10 p-5 cursor-pointer"
            style={{
                backgroundImage: `${userProfile?.coverPictureURL ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${userProfile?.coverPictureURL})` : ``}`,
            }}
            whileHover={{
                scale: 1.05
            }}
            transition={{
                type: 'spring'
            }}
            onClick={() => handleOnClickUserProfitCard()}>
            <div className="flex flex-row">
                <div className="w-1/3"
                    style={{
                        backgroundImage: `${userProfile?.profilePictureURL ? `url(${userProfile?.profilePictureURL})` : `url(/images/NotFound.png)`}`,
                        height: '10rem',
                        width: '10rem',
                        backgroundSize: 'cover',
                        borderRadius: '0.5rem',
                        boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)'
                    }}>
                </div>

                <div className="w-2/3 bg-white mx-auto rounded-md backdrop-blur-md bg-opacity-60">
                    <div className="p-5">
                        <div className="mb-3">
                            <h3 className="font-bold">{userProfile?.fullName}</h3>
                            <label className="underline">{userProfit?.email}</label>
                        </div>

                        <div className="">
                            <h3 className="font-bold">${userProfit?.money}</h3>
                            <small>Total Money</small>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default UserProfitCard;