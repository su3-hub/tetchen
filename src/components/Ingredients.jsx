import { motion } from "motion/react";

export default function Ingredients ({ingredients, validation, setRecipe}) {
    const handleChangeIngredient = (e, i) => {
        const { name, value } = e.target;
        setRecipe(prev => {
            const newSet = [...prev.ingredients];
            newSet[i][name] = value;
            return {...prev, ingredients: newSet};
        })
    };

    const addInput = () => {
        const newArray = [...ingredients];
        newArray.push({name:'', qty: '',})
        setRecipe(prev => {
            return {...prev, ingredients: [...prev.ingredients, {name:'', qty: 0, unit: ''}]}
        })
    };

    const deleteInput = (e, i) => {
        const newIngredients = [...ingredients];
        newIngredients.splice(i, 1);
        setRecipe(prev => ({...prev, ingredients: newIngredients}));
    };

    return (
        <ul className="flex flex-col w-70 mb-3 gap-4">
            {ingredients.map((ing, i) => (
                <motion.div key={i} className='flex gap-2' layout initial={{opacity: 0}} animate={{ opacity: 1}}>
                    <input type="text" name='name' 
                        placeholder='玉ねぎ'
                        defaultValue={ing.name}
                        onChange={(e) => handleChangeIngredient(e, i)}
                        className='ingredient w-34 bg-gray-50 outline-sky-200 outline-2 focus:outline-sky-300 focus:outline-3 rounded-md p-1 text-center'/>                
                    <input type="text" name='qty' 
                        placeholder='500g'
                        defaultValue={ing.qty}
                        onChange={(e) => handleChangeIngredient(e, i)}
                        className='ingredient w-26 bg-gray-50 outline-sky-200 outline-2 focus:outline-sky-300 focus:outline-3 rounded-md p-1 text-center'/>
                    {/* <input type="text" name='unit' 
                        placeholder='グラム'
                        defaultValue={ing.unit}
                        onChange={(e) => handleChangeIngredient(e, i)}
                        className='ingredient w-12 bg-gray-50 outline-sky-200 outline-2 focus:outline-sky-300 focus:outline-3 rounded-md p-1 text-center'/> */}
                    <div className="content-center">
                    {/* <i className="ri-close-circle-line text-2xl hover:opacity-80 text-red-600"></i> */}
                    <i
                        onClick={e => deleteInput(e, i)}
                        className="ri-close-circle-fill text-xl hover:opacity-80 text-gray-400"></i>
                    </div>
                </motion.div>
            ))}
            {validation && 
                validation.map(m => (
                    <p className="text-red-600 text-center text-base/2">{m}</p>
                ))
            }
            <button
                onClick={addInput}
                className='w-40 mx-auto btn bg-amber-700 text-white font-bold'>
                ＋材料を追加
            </button>
        </ul>
    )
}