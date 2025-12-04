import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Ingredients from './components/Ingredients'
import ProcessForm from './components/ProcessForm'
import SelectNumberInput from "./components/SelectNumberInput";
import Loading from './components/Loading';
import ErrorOverlay from "./components/ErrorOverlay";
import { initialRecipe } from './utils/data';
import { useAtom } from "jotai";
import { userAtom } from "./context/jotai.js";
import * as z from "zod";
import { recipeSchema } from '@monorepo/shared/schemas/recipeSchema.js';

export default function CreateRecipe() {
    const [recipe, setRecipe] = useState(initialRecipe);
    const [isLoading, setIsLoading] = useState(false);
    const [user,] = useAtom(userAtom);
    const [validation, setValidation] = useState([]);
    const [isDirty, setIsDirty] =useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    useEffect(() => {
        if (!user) navigate('/user/login', {state: {message: 'ログインが必要です。'}});
    });

    useEffect(() => {
        if (!isDirty) return;

        const result = recipeSchema.safeParse(recipe);
            if (!result.success) {
                setValidation(z.flattenError(result.error).fieldErrors);
            } else {
                setValidation([])
            };
    }, [recipe]);

    const handleChangeRecipe = e => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            setRecipe({...recipe, topImageFile: file, topImageUrl: imageUrl});
        } else if (name === "howManyServe") {
            setRecipe({...recipe, howManyServe: Number(value) > 0 ? Number(value): null});
        } else {
            setRecipe({...recipe, [name]: value});
        }
    };

    const handleUpload = async (isDraft) => {
        const result = recipeSchema.safeParse(recipe);
        if (!result.success) {
            setValidation(z.flattenError(result.error).fieldErrors);
            setIsDirty(true);
            return;
        };
        const fileToUpload = recipe.topImageFile;
        const processDescriptions = [];
        const formData = new FormData();
        recipe.processes.forEach((process, index) => {
            processDescriptions.push({
                description: process.description,
                hasImage: !!process.file,
            });
            if (process.file) {
                const fileKey = `processImage-${index}`;
                formData.append(fileKey, process.file, process.file.name);
            }
        });
        formData.append('title', recipe.title);
        formData.append('caption', recipe.caption);
        if (fileToUpload) formData.append('topImage', fileToUpload, fileToUpload.name);
        formData.append('howManyServe', recipe.howManyServe);
        formData.append('ingredients', JSON.stringify(recipe.ingredients));
        formData.append('processes', JSON.stringify(processDescriptions));
        formData.append('isDraft', isDraft);
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key} : ${value}`)
        // }
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/recipes', formData, reqHeader);
            setIsLoading(false);
            setRecipe(initialRecipe)
            navigate(`/recipes/${res.data._id}`);
        } catch (error) {
            console.error(error);
            setError(error.response.data);
            setIsLoading(false);
        };
    };

    return (
    <>
    {/* <ConfirmDelete /> */}
    <h1 className="text-5xl text-gray100 -mt-1 hollow-out font-bold">New</h1>
    <form className='w-70 mt-10 mx-auto' onSubmit={(e) => e.preventDefault()} encType='multipart/form-data'>
        {/* Recipe name */}
        <div className="w-70 mx-auto mb-7 flex flex-col text-center">
            <label htmlFor="title" className='mb-2 font-bold text-2xl'>
                メニュー
            </label>
            <input 
                id="title" type="text" name='title'
                placeholder='かんたん塩昆布浅漬け'
                onChange={handleChangeRecipe}
                className='w-70 bg-gray-50 rounded-sm border-b-2 border-gray-400 focus:outline-gray-200 mx-auto py-2 px-3 text-2xl'
            />
            {validation?.title && <p className="text-red-600 text-center">{validation.title}</p>}
        </div>
        
        <div className='mx-auto mb-7 flex flex-col text-center'>
            <label
                htmlFor="caption" className="mb-2 font-bold text-2xl">キャプション(紹介文)</label>
            <textarea
                name="caption" id="caption" rows={3} 
                placeholder="手間いらず、いつもの食材で簡単な作り置きおかず"
                onChange={handleChangeRecipe}
                className='block mx-auto w-full mb-3 p-2 rounded-xl bg-gray-50 outline-1 outline-amber-300 focus:outline-2 focus:outline-amber-500'
            ></textarea>
            {validation?.caption && <p className="text-red-600 text-center">{validation.caption}</p>}
        </div>

        {/* Top image input */}
        <div className="mx-auto mb-7 flex flex-col text-center">
            <label htmlFor="title" className='mb-2 font-bold text-2xl'>
                トップ画像
            </label>
            <input 
            id="topImage" type="file" name='title' accept='.jpg, .jpeg, .png'
            onChange={handleChangeRecipe}
            className='btn w-40 mx-auto bg-lime-700 shadow-md cursor-pointer text-white text-bold'
            />
        </div>
        {/* Top image */}
        {recipe.topImageUrl && 
        <img className='object-cover square mx-auto mb-8 rounded-xl'
            src={recipe.topImageUrl} alt={`image of ${recipe.title}`} />}
        
        {/* ingredients */}
        <div className='mx-auto mb-7 flex flex-col'>
            <div className="text-xl mb-2 text-center">
                <h1 className='font-bold text-2xl text-center'>材料</h1>
                <p className='inline-block mx-auto'>
                    <SelectNumberInput min={1} max={5} handleChangeRecipe={handleChangeRecipe}/>
                </p>
            </div>
            
            <Ingredients
                ingredients={recipe.ingredients}
                howManyServe={recipe.howManyServe}
                setRecipe={setRecipe}
                validation={validation?.ingredients}
            />
        </div>
        
        {/* processes */}
        <h2 className='text-center font-bold text-2xl h-100vh mb-3'>
            工程リスト
        </h2>
        
        {/* process inputs */}
        <div>
            <ProcessForm
                processes={recipe.processes}
                setRecipe={setRecipe}
                validation={validation?.processes}
            />
        </div>

        <div className="border-t-2 border-dotted"></div>
        <button
            onClick={() => handleUpload(false)}
            className='w-40 block mx-auto my-10 btn bg-lime-700 text-white font-bold'>
            レシピ登録
        </button>
        <button
            onClick={() => handleUpload(true)}
            className='w-40 block mx-auto my-10 btn bg-gray-600 text-white font-bold'>
            下書き保存
        </button>
    </form>
    
    {isLoading && <Loading />}
    {error && 
    <ErrorOverlay 
        errors={error.message}
        action={() => setError(null)}
        buttonMsg={"閉じる"}
    />}
    </>
    )
}