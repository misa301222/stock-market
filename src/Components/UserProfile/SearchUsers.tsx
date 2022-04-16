import { faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useState } from "react";

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    eduaction: string[],
    imagesURL: string[]
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
    const [userProfiles, setUserProfiles] = useState<string>();

    const handleOnSubmitSearchUserForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        const responseFullNames = await axios.get(`${USER_URL}/GetUserByFullNameLike/${search}`);

        if (responseFullNames.data.dataSet) {
            let userProfilesResult: UserProfile[] = [];
            for (let i = 0; i < responseFullNames.data.dataSet.length; i++) {
                const responseUserProfile = await axios.get(`${USER_PROFILE_URL}/${responseFullNames.data.dataSet[i].email}`);
                userProfilesResult.push(responseUserProfile.data);
            }

            console.log(userProfilesResult);
        }
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
                        <label>User</label>
                    </div>

                    <div className="w-full">
                        <input onChange={(e) => setSearch(e.target.value)} className="form-control" />
                    </div>

                    <div className="pl-5">
                        <button className="btn-primary"><FontAwesomeIcon icon={faSearch} /> Search</button>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default SearchUsers;