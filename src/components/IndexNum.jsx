export default function IndexNum({i, mt}) {
    return (
        <div className={`${mt} mb-1 mx-auto rounded-4xl bg-gray-700 text-white w-10 h-10 text-center content-center`}>
            <h2 className='font-bold text-xl mb-1 mx-auto'>{i+1}</h2>
        </div>
    )
};