import { IoMdClose } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { generateCateringPDF } from "../lib/pdfGenerator"


const PDFPopUp = ({order, close}: {order: any, close: () => void}) => {

  const navigate = useNavigate()
  return (
    <div className='w-screen h-screen fixed bg-white/50 backdrop-blur-xs top-0 left-0 flex justify-center items-center'>
      <div className="max-w-lg w-full bg-white border rounded-md p-4 flex flex-col">
        <div className="flex justify-end w-full">
          <button onClick={() => {close; navigate('/dashboard')}}>
            <IoMdClose />
          </button>
        </div>
        <h1 className='text-center text-lg font-bold'>
          Tambahkan Pesanan
        </h1>
        <p className='w-full text-center'>silahkan pilih salah satu dari pilihan di bawah</p>
        <div className="flex items-center w-full mt-4">
          <button onClick={() => {generateCateringPDF(order); navigate('/dashboard')}} className="bg-primary text-center flex-1 whitespace-nowrap">laporan marketing</button>
          <button onClick={() => {generateCateringPDF(order); navigate('/dashboard')}} className="bg-primary flex-1">surat jalan</button>
          <button onClick={() => {generateCateringPDF(order); navigate('/dashboard')}} className="bg-primary flex-1">pdf dapur</button>
        </div>
        <div className="flex items-center w-full mt-4">
          <button onClick={() => {generateCateringPDF(order); navigate('/dashboard')}} className="bg-primary text-center flex-1 ">download semua pdf</button>
        </div>
      </div>
    </div>
  )
}

export default PDFPopUp
