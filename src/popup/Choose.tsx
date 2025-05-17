
import { useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { Link } from 'react-router-dom'

const Choose = ({close}: {close: () => void}) => {

  const [file, setFile ] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // 'file' should match your backend field name

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/order/xlsx`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload success:', data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
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
        <div className="flex items-center w-full mt-4 gap-2">
          <Link to={'/wedding/create/'} className="bg-primary text-center flex-1 ">wedding</Link>
          <Link to={'/ricebox/create/'} className="bg-primary text-center flex-1">nasi kotak</Link>
        </div>
        <div className="w-full flex justify-center mt-4 gap-4 items-center">
          <div className="border-b border-b-gray-500 w-full"></div>
          <p className='whitespace-nowrap'>atau upload file excel</p>
          <div className="border-b border-b-gray-500 w-full"></div>
        </div>
        <form onSubmit={handleUpload} className="flex items-center w-full mt-4 gap-2">
          <input type="file" onChange={handleFileChange} className='text-xs border border-black py-2 px-4 rounded-md w-full'/>
          <button className='bg-primary text-center flex-1 py-2 px-4'>upload</button>
        </form>
      </div>
    </div>
  )
}

export default Choose