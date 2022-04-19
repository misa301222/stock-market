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
    const navigate = useNavigate();

    const handleOnSubmitSearchUserForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        const responseFullNames = await axios.get(`${USER_URL}/GetUserByFullNameLike/${search}`);

        if (responseFullNames.data.dataSet) {
            let userProfilesResult: UserProfile[] = [];
            for (let i = 0; i < responseFullNames.data.dataSet.length; i++) {
                const responseUserProfile = await axios.get(`${USER_PROFILE_URL}/${responseFullNames.data.dataSet[i].email}`);
                responseUserProfile.data.fullName = responseFullNames.data.dataSet[i].fullName;
                userProfilesResult.push(responseUserProfile.data);
            }

            setUserProfiles(userProfilesResult);
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
                        <button className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    </div>

                </div>
            </form>

            <div className="flex flex-wrap gap-10 container mx-auto mt-20">
                {
                    userProfiles?.map((element: UserProfile, index: number) => (
                        <motion.div className="card w-96 cursor-pointer h-96" key={index}
                            whileHover={{
                                scale: 1.1
                            }}
                            transition={{
                                type: "spring"
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
                                    <h3 className="font-bold text-red-300 truncate">{element.fullName}</h3>

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

                                    <div className="mt-4">
                                        <label className="truncate">{element.aboutMeHeader}</label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        </div>
    )
}

export default SearchUsers;