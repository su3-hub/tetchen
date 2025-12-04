import { useState, createContext } from "react";

const UserInfoContext = createContext();

function UserInfoProvider(props) {
    const { children } = props;
    const [user, setUser] = useState({});

    return (
        <UserInfoContext.Provider value={{user, setUser}}>
            {children}
        </UserInfoContext.Provider>
    )
}

export { UserInfoContext, UserInfoProvider };