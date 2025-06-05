import { useEffect, useState } from "react"

const Loading = () => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots(dots => (dots.length < 3 ? dots + '.' : ''))
    }, 300)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className='w-screen z-40 h-screen flex justify-center items-center top-0 left-0 fixed flex-col backdrop-blur-sm bg-white/30 gap-4'>
      <div className="rounded-full aspect-square w-16 bg-paid border border-black animate-bounce delay-100"></div>
      <h1 className="text-xl">Loading{dots}</h1>
    </div>
  )
}

export default Loading

