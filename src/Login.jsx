import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";
import * as z from "zod";
import ErrorOverlay from "./components/ErrorOverlay";
import { loginSchema } from "../shared/schemas/userSchema.js";
import api from "./utils/axiosInstance.js";

export default function Login() {
    const [loginElements, setLoginElements] = useState({ email: '', password: ''});
    const navigate = useNavigate();
    const { state } = useLocation();
    const [validation, setValidation] = useState([]);
    const [isDirty, setIsDirty] = useState(false);
    const [error, setError] = useState(null);
    const [, setUser] = useAtom(userAtom);

    useEffect(() => {
        if (!isDirty) return;

        const result = loginSchema.safeParse(loginElements);
            if (!result.success) {
                setValidation(z.flattenError(result.error).fieldErrors);
            } else {
                setValidation([])
            };
    }, [loginElements]);

    const handleChange = e => {
        const { name, value } = e.target;
        setLoginElements(prev => {
            return {...prev, [name]: value}
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const result = loginSchema.safeParse(loginElements);
        if (!result.success) {
            setValidation(z.flattenError(result.error).fieldErrors);
            setIsDirty(true);
            return;
        };
        try {
            const { data } = await api.post("/user/login", loginElements);
            localStorage.setItem("token", data.token)
            setUser(data.user);
            navigate("/recipes");
        } catch (error) {
            console.error('RES IS ERROR', error);
            setError(error.response.data.message)
        }
    };
    
    return (
        <div className="w-70 mx-auto">
            <h1 className="hollow-out text-6xl">Login</h1>
            {state?.message && 
                <h2 className="text-center mt-8 py-3 bg-red-100 rounded-md text-gray-600">{state.message}</h2>}
            
            <form onSubmit={handleLogin} className="">
                <div className="flex flex-col mb-5 mt-5">
                    <label htmlFor="email" className="text-center">メールアドレス</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="w-60 mx-auto outline rounded-sm p-1 focus:outline-2"
                        onChange={handleChange}
                    />
                    {validation?.email && <p className="text-red-600 text-center">{validation.email}</p>}
                </div>
                <div className="flex flex-col mb-5">
                    <label htmlFor="password" className="text-center">パスワード</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className="w-60 mx-auto outline rounded-sm p-1 focus:outline-2"
                        onChange={handleChange}
                    />
                    {validation?.password && <p className="text-red-600 text-center">{validation.password}</p>}
                </div>

                <button 
                    type="submit"
                    // onClick={handleLogin}
                    className="btn block mx-auto w-35 text-white font-bold text-lg bg-lime-700"    
                >ログイン</button>
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