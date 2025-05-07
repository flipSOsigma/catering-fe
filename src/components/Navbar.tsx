import { useState } from "react"
import { Link } from "react-router-dom"
import Choose from "../popup/Choose"

const Navbar = () => {
  const [ isOpen, setIsOpen ] = useState(false)

  return (
    <div className="w-full py-4 flex justify-between xl:px-80 lg:px-40 md:px-20 sm:px-10 px-4 border-b border-b-neutral-200">
      <div className="logo flex items-center">
        <div className="flex flex-col">
          <h1 className="font-bold -mb-1">Dashboard</h1>
          <p className="whitespace-nowrap">anisa catering</p>
        </div>
      </div>
      <div className=" flex items-center gap-4">
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