import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";
import axios from "axios";
import IndexNum from "./components/IndexNum.jsx";
import Confirmation from "./components/Confirmation"; 
import Loading from './components/Loading';
import ErrorOverlay from './components/ErrorOverlay.jsx';

export default function Show() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [user, ] = useAtom(userAtom);
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    useEffect(() => {
        async function getSingleData (recipeId) {
            try {
               const response = await axios.get(`http://localhost:3000/api/recipes/${recipeId}`);
               setRecipe(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        getSingleData(recipeId);
    }, [recipeId])
    
    const showConfirmation = () => {
        setShowConfirm(true);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.delete(`http://localhost:3000/api/recipes/${recipeId}`, reqHeader);
            console.log(data);
            navigate('/recipes', {state: {message: `「${data.title}」を削除しました。`}})
        } catch (error) {
            console.error(error);
            setError(error.response.data);
        } finally {
            setShowConfirm(false);
            setIsLoading(false);
        }
    }
    const onClose = () => {
        setShowConfirm(false);
    }

    return (
        <div className="w-70 mx-auto">
            <h1 className="my-3 pb-2 text-center text-2xl font-bold border-b-2 border-dotted">{recipe.title}</h1>
            {recipe.topImage?.url ? 
                <img src={recipe.topImage.url} alt={recipe.title} className="rounded-xl"/>
                :
                <div className="text-center h-50 bg-gray-100 flex items-center rounded-xl">
                    <p className='mx-auto'>No Image</p>
                </div>
            }
        
            <p className="my-3 pb-2 text-center border-b-2 border-dotted">{recipe.caption}</p>
            <div className="w-50 mx-auto">
                <h2 className="mx-auto my-3 text-center text-2xl font-bold border-b-2 border-dotted">
                    材料
                    {recipe?.howManyServe && <span className='text-lg'>({recipe.howManyServe}人前)</span>}
                    </h2>
                {recipe.ingredients?.map((ingredient, i) => (
                    <li key={i} className="list-none">{ingredient.name} {ingredient.qty}{ingredient.unit}</li>
                ))}
            </div>
            <div>
                <h2 className="w-50 mx-auto my-3 text-center text-2xl font-bold border-b-2 border-dotted">作り方</h2>
                <ul>
                {recipe.processes?.map((process, i) => (
                    <div key={i} className="my-4 w-50 mx-auto">
                        <IndexNum i={i}/>
                        {process.hasImage ? 
                            <img
                            src={process?.imageUrl}
                            alt={process.description} 
                            />
                            :
                            <div className="text-center h-50 bg-gray-100 flex items-center rounded-xl">
                                <p className='mx-auto'>No Image</p>
                            </div>
                        }
                        <li>{process.description}</li>
                    </div>
                ))}
                </ul>
            </div>
            
        
            {(user && recipe.author?._id.toString() === user?._id.toString()) && 
            <>
                <Link
                    to={`/recipes/${recipe._id}/update`}
                    className='w-40 block mx-auto my-10 btn bg-lime-700 text-white font-bold text-center'
                >
                    編集する
                </Link>
                <button
                    onClick={showConfirmation}
                    className="btn bg-gray-200 block mx-auto"
                >
                    レシピを削除
                </button>
            </>
            }
            
            {showConfirm && 
            <Confirmation
                message={`「${recipe.title}」を削除しますか？`}
                onClose={onClose}
                action={handleDelete}
            />
            }
            {isLoading && <Loading />}
            {error && 
                <ErrorOverlay 
                    errors={error.message}
                    action={() => setError(null)}
                    buttonMsg={"閉じる"}
                />
            }
        </div>
    )
}