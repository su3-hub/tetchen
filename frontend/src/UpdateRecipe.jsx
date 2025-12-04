import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { motion } from "motion/react";
import Ingredients from "./components/Ingredients";
import SelectNumberInput from "./components/SelectNumberInput";
import ProcessForm from "./components/ProcessForm";
import { createUniqueId } from "./utils/actions";
import { initialRecipe } from "./utils/data";
import Loading from "./components/Loading";
import ErrorOverlay from "./components/ErrorOverlay";
import * as z from "zod";
import { recipeSchema } from '../../shared/schemas/recipeSchema.js';

export default function UpdateRecipe({}) {
    const { recipeId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [recipe, setRecipe] = useState(initialRecipe);
    const [error, setError] = useState(null);
    const [validation, setValidation] = useState([]);
    const [isDirty, setIsDirty] =useState(false);
    const navigate = useNavigate();
    const reqHeader = {headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}};

    useEffect(() => {
    async function getSingleData (recipeId) {
        try {
            const { data } = await axios.get(`http://localhost:3000/api/recipes/${recipeId}/update`, reqHeader);
            const initializedProcesses = data.processes.map(process => ({
                ...process, file: null, imageUrl: process.url || null, imageFilename: process.imageFilename || null, tempKey: createUniqueId(),
            }));
            setRecipe({...data, topImage: {...data.topImage, file: null}, processes: [...data.processes]});
            setError(null);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    };
    getSingleData(recipeId);
    }, []);

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
        if (e.target.files) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setRecipe({...recipe, topImage: {file: file, url: imageUrl}})
        } else if (name === "howManyServe") {
            setRecipe({...recipe, howManyServe: Number(value) > 0 ? Number(value): null});
        } else {
            setRecipe({...recipe, [e.target.name]: e.target.value})
        }
    };

    const handleUpdate = async (isDraft) => {
        const result = recipeSchema.safeParse(recipe);
        if (!result.success) {
            setValidation(z.flattenError(result.error).fieldErrors);
            setIsDirty(true);
            return;
        };
        const fileToUpload = recipe.topImage?.file;
        const processDescriptions = [];
        const formData = new FormData();
        recipe.processes.forEach((process, index) => {
            processDescriptions.push({
                description: process.description,
                hasImage: !!(process?.file || process?.imageFilename),
                url: process?.imageUrl,
                filename: process?.imageFilename,
            });
            if (process.file) {
                const fileKey = `processImage-${index}`;
                formData.append(fileKey, process.file, process.file.name);
            };
        });
        
        if(fileToUpload) {
            formData.append('topImageFile', fileToUpload, fileToUpload.name)
        } else {
            formData.append("topImage", JSON.stringify(recipe.topImage));
        };
        formData.append('title', recipe.title);
        formData.append('caption', recipe.caption);
        formData.append('howManyServe', recipe.howManyServe);
        formData.append('ingredients', JSON.stringify(recipe.ingredients));
        formData.append('processes', JSON.stringify(processDescriptions));
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key} : ${value}`);
        // }
        formData.append('isDraft', isDraft);
        setIsLoading(true);
        try {
            const res = await axios.put(
                `http://localhost:3000/api/recipes/${recipeId}/update`, formData, reqHeader,);
            setIsLoading(false);
            setRecipe(initialRecipe)
            navigate(`/recipes/${res.data._id}`);
        } catch (error) {
            console.error(error)
            setIsLoading(false);
            setError(error.response.data);
        };
    };

    return (
        <>
        {/* <ConfirmDelete /> */}
        <h1 className="text-5xl text-gray100 -mt-1 hollow-out font-bold" animate={{ rotate: 360 }} transition={{ duration: 1 }}>Update</h1>
        <form className='w-70 mb-8 mx-auto' onSubmit={(e) => e.preventDefault()} encType='multipart/form-data'>
            {/* Recipe name */}
            <div className="w-70 mx-auto my-5 flex flex-col text-center">
                <label htmlFor="title" className='mb-2 font-bold text-2xl'>
                    メニュー
                </label>
                <input 
                    id="title" 
                    type="text" 
                    name='title'
                    defaultValue={recipe.title}
                    placeholder='かんたん塩昆布浅漬け'
                    onChange={handleChangeRecipe}
                    className='w-70 bg-gray-50 rounded-sm border-b-2 border-gray-400 focus:outline-gray-200 mx-auto py-2 px-3 text-2xl'
                />
                {validation?.title && <p className="text-red-600 text-center">{validation.title}</p>}
            </div>
            
            <div className='mx-auto mb-7 flex flex-col text-center'>
                <label
                    htmlFor="caption" className="mb-2 font-bold text-2xl">概要</label>
                <textarea
                    name="caption"
                    id="caption"
                    rows={3}
                    defaultValue={recipe.caption}
                    placeholder="手間いらず、いつもの食材で簡単な作り置きおかず"
                    onChange={handleChangeRecipe}
                    className='block mx-auto w-full mb-3 p-2 rounded-xl bg-gray-50 outline-1 outline-amber-300 focus:outline-2 focus:outline-amber-500'
                ></textarea>
            </div>

            {/* Top image input */}
            <div className="mx-auto mb-7 flex flex-col text-center">
                <label htmlFor="title" className='mb-2 font-bold text-2xl'>
                    トップ画像
                </label>
                <input 
                id="topImage" 
                type="file" 
                name='title'
                accept='.jpg, .jpeg, .png'
                onChange={handleChangeRecipe}
                className='btn w-40 mx-auto bg-amber-700 shadow-md cursor-pointer text-white text-bold'
                />
            </div>
            {/* Top image */}
            {recipe.topImage?.url && 
            <img className='object-cover square mx-auto mb-8 rounded-xl w-60 h-60'
                src={recipe.topImage.url} alt={recipe.title} />}

            {/* ingredients */}
            <div className='mx-auto mb-7 flex flex-col'>
                <div className="text-xl mb-2 text-center">
                    <h1 className='font-bold text-2xl text-center'>材料</h1>
                    <p className='inline-block mx-auto'>
                        <SelectNumberInput
                            min={1}
                            max={5}
                            initial={recipe.howManyServe}
                            handleChangeRecipe={handleChangeRecipe}/>
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
            
            <div>
                <ProcessForm
                processes={recipe.processes}
                setRecipe={setRecipe}
                validation={validation?.processes}
            />
            </div>


            <button
                onClick={() => handleUpdate(false)}
                className='w-40 block mx-auto my-10 btn bg-lime-700 text-white font-bold'>
                変更を保存
            </button>
            <button
                onClick={() => handleUpdate(true)}
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
