import { FormEvent, useState } from "react"
import { FaEye } from "react-icons/fa6"
import Cookies from "js-cookie"
import Loading from "../../components/Loading"

const Signin = () => {
  const [isloading, setIsLoading] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handlerSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const username = (e.currentTarget.elements.namedItem("username") as HTMLInputElement).value
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value

    if(!username || !password) {
      setErrorMsg('tolong lengkapi form')
    } 

    setIsLoading(true)

    const apiRoute = import.meta.env.VITE_API_ROUTE
    const res = await fetch(`${apiRoute}/auth/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    console.log(data)

    setIsLoading(false)
    if(data.status == 200) {
      Cookies.set('token', data.data.auth.token)
      Cookies.set('user', JSON.stringify(data.data.user))
      window.location.href = '/'
    } else {
      setErrorMsg(data.msg)
    }
  }

  return (
    <div className="min-h-screen items-center flex justify-center px-4">
      <form onSubmit={handlerSubmit} className="flex flex-col gap-10 w-full max-w-sm p-4 rounded-md">
        <div className="w-full">
          <h1 className="text-xl">Marketing Login.</h1>
          <p className="text-gray-300">silahkan login dengan akun anda</p>
        </div>
        {errorMsg == "" ? ( null ) : (
          <div className="bg-red-400 border border-black text-white px-3 py-2 rounded flex items-center justify-center">
            <p>{errorMsg}</p>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <input type="text" id="username" placeholder="username" className="border border-neutral-200 text-sm px-3 py-2 rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-stretch">
              <input type={isPasswordOpen ? "text" : "password"} id="password" placeholder="password" className="border border-neutral-200 text-sm px-3 py-2 rounded-md w-full" />
              <div className="bg-black flex items-center justify-center px-3 cursor-pointer rounded text-white"><FaEye onClick={() => {setIsPasswordOpen(!isPasswordOpen)}} /></div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <button className="bg-primary w-full border border-black rounded py-2">login</button>
        </div>
      </form>
      {
        isloading && (
          <Loading />
        )
      }
    </div>
  )
}

export default Signin
