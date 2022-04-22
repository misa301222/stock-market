import { faBriefcase, faGraduationCap, faHeart, faImage, faLocation, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    education: string[],
    imagesURL: string[],
    fullName?: string
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;

function UserProfile() {
    const params = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile>();

    const getUserProfileByEmail = async (email: string) => {
        const responseUser = await axios.get(`${USER_URL}/GetCurrentUser/${email}`);

        await axios.get(`${USER_PROFILE_URL}/${email}`).then(response => {
            response.data.fullName = responseUser.data.dataSet.fullName;
            setUserProfile(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    useEffect(() => {
        const email: string = params.email!;
        getUserProfileByEmail(email);
    }, []);

    return (
        <div>
            <div className=""
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${userProfile?.coverPictureURL})`,
                    height: '35rem',
                    backgroundSize: 'cover'
                }}>
            </div>

            <div className="-mt-60 mx-auto"
                style={{
                    backgroundImage: `${userProfile?.profilePictureURL ? `url(${userProfile?.profilePictureURL})` : `url(/images/NotFound.png)`}`,
                    width: '20rem',
                    height: '20rem',
                    backgroundSize: 'cover',
                    borderRadius: '0.5rem',
                    boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)'
                }}>
            </div>

            <motion.div className="card w-48 truncate p-2 opacity-80 -mt-4 shadow-md"
                whileHover={{
                    scale: 1.2
                }}
                transition={{
                    type: 'spring'
                }}>
                <label className="">
                    <FontAwesomeIcon className="text-red-800" icon={faLocation} /> United States Of America
                </label>
            </motion.div>

            <div className="container mx-auto mt-10 card p-5">
                <h2 className="font-bold mb-5 truncate">{userProfile?.fullName}</h2>

                {
                    userProfile?.ocupation ?
                        <div className="flex flex-row">
                            <div className="w-2/4 text-right">
                                <label className="truncate">Current Ocupation <FontAwesomeIcon className="text-amber-900" icon={faBriefcase} />: </label>
                            </div>

                            <div className="w-3/4 text-left">
                                <p className="underline">{userProfile.ocupation}</p>
                            </div>
                        </div>
                        : null
                }

                {
                    userProfile?.phoneNumber ?
                        <div className="flex flex-row">
                            <div className="w-2/4 text-right">
                                <label className="truncate">Phone Number <FontAwesomeIcon className="text-red-900" icon={faPhone} />: </label>
                            </div>

                            <div className="w-3/4 text-left">
                                <p className="underline">{userProfile?.phoneNumber}</p>
                            </div>
                        </div>
                        : null
                }
            </div>

            <div className="container mx-auto mt-20">
                <h1 className="truncate font-bold">{userProfile?.aboutMeHeader}</h1>
                <hr />
                <div className="mt-10">
                    <p className="line-clamp-5 text-justify">{userProfile?.aboutMeDescription}</p>
                </div>
            </div>

            <div className="container mx-auto mt-20">
                {
                    userProfile?.education ?
                        <div className="">
                            <h2 className="font-bold card w-60 p-5"><FontAwesomeIcon icon={faGraduationCap} /> Education</h2>
                            <ul className="mt-10 font-bold card p-5">
                                {
                                    userProfile.education?.map((element: string, index: number) => (
                                        <li className="w-1/2 mx-auto text-left text-truncate" key={index}>
                                            {
                                                element
                                            }
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        : null
                }
            </div>

            <div className="container mx-auto mt-20">
                <div>
                    <h2 className="font-bold card w-80 p-5"><FontAwesomeIcon icon={faImage} /> Images I <FontAwesomeIcon className="text-red-500" icon={faHeart} /></h2>

                    <div className="w-[75rem] h-[50rem] border border-gray-500 shadow-sm shadow-black rounded-md mx-auto mt-20">
                        {
                            userProfile?.imagesURL.map((element: string, index: number) => (
                                <motion.img drag
                                    dragConstraints={{
                                        top: -50,
                                        left: -50,
                                        right: 1000,
                                        bottom: 550,
                                    }}
                                    key={index} src={element} className='h-[10rem] mx-auto cursor-pointer absolute rounded-md shadow-md shadow-black' />
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserProfile;