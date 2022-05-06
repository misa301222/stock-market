import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

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

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;

function TradeCard({ tradeElement }: any) {
    const [userSource, setUserSource] = useState<UserProfile>();
    const [userDestiny, setUserDestiny] = useState<UserProfile>();

    const getUserProfilesSourceAndDestiny = async () => {
        console.log(tradeElement.sourceEmail);
        const responseUser = await axios.get(`${USER_URL}/GetCurrentUser/${tradeElement.sourceEmail}`);
        await axios.get(`${USER_PROFILE_URL}/${tradeElement.sourceEmail}`).then(response => {
            response.data.fullName = responseUser.data.dataSet.fullName;
            setUserSource(response.data);
        }).catch(err => {
            console.log(err);
        });

        const responseUserDestiny = await axios.get(`${USER_URL}/GetCurrentUser/${tradeElement.destinyEmail}`);
        await axios.get(`${USER_PROFILE_URL}/${tradeElement.destinyEmail}`).then(response => {
            response.data.fullName = responseUserDestiny.data.dataSet.fullName;
            setUserDestiny(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        getUserProfilesSourceAndDestiny();
    }, []);

    return (
        <div>
            <h2 className="mb-2 font-bold italic bg-blue-400 rounded-md">{tradeElement?.status!} {tradeElement.status ? ` on ${moment(tradeElement.transactionDate).format('MM/DD/YYYY HH:mm')}` : ''}</h2>
            <div className="card flex flex-row justify-content-evenly p-5 items-center">
                <div>
                    <div style={{
                        backgroundImage: `url(${userSource?.profilePictureURL})`,
                        backgroundSize: 'cover',
                        height: '10rem',
                        width: '10rem',
                        borderRadius: '12px',
                        boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)',
                        margin: '0 auto'
                    }}></div>

                    <h3 className="mt-2 font-bold">{userSource?.fullName}</h3>

                </div>

                <div className="">
                    <FontAwesomeIcon icon={faArrowRight} className='text-[8rem]' />
                    <h3 className="mt-2 font-bold underline">Trading</h3>
                </div>
                <div>
                    <div style={{
                        backgroundImage: `url(${userDestiny?.profilePictureURL})`,
                        backgroundSize: 'cover',
                        height: '10rem',
                        width: '10rem',
                        borderRadius: '12px',
                        boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)',
                        margin: '0 auto'
                    }}></div>

                    <h3 className="mt-2 font-bold">{userDestiny?.fullName}</h3>

                </div>
            </div>
        </div>
    )
}

export default TradeCard;