import { Link } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";

const iconStyle = "text-white text-md flex flex-col text-center h-35 w-35 mx-auto rounded-full justify-center"
export default function HomePage() {
    const [user, setUser] = useAtom(userAtom);

    const handleLogout = () => {
        setUser(null);
        localStorage.setItem("token", null);
        setUser(null)
        navigate("/recipes")
    };

    return (
        <div className="mx-5 sm:mx-auto sm:w-150">
            {user && <p className='text-center'>こんにちは<span className='font-bold'>{user.username}</span>さん</p>}
            <h1 className="text-center my-3 text-2xl font-bold">てっちゃんのための<br/>レシピ集</h1>
            <p className="border-y-6 border-dotted py-4">てっちゃんの生活を充実させるレシピ集を目指します。凝った料理ではなく当たり前の食材・調味料を活かしたシンプルかつ素材の良いところを引き出す普段使いのレシピ募集。料理をしたことがない若者が一人暮らしを始めたときに使えるようなレシピが集まるとうれしいです。</p>
            <div className="grid gap-6 my-6 sm:flex sm:justify-center">
                <Link to="recipes/" className={`${iconStyle} bg-yellow-500 hover:opacity-80 gradual`}>
                    <i className="ri-restaurant-line text-6xl"></i>
                    <p>レシピを見る</p>
                </Link>
                {user ? 
                <button className={`${iconStyle} bg-lime-800 hover:opacity-80 cursor-pointer gradual`} onClick={handleLogout}>
                    <i className="ri-login-circle-line text-6xl"></i>
                    <p>ログアウト</p>
                </button>
                :
                <>
                <Link to="user/login" className={`${iconStyle} bg-blue-950 hover:opacity-80 gradual`}>
                    <i className="ri-login-circle-line text-6xl"></i>
                    <p>ログイン</p>
                </Link>
                <Link to="user/register" className={`${iconStyle} bg-teal-800 hover:opacity-80 gradual`}>
                    <i class="ri-user-add-line text-6xl"></i>
                    <p>アカウント作成</p>
                </Link>
                </>
                }
                
                
            </div>

        </div>
    )
}