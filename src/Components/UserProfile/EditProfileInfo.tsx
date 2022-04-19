import { faFloppyDisk, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

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

function EditProfileInfo() {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        email: '',
        profilePictureURL: '',
        coverPictureURL: '',
        aboutMeHeader: '',
        aboutMeDescription: '',
        phoneNumber: '',
        ocupation: '',
        eduaction: [''],
        imagesURL: ['']
    });
    const [user, setUser] = useState<User>({
        fullName: '',
        email: '',
        dateCreated: new Date(),
        roles: ''
    });

    const handleOnChangeProfilePictureURL = (event: ChangeEvent<HTMLInputElement>) => {
        setUserProfile(prev => ({ ...prev, profilePictureURL: event.target.value }))
    }

    const handleOnChangeCoverPictureURL = (event: ChangeEvent<HTMLInputElement>) => {
        setUserProfile(prev => ({ ...prev, coverPictureURL: event.target.value }))
    }

    const handleOnChangeAboutMeHeader = (event: ChangeEvent<HTMLInputElement>) => {
        setUserProfile(prev => ({ ...prev, aboutMeHeader: event.target.value }))
    }

    const handleOnChangeAboutMeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setUserProfile(prev => ({ ...prev, aboutMeDescription: event.target.value }))
    }

    const handleOnChangePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
        setUserProfile(prev => ({ ...prev, phoneNumber: event.target.value }))
    }

    const handleOnChangeOcupation = (event: ChangeEvent<HTMLInputElement>) => {
        setUserProfile(prev => ({ ...prev, ocupation: event.target.value }))
    }

    const handleOnChangeFullName = (event: ChangeEvent<HTMLInputElement>) => {
        setUser(prev => ({ ...prev, fullName: event.target.value }))
    }

    const getUserProfileByEmail = async (currentUser: string) => {
        await axios.get(`${USER_PROFILE_URL}/${currentUser}`).then(response => {
            setUserProfile(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const getUserByEmail = async (currentUser: string) => {
        await axios.get(`${USER_URL}/GetCurrentUser/${currentUser}`).then(response => {
            setUser(response.data.dataSet);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnSubmitEditUserProfileForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        Swal.fire({
            title: `Are you sure you want to Save All The Changes?`,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.put(`${USER_PROFILE_URL}/${userProfile.email}`, userProfile);
                let editedUser = {
                    email: user.email,
                    fullName: user.fullName
                }
                await axios.post(`${USER_URL}/EditFullName`, editedUser);

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Data Edited Succesfully!',
                    showConfirmButton: true,
                });
            }
            
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getUserProfileByEmail(currentUser);
        getUserByEmail(currentUser);
    }, []);

    return (
        <div>

            <div className="container mx-auto">
                <h1 className="header mt-10">Edit User Profile <FontAwesomeIcon icon={faUserEdit} /></h1>
                <hr />
            </div>

            <div className="card mt-10">
                <form onSubmit={handleOnSubmitEditUserProfileForm} className="p-5">
                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Email</label>
                        </div>

                        <div className="w-3/4">
                            <input disabled value={userProfile?.email} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Full Name</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangeFullName} value={user?.fullName} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Profile Picture URL</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangeProfilePictureURL} value={userProfile?.profilePictureURL} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Cover Picture URL</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangeCoverPictureURL} value={userProfile?.coverPictureURL} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Ocupation</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangeOcupation} value={userProfile?.ocupation} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>About Me Header</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangeAboutMeHeader} value={userProfile?.aboutMeHeader} type={'text'} className='form-control' />
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>About Me Description</label>
                        </div>

                        <div className="w-3/4">
                            <textarea onChange={handleOnChangeAboutMeDescription} value={userProfile?.aboutMeDescription} rows={5} className='form-control resize-none' />
                        </div>
                    </div>

                    <div className="flex flex-row justify-center">
                        <button type="submit" className="btn-primary"><FontAwesomeIcon icon={faFloppyDisk} /> Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProfileInfo;