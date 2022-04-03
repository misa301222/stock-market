import axios from "axios";

interface User {
    email: string,
    fullName: string,
    roles: string
}

const API_URL = `${process.env.REACT_APP_API_URL}/User`;
class AuthService {
    async login(email: string, password: string) {
        const body = {
            Email: email,
            Password: password
        }

        return axios
            .post(API_URL + "/Login", body)
            .then(response => {
                switch (response.data.responseCode) {
                    case 1:
                        if (response.data.dataSet.token) {
                            localStorage.setItem("email", response.data.dataSet.email);
                            localStorage.setItem('fullName', response.data.dataSet.fullName);
                            localStorage.setItem('token', response.data.dataSet.token);
                            localStorage.setItem("roles", response.data.dataSet.roles);
                            localStorage.setItem("isLoggedIn", JSON.stringify(true));

                            console.log('Logged Succesfully as: ' + response.data.dataSet.email);
                            console.log('Roles: ' + response.data.dataSet.roles);
                        }
                        break;
                    case 2:
                        console.log(response.data.responseMessage);
                        break;
                    case 3:

                        break;
                }
                console.log('respuesta: ' + JSON.stringify(response.data));

                return response;
            });
    }

    clearData() {
        // return <Logout />
    }

    async registerUser(fullName: string, email: string, password: string) {
        let roles: string[] = ['USER'];
        return axios.post(API_URL + "/RegisterUser", {
            fullName,
            email,
            password,
            roles
        });
    }

    get getCurrentUser() {
        return localStorage.getItem('email');
    }

    get getUser(): User {
        const user: User = {
            email: localStorage.getItem('email')!,
            fullName: localStorage.getItem('fullName')!,
            roles: localStorage.getItem('roles')!
        }

        return user;
    }

    get getRoles() {
        return localStorage.getItem('roles');
    }
}

export default new AuthService();