import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../../Services/auth.service";

interface User {
    email: string,
    password: string
}

function Login() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const navigate = useNavigate();

    const handleOnChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleOnSubmitLoginForm = async (event: SyntheticEvent) => {
        event.preventDefault();

        await authService.login(email!, password!).then(
            (response => {
                switch (response.data.responseCode) {
                    case 1:
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: 'Logged In Succesfully! [' + response.data.dataSet.email + ']',
                            showConfirmButton: false,
                            timer: 1100
                        }).then(function () {
                            navigate('/dashboard');
                            navigate(0);
                        })
                        break;
                    case 2:
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.data.responseMessage
                        });
                        break;
                    case 3:
                        break;

                    default:
                        break;
                }

            }),
            error => {
                console.log(error);
            }
        );
    }

    return (
        <div className="container mx-auto">
            <h1 className="header mt-10">Login <FontAwesomeIcon icon={faRightToBracket} /></h1>
            <hr />
            <div className="card mt-20">
                <form onSubmit={handleOnSubmitLoginForm} className="p-5">
                    <div className="flex flex-row mb-10 mt-5">
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
                        <button type="submit" disabled={!email || !password} className="btn-primary">Login</button>
                    </div>

                    <div className="mt-16 text-left">
                        <h5> <span className="text-red-600 font-bold">*</span> Required Data</h5>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;