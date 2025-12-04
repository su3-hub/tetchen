import { Link } from "react-router";

// const popUp = () => {

// }

export default function CreateButton () {
    return (
        <Link
            to="/recipes/new"
            // onMouseOver={popUp}
            className="z-0 fixed bottom-5 right-0 lg:bottom-10 lg:mr-20 inline-block bg-amber-400 rounded-full p-3 mr-4"><i className="ri-edit-line text-3xl text-white"></i>
        </Link>
    )
}