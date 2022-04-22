import { faFloppyDisk, faImage, faPlus, faSuitcase, faTrash, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
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
        education: [''],
        imagesURL: ['']
    });
    const [user, setUser] = useState<User>({
        fullName: '',
        email: '',
        dateCreated: new Date(),
        roles: ''
    });
    const [isEducationOpen, setIsEducationOpen] = useState<boolean>(false);
    const [isImagesURLOpen, setIsImagesURLOpen] = useState<boolean>(false);
    const [educations, setEducations] = useState<string[]>(['']);
    const [imagesURL, setImagesURL] = useState<string[]>(['']);

    const variants = {
        open: { opacity: 1, display: 'block' },
        closed: { opacity: 0, display: 'none' }
    }

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
            console.log(response.data);
            setUserProfile(response.data);
            setEducations(response.data.education);
            setImagesURL(response.data.imagesURL);
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

    const handleOnClickAddImagesURL = () => {
        Swal.fire({
            title: "Add Image URL",
            text: "Insert your URL",
            input: 'text',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add!'
        }).then(async (result) => {
            if (result.value) {
                let everythingRight: boolean = true;
                for (let i = 0; i < imagesURL.length; i++) {
                    if (imagesURL[i] === result.value) {
                        everythingRight = false;
                    }
                }
                if (everythingRight) {
                    setImagesURL(prev => [...prev, result.value]);
                }
            }
        });
    }

    const handleOnDeleteImagesURL = (element: string) => {
        let imagesURLArray: string[] = [];
        for (let i = 0; i < imagesURL.length; i++) {
            if (imagesURL[i] !== element) {
                imagesURLArray.push(imagesURL[i]);
            }
        }
        setImagesURL(imagesURLArray);
    }

    const handleOnClickSaveChangesImagesURL = () => {
        setUserProfile(prev => ({ ...prev, imagesURL: imagesURL }))
        setIsImagesURLOpen(false);
    }

    const handleOnClickSaveChangesEducation = () => {
        setUserProfile(prev => ({ ...prev, education: educations }))
        setIsEducationOpen(false);
    }

    const handleOnDeleteEducation = (element: string) => {
        let educationsArray: string[] = [];
        for (let i = 0; i < educations.length; i++) {
            if (educations[i] !== element) {
                educationsArray.push(educations[i]);
            }
        }
        setEducations(educationsArray);
    }

    const handleOnClickAddEducation = () => {
        Swal.fire({
            title: "Add Education",
            text: "Insert your education",
            input: 'text',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Add!'
        }).then(async (result) => {
            if (result.value) {
                let everythingRight: boolean = true;
                for (let i = 0; i < educations.length; i++) {
                    if (educations[i] === result.value) {
                        everythingRight = false;
                    }
                }
                if (everythingRight) {
                    setEducations(prev => [...prev, result.value]);
                }
            }
        });
    }

    const handleOnSubmitEditUserProfileForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        console.log(userProfile);
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
                            <label>Phone Number</label>
                        </div>

                        <div className="w-3/4">
                            <input onChange={handleOnChangePhoneNumber} value={userProfile?.phoneNumber} type={'text'} maxLength={10} className='form-control' />
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
                            <label>Education</label>
                        </div>

                        <div className="w-3/4 text-left">
                            <button type="button" onClick={() => setIsEducationOpen(true)} className="btn-dark"><FontAwesomeIcon icon={faPlus} /> Manage</button>
                        </div>
                    </div>

                    <div className="flex flex-row mb-10">
                        <div className="w-1/4">
                            <label>Images URL</label>
                        </div>

                        <div className="w-3/4 text-left">
                            <button type="button" onClick={() => setIsImagesURLOpen(true)} className="btn-dark"><FontAwesomeIcon icon={faPlus} /> Manage</button>
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

            <motion.div
                animate={isEducationOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Ocupation <FontAwesomeIcon icon={faSuitcase} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsEducationOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4 overflow-y-auto max-h-96">
                            <div className="flex flex-row justify-end">
                                <button onClick={() => handleOnClickAddEducation()} className="btn-dark">Add</button>
                            </div>
                            <div className="p-5">
                                {
                                    educations?.map((element: string, index: number) => (
                                        <div key={index} className="flex flex-row w-3/4 mx-auto">
                                            <label className="mr-4">Education #{index + 1}</label>
                                            <input disabled className="form-control text-center" value={element} />
                                            <button type="button" onClick={() => handleOnDeleteEducation(element)} className="btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="">
                                <button onClick={() => handleOnClickSaveChangesEducation()} className="btn-primary">Save Changes</button>
                            </div>
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">

                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsEducationOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={isImagesURLOpen ? "open" : "closed"}
                variants={variants}
                transition={{
                    type: 'spring'
                }}
                className="modal fade fixed top-0 left-0 w-full bg-black/50 h-full outline-none overflow-x-hidden overflow-y-auto" id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollable" aria-modal="true" role="dialog">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable relative w-auto pointer-events-none">
                    <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                        <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                            <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalCenteredScrollableLabel">
                                Images URL <FontAwesomeIcon icon={faImage} />
                            </h5>
                            <button type="button"
                                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                                onClick={() => setIsImagesURLOpen(false)}></button>
                        </div>
                        <div className="modal-body relative p-4 overflow-y-auto max-h-96">
                            <div className="flex flex-row justify-end">
                                <button onClick={() => handleOnClickAddImagesURL()} className="btn-dark">Add</button>
                            </div>
                            <div className="p-5">
                                {
                                    imagesURL?.map((element: string, index: number) => (
                                        <div key={index} className="flex flex-row w-3/4 mx-auto">
                                            <label className="mr-4">Image #{index + 1}</label>
                                            <input disabled className="form-control text-center" value={element} />
                                            <button type="button" onClick={() => handleOnDeleteImagesURL(element)} className="btn-danger"><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                    ))
                                }
                            </div>

                            <div className="">
                                <button onClick={() => handleOnClickSaveChangesImagesURL()} className="btn-primary">Save Changes</button>
                            </div>
                        </div>
                        <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md gap-3">

                            <button type="button"
                                className="btn-secondary"
                                onClick={() => setIsImagesURLOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>


        </div>
    )
}

export default EditProfileInfo;