import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router";
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";
import IndexNum from "./components/IndexNum.jsx";
import SelectNumberInput from './components/SelectNumberInput.jsx';
import Confirmation from "./components/Confirmation"; 
import Loading from './components/Loading';
import ErrorOverlay from './components/ErrorOverlay.jsx';
import api from './utils/axiosInstance.js';

export default function Show() {
    const navigate = useNavigate();
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [howMany, setHowMany] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState(null);
    const [user, ] = useAtom(userAtom);
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    useEffect(() => {
        async function getSingleData (recipeId) {
            try {
               const response = await api.get(`/recipes/${recipeId}`);
               setRecipe(response.data);
               setHowMany(response.data.howManyServe);
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
            const { data } = await api.delete(`/recipes/${recipeId}`, reqHeader);
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
    const handleQty = e => {
        setHowMany(e.target.value);
    };

    return (
        <div className="w-70 mx-auto md:w-full md:max-w-250 md:px-5">
            <div className="md:flex gap-8">
                <div className="md:w-2/3">
                    <h1 className="my-3 pb-2 text-center text-2xl font-bold border-b-2 border-dotted">{recipe.title}</h1>
                    {recipe.topImage?.url ? 
                        <img src={recipe.topImage.url} alt={recipe.title} className="rounded-xl"/>
                        :
                        <div className="text-center h-50 bg-gray-100 flex items-center rounded-xl">
                            <p className='mx-auto'>No Image</p>
                        </div>
                    }
                
                    <p className="my-3 pb-2 border-b-2 border-dotted">{recipe.caption}</p>
                    <div className="mx-auto max-w-65">
                        <h2 className="mx-auto my-3 text-center text-2xl font-bold border-b-2 border-dotted">
                            材料
                            {recipe?.howManyServe && <span className='text-lg ml-3'><SelectNumberInput min={1} max={5} initial={howMany} handleChange={handleQty}/></span>}
                            </h2>
                        {recipe.ingredients?.map((ingredient, i) => (                    
                            <li key={i} className="list-none flex justify-between">
                                <span className="w-1/2">{ingredient.name}</span>
                                {ingredient.unit.match(/さじ|匙/) ?
                                <span className='text-right'>{ingredient.unit}{Math.round(ingredient.qty*howMany/recipe.howManyServe*10)/10}</span>
                                :
                                <span className='text-right'>{Math.round(ingredient.qty*howMany/recipe.howManyServe*10)/10}{ingredient.unit}</span>
                            }
                                
                            </li>
                        ))}
                    </div>
                </div>
            
                <div className='md:w-full'>
                    <h2 className="w-50 mx-auto my-3 text-center text-2xl font-bold border-b-2 border-dotted">作り方</h2>
                    <ul className="">
                    {recipe.processes?.map((process, i) => (
                        <div key={i} className="my-5 w-50 mx-auto border-b border-dotted md:w-full">
                            <IndexNum i={i}/>
                            <div className="md:flex md:my-3 gap-3 md:items-center">
                                <li className="pb-2">{process.description}</li>
                                {process.hasImage &&
                                    <img
                                    src={process?.imageUrl}
                                    alt={process.description}
                                    className='md:w-30'
                                    />
                                }
                                
                            </div>
                        </div>
                    ))}
                    </ul>
                </div>
            </div>
            {/* & recipe.supplement.length > 0 */}
            {recipe?.supplement && recipe.supplement?.length > 0 &&
                <div className="max-w-150 mx-auto rounded-xl bg-sky-100 p-4 my-5">
                    <p className="text-2xl mb-2 text-teal-600 text-center"><i className="ri-lightbulb-fill"></i>Tips</p>
                    {recipe.supplement}
                </div>
            }
            
            
        
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