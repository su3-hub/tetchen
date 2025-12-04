import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../context/jotai.js";

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useAtom(userAtom);
    const [showMenu, setShowMenu] = useState(false);
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    const handleLogout = () => {
        setUser(null);
        localStorage.setItem("token", null);
        setShowMenu(false);
        navigate("/recipes")
    };

    const handleMenu = () => {
        setShowMenu(!showMenu);
    };
    return (
        <div className="w-full sticky top-0 z-30">
            <div className="w-screen bg-yellow-500">
                <nav className="w-8/10 md:w-7/10 text-white mx-auto py-4 max-w-5xl">
                    <div className="flex justify-between items-center relative ">
                        <NavLink to='/' className='text-4xl'>
                            Tetchen
                        </NavLink>
                        <div className="md:hidden cursor-pointer relative z-50">
                            {showMenu ? 
                            <i className="ri-close-large-fill text-2xl z-50" onClick={handleMenu}></i>
                            :
                            <i onClick={handleMenu} className="ri-menu-line text-2xl"></i>}
                        </div>
                        {/* menu over sm */}
                        <div className="hidden md:block">
                        <NavLink to='/recipes' className="btn gradual hover:bg-amber-600"  onClick={handleMenu}>
                            レシピ一覧
                        </NavLink>
                        <NavLink to='/recipes/new' className="btn gradual hover:bg-amber-600"  onClick={handleMenu}>
                            レシピを書く
                        </NavLink>
                        {user ?
                            <>
                                <NavLink to={`/recipes/myitems/${user._id}`} className="btn gradual hover:bg-amber-600"  onClick={handleMenu}>
                                    マイレシピ
                                </NavLink>
                                <button className="btn gradual hover:bg-amber-600" onClick={handleLogout}>
                                    ログアウト
                                </button>
                            </>
                            : 
                            <>
                                <NavLink to='/user/login' className="btn text-white gradual hover:bg-amber-600"  onClick={handleMenu}>ログイン</NavLink>
                                <NavLink to='/user/register' className="btn text-white gradual hover:bg-amber-600"  onClick={handleMenu}>ユーザー登録</NavLink> 
                            </>
                       }
                       </div>
                    </div>
                </nav>
            </div>

            {/* overlay */}
            
            <div className={`z-49 drawer fixed ${showMenu ? "left-0": "left-full"} top-0 inset-0 md:hidden`}>
                <div className={`drawer fixed ${showMenu ? "left-0": "left-full"} top-0 inset-0 `} onClick={handleMenu}></div>
                <div className="inset-0 ml-15 my-auto bg-black opacity-70 w-screen h-screen" ></div>

                <div className={`text-center absolute top-0 w-40 flex flex-col h-screen text-gray-700 justify-center ${showMenu ? "left-1/2 transform -translate-x-1/2": "left-full"}`}>
                    <NavLink to='/recipes' className="btn bg-white mb-7"  onClick={handleMenu}>
                        レシピ一覧
                    </NavLink>
                    <NavLink to='/recipes/new' className="btn bg-white mb-7"  onClick={handleMenu}>
                        レシピを書く
                    </NavLink>
                    {user ?
                        <>
                            <NavLink to={`/recipes/myitems/${user._id}`} className="btn bg-white"  onClick={handleMenu}>
                                マイレシピ
                            </NavLink>
                            <button className="btn bg-gray-400 text-white mb-7" onClick={handleLogout}>
                                ログアウト
                            </button>
                            <p>こんにちは、{user.username}さん</p>
                        </>
                        : 
                        <>
                            <NavLink to='/user/login' className="btn bg-gray-400 text-white mb-7"  onClick={handleMenu}>ログイン</NavLink>
                            <p className="text-white text-sm/1 -mb-1">まだアカウントがない人は<br/><i className="ri-arrow-down-double-line text-xl"></i></p>
                            <NavLink to='/user/register' className="btn bg-gray-400 text-white"  onClick={handleMenu}>サインアップ</NavLink>
                        </>
                    }
                </div>
            </div>
        </div>
    )
}