import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";
import UserProfitCard from "../Cards/UserProfitCard";

interface UserProfit {
    email: string,
    money: number
}

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

const USER_PROFIT_URL = `${process.env.REACT_APP_API_URL}/UserProfits`;
const USER_PROFILE_URL = `${process.env.REACT_APP_API_URL}/UserProfiles`;
const USER_URL = `${process.env.REACT_APP_API_URL}/User`;

function ManageWallet() {
    const [userProfit, setUserProfit] = useState<UserProfit>();
    const [money, setMoney] = useState<number>(0);
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


    const getUserProfitByEmail = async (email: string) => {
        await axios.get(`${USER_PROFIT_URL}/${email}`).then(response => {
            setUserProfit(response.data);
        }).catch(err => {
            console.log(err);
        });
    }

    const handleOnSubmitMoneyForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        Swal.fire({
            title: `Are you sure you want to add ${money} Dollar(s)?`,
            text: "The money will be added to your account.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (userProfit) {
                    let newUserProfit: UserProfit = userProfit;
                    newUserProfit.money += money;

                    await axios.put(`${USER_PROFIT_URL}/${userProfit?.email}`, newUserProfit).then(response => {

                    }).catch(err => {
                        console.log(err);
                    });

                    await getUserProfitByEmail(userProfit.email);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Transaction done succesfully!',
                        showConfirmButton: true,
                    }).then(() => {
                        setMoney(0);
                    });
                }
            }
        });
    }

    useEffect(() => {
        let currentUser: string = authService.getCurrentUser!;
        getUserProfitByEmail(currentUser);
        getUserProfileByEmail(currentUser);
    }, []);

    return (
        <div>
            <div className="container mx-auto">
                <h1 className="header mt-10">Manage Wallet <FontAwesomeIcon icon={faWallet} /></h1>
                <hr />
            </div>

            <div className="">
                <UserProfitCard userProfit={userProfit} userProfile={userProfile} />
            </div>

            <div className="card mt-20 p-5">
                <form onSubmit={handleOnSubmitMoneyForm}>
                    <div className="flex flex-row justify-center">
                        <label className="mr-4">Add Money</label>
                        <div>
                            <input value={money} onChange={(e) => setMoney(Number(e.target.value))} type={'number'} className='form-control text-center' />
                        </div>
                    </div>
                    <div className="flex flex-row justify-center mt-10">
                        <button disabled={money < 1} type="submit" className="btn-primary">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ManageWallet;