import { Link } from "react-router-dom";

const TopNavbar = () => {
    return (
    <nav className="bg-black flex flex-col md:flex-row items-center w-full px-3 py-2 ">
        <div className="flex items-center gap-2 justify-center md:justify-start">
            <i className="fa-solid fa-truck-fast  text-white ml-1 text-sm"></i>
            <p className="text-xs text-white md:text-sm text-center md:text-left" >Free shipping on orders over ₹399</p>
        </div>
        <ul className="text-white text-xs flex flex-wrap gap-2 md:gap-6 justify-center md:ml-auto ">
            <Link
            className="cursor-pointer hover:bg-[#528748] px-2 py-1 rounded"
            to="/"
            >Home</Link>
            <Link className="cursor-pointer hover:bg-[#528748] px-2 py-1 rounded" to={"/Login"}>Login</Link>
            <li className="cursor-pointer hover:bg-[#528748] px-2 py-1 rounded">Contact</li>
            <Link 
            to="/help"
            className="cursor-pointer hover:bg-[#528748] px-2 py-1 rounded">Help Center</Link>
            <li className="cursor-pointer hover:bg-[#528748] px-2 py-1 rounded">Call Us 123-456-7890</li>
        </ul>
    </nav>
    )
}

export default TopNavbar;