
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Choose = ({close}: {close: () => void}) => {
  return (
    <div className='w-screen h-screen fixed bg-white/50 backdrop-blur-xs top-0 left-0 flex justify-center items-center'>
      <div className="max-w-sm w-full bg-white border rounded-md p-4 flex flex-col">
        <div className="flex justify-end w-full">
          <button onClick={close}>
            <IoMdClose />
          </button>
        </div>
        <h1 className='text-center text-lg font-bold'>
          Tambahkan Pesanan
        </h1>
        <p className='w-full text-center'>silahkan pilih salah satu dari pilihan di bawah</p>
        <div className="flex items-center w-full mt-4">
          <Link to={'/wedding/create/'} className="bg-primary text-center flex-1 ">wedding</Link>
          <Link to={'/ricebox/create/'} className="bg-primary text-center flex-1">nasi kotak</Link>
        </div>
      </div>
    </div>
  )
}

export default Choose