import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai";
import ErrorOverlay from "./components/ErrorOverlay";
import * as z from "zod";
import { userRegistrationSchema } from "../shared/schemas/userSchema";
import api from "./utils/axiosInstance";

export default function UserRegister() {
    const [registerElements, setRegisterElements] = useState({username: '', email: '', password: ''});
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [validation, setValidation] = useState([]);
    const [error, setError] = useState(null);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (!isDirty) return;

        const result = userRegistrationSchema.safeParse(registerElements);
            if (!result.success) {
                setValidation(z.flattenError(result.error).fieldErrors);
            } else {
                setValidation([])
            };
    }, [registerElements]);

    const handleChange = e => {
        const { name, value } = e.target;
        setRegisterElements(prev => {
            return {...prev, [name]: value}
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const result = userRegistrationSchema.safeParse(registerElements);
            if (!result.success) {
                setValidation(z.flattenError(result.error).fieldErrors);
                setIsDirty(true);
                return;
            };
        try {
            const { data } = await api.post("/user/register", registerElements);
            localStorage.setItem("token", data.token)
            setUser(data.newUser);
            setError(null);
            navigate("/recipes", {state: {user: data.newUser}});
        } catch (error) {
            console.error(error);
            setError(error.response);
        }
    }
    return (
        <div className="w-70 mx-auto">
            <h1 className="hollow-out text-6xl">SignUp</h1>
            
            <form onSubmit={handleRegister} className="">
                <div className="flex flex-col mt-8 mb-5">
                    <label htmlFor="username" className="text-center">ユーザー名</label>
                    <input
                        id="username" type="text" name="username"
                        className="w-60 mx-auto outline rounded-sm p-1 focus:outline-2"
                        onChange={handleChange}
                    />
                    {validation?.username && <p className="text-red-600 text-center">{validation.username}</p>}
                </div>
                <div className="flex flex-col mb-5">
                    <label htmlFor="email" className="text-center">メールアドレス</label>
                    <input
                        id="email" type="email" name="email"
                        className="w-60 mx-auto outline rounded-sm p-1 focus:outline-2"
                        onChange={handleChange}
                    />
                    {validation?.email && <p className="text-red-600 text-center">{validation.email}</p>}
                </div>
                <div className="flex flex-col mb-5">
                    <label htmlFor="password" className="text-center">パスワード</label>
                    <input
                        id="password" type="password" name="password"
                        className="w-60 mx-auto outline rounded-sm p-1 focus:outline-2"
                        onChange={handleChange}
                    />
                    {validation?.password && <p className="text-red-600 text-center">{validation.password}</p>}
                </div>

                <button 
                    type="submit"
                    onClick={handleRegister}
                    className="btn block mx-auto w-35 text-white font-bold text-lg bg-lime-700"    
                >ユーザー登録</button>
            </form>

            {error && 
                <ErrorOverlay 
                    errors={error}
                    action={() => setError(null)}
                    buttonMsg={"閉じる"}
                />}
            </div>
    )
}