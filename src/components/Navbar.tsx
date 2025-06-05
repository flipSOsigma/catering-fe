import { useState } from "react"
import { Link } from "react-router-dom"
import Choose from "../popup/Choose"
import { MdOutlineMenu } from "react-icons/md"
import icon from '../assets/Logo Anisa Catering square.png'

const Navbar = () => {
  const [ isOpen, setIsOpen ] = useState(false)
  const [ isNavbarOpen, setIsNavbarOpen ] = useState(false)

  return (
    <div className="w-full py-4 flex justify-between xl:px-80 lg:px-40 md:px-20 sm:px-10 px-4 border-b border-b-neutral-200">
      <div className="logo flex items-center gap-4">
        <img src={icon} className="object-cover w-12" alt="" />
        <div className="flex flex-col">
          <h1 className="font-bold -mb-1">Dashboard</h1>
          <p className="whitespace-nowrap">anisa catering</p>
        </div>
      </div>
      <div className="md:hidden items-center flex">
        <MdOutlineMenu className="text-2xl " onClick={(e) => {e.preventDefault(); setIsNavbarOpen(!isNavbarOpen)}}/>
      </div>
      <div className={ (isNavbarOpen ? " right-0 " : " -right-full ") + "duration-300 ease-in-out md:static fixed md:bg-white/0 bg-white flex-col md:flex-row flex items-end md:items-center md:gap-4 md:w-auto w-1/2 md:mt-0 mt-4 md:p-0 p-5 gap-10 md:border-0 border top-14"}>
        {
          NavLink.map((item, index) => {
            return (
              <Link key={index} to={item.path}>
                <p>{item.name}</p>
              </Link>
            )
          })
        }
        <button className="bg-primary" onClick={(e) => {e.preventDefault(); setIsOpen(!isOpen)}}>tambah pesanan</button>
      </div>
      {isOpen ? <Choose close={() => {setIsOpen(!isOpen)}} /> : null}
    </div>
  )
}

const NavLink = [
  {
    name: "Dashboard",
    path: "/"
  }, 
  {
    name: "Ricebox",
    path: "/ricebox"
  },
  {
    name: "Wedding",
    path: "/wedding"
  }
]

export default Navbar