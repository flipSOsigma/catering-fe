import React from 'react'

const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <form action="" className='flex flex-col w-full max-w-xs'>
        <h1 className="text-xl">Marketing Login</h1>
        <p>silahkan login menggunakan akun yang sudah terdaftar</p>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="username">username</label>
          <input id='username' placeholder='username' name='username' className='border border-neutral-200 text-sm px-3 py-2 rounded-md' type="text" />
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <label htmlFor="username">password</label>
          <input className='border border-neutral-200 text-sm px-3 py-2 rounded-md' type="password" />
        </div>
      </form>
    </div>
  )
}

export default Login
