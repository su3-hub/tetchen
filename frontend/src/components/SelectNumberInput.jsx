export default function SelectNumberInput ({min, max, initial, handleChangeRecipe}) {
    const numOption = (()=> {
        const array = [];
        for (let i = min; i <= max; i++) {
            if (i===initial) {
                array.push(<option value={i} selected>{i}</option>)
            } else {
                array.push(<option value={i}>{i}</option>)
            }
        };
        return array;
    })();

    return (
        <>
        <select
            name="howManyServe"
            id="howManyServe"
            className="border-2 border-sky-200 rounded-md bg-gray-50"
            onChange={handleChangeRecipe}
        >
            <option value="">--</option>
            {numOption.map(opt => (
                opt
            ))}
        </select>
        <label htmlFor="howManyServe">人前</label>
        </>
    )
}