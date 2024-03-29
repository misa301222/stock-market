import { faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

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

interface User {
    fullName: string,
    email: string,
    dateCreated: Date,
    roles: string
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;

function SearchUsers() {
    const [search, setSearch] = useState<string>();
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>();
    const [notFound, setNotFound] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleOnSubmitSearchUserForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        if (search) {
            const responseFullNames = await axios.get(`${USER_URL}/GetUserByFullNameLike/${search}`);

            if (responseFullNames.data.dataSet.length) {
                let userProfilesResult: UserProfile[] = [];
                for (let i = 0; i < responseFullNames.data.dataSet.length; i++) {
                    const responseUserProfile = await axios.get(`${USER_PROFILE_URL}/${responseFullNames.data.dataSet[i].email}`);
                    responseUserProfile.data.fullName = responseFullNames.data.dataSet[i].fullName;
                    userProfilesResult.push(responseUserProfile.data);
                }
                setUserProfiles(userProfilesResult);
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        }
    }

    const handleOnClickViewProfile = (email: string) => {
        navigate(`/userProfile/${email}`);
    }

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Search Users <FontAwesomeIcon icon={faUsers} /></h1>
                <hr />
            </div>

            <form onSubmit={handleOnSubmitSearchUserForm} className="card mt-10">
                <div className="flex flex-row p-10 justify-center">
                    <div className="pr-5">
                        <label>Full Name</label>
                    </div>

                    <div className="w-full">
                        <input onChange={(e) => setSearch(e.target.value)} className="form-control" placeholder="Type the name of the user you want to search.." />
                    </div>

                    <div className="pl-5">
                        <button disabled={!search} className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    </div>

                </div>
            </form>

            <div className="flex flex-wrap gap-10 container mx-auto mt-20">
                {
                    !notFound ?
                        userProfiles?.map((element: UserProfile, index: number) => (
                            <motion.div className="card w-96 cursor-pointer h-96" key={index}
                                initial={{
                                    opacity: 0
                                }}
                                animate={{
                                    opacity: 1
                                }}
                                whileHover={{
                                    scale: 1.1
                                }}

                                onClick={() => handleOnClickViewProfile(element.email)}>
                                <div className="">
                                    <div
                                        style={{
                                            backgroundImage: `${element.coverPictureURL ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${element.coverPictureURL})` : ``}`,
                                            height: '13rem',
                                        }}>

                                    </div>

                                    <div className="-mt-44">
                                        <div style={{
                                            backgroundImage: `${element.profilePictureURL ? `url(${element.profilePictureURL})` : `url(/images/NotFound.png)`}`,
                                            width: '10rem',
                                            height: '10rem',
                                            backgroundSize: 'cover',
                                            margin: '0 auto',
                                            marginTop: '1rem',
                                            borderRadius: '0.5rem',
                                            boxShadow: '0 .5rem 0.5rem rgba(0, 0, 0, 0.5)'
                                        }}>
                                        </div>

                                        <h3 className="font-bold text-black truncate mt-4">{element.fullName}</h3>

                                        <div className="mt-4 p-1 truncate">
                                            <label className="underline">{element.aboutMeHeader}</label>
                                        </div>

                                        <div className="mt-2 line-clamp-2 pr-2 pl-2">
                                            <label className="text-black/80">{element.aboutMeDescription}</label>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                        :
                        <motion.h1
                            initial={{
                                opacity: 0
                            }}

                            animate={{
                                opacity: 1
                            }}
                            className="font-bold mx-auto">No results found! Try searching again.</motion.h1>
                }
            </div>
        </div>
    )
}

export default SearchUsers;