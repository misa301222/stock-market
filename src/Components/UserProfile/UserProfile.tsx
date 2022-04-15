import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;

function UserProfile() {
    const params = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile>();

    const getUserProfileByEmail = async (email: string) => {
        await axios.get(`${USER_PROFILE_URL}/${email}`).then(response => {
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
            {
                JSON.stringify(userProfile)
            }
        </div>
    )
}

export default UserProfile;