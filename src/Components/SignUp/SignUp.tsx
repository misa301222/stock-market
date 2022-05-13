import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

interface User {
    fullName: string,
    email: string,
    password: string
}

interface UserProfit {
    email: string,
    money: number
}

interface UserProfile {
    email: string,
    profilePictureURL: string,
    coverPictureURL: string,
    location: string,
    aboutMeHeader: string,
    aboutMeDescription: string,
    phoneNumber: string,
    ocupation: string,
    education: string[],
    imagesURL: string[]
}

const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;

function SignUp() {
    const [fullName, setFullName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();

    const handleOnChangeFullName = (event: ChangeEvent<HTMLInputElement>) => {
        setFullName(event.target.value);
    }

    const handleOnChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleOnSubmitSignUpForm = async (event: SyntheticEvent) => {
        event.preventDefault();
        await authService.registerUser(fullName!, email!, password!).then(async (response) => {
            switch (response.data.responseCode) {
                case 1:
                    let newUserProfit: UserProfit = {
                        email: email!,
                        money: 0
                    }

                    let newUserProfile: UserProfile = {
                        email: email!,
                        profilePictureURL: '',
                        coverPictureURL: '',
                        location: '',
                        aboutMeHeader: '',
                        aboutMeDescription: '',
                        phoneNumber: '',
                        ocupation: '',
                        education: [''],
                        imagesURL: [''],
                    }

                    await axios.post(`${USER_PROFIT_URL}`, newUserProfit);
                    await axios.post(`${USER_PROFILE_URL}`, newUserProfile).catch(err => {
                        console.log(err);
                    });

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Account created Succesfully!',
                        showConfirmButton: true,
                    }).then(function () {
                        navigate('/login');
                    })
                    break;

                case 2:
                    Swal.fire({
                        icon: 'error',
                        title: 'Please check the data...',
                        text: response.data.dataSet
                    });
                    break;
            }

        });
    }

    return (
        <div className="container mx-auto">
            <h1 className="header mt-10">Sign Up<FontAwesomeIcon icon={faUserPlus} /></h1>
            <hr />
            <div className="card mt-20">
                <form onSubmit={handleOnSubmitSignUpForm} className="p-5">
                    <div className="flex flex-row mb-5 mt-5">
                        <div className="w-1/3 text-right mr-5">
                            <label>Full Name <span className="text-red-600 font-bold">*</span> </label>
                        </div>

                        <div className="w-1/2">
                            <input onChange={handleOnChangeFullName} className="form-control" type="text" placeholder="Insert your Full Name" maxLength={250} />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <div className="w-1/3 text-right mr-5">
                            <label>Email <span className="text-red-600 font-bold">*</span> </label>
                        </div>

                        <div className="w-1/2">
                            <input onChange={handleOnChangeEmail} className="form-control" type="text" placeholder="Insert your Email" maxLength={250} />
                        </div>
                    </div>

                    <div className="flex flex-row mt-5">
                        <div className="w-1/3 text-right mr-5">
                            <label>Password <span className="text-red-600 font-bold">*</span></label>
                        </div>

                        <div className="w-1/2">
                            <input onChange={handleOnChangePassword} className='form-control' type={'password'} placeholder='Insert your Password' maxLength={250} />
                        </div>
                    </div>

                    <div className="mt-20">
                        <button type="submit" disabled={!fullName || !email || !password} className="btn-primary">Signup</button>
                    </div>

                    <div className="mt-16 text-left">
                        <h5> <span className="text-red-600 font-bold">*</span> Required Data</h5>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignUp;