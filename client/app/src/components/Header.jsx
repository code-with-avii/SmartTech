const Header =() =>{
    return(
        <div className="h-full w-full flex bg-[#333] p-2.5 justify-evenly">
            <a href="#" className="text-[#D8BFD8] px-3.5 py-5 transition rounded-3xl hover:text-black hover:bg-[#ddd]">Home</a>
            <a href="#" className="text-[#D8BFD8] px-3.5 py-5 transition rounded-3xl hover:bg-[#ddd] hover:text-black">Product</a>
            <a href="#" className="text-[#D8BFD8] px-3.5 py-5 transition rounded-3xl hover:bg-[#ddd] hover:text-black">About us</a>
            <a href="#" className="text-[#D8BFD8] px-3.5 py-5 transition rounded-3xl hover:bg-[#ddd] hover:text-black">Contact</a>

        </div>
    )
}

export default Header;