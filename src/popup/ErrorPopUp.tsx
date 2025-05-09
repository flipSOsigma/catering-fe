import { IoMdClose } from "react-icons/io"
export const ErrorPopUp = ({errorMsg, close}: {errorMsg: string, close: () => void}) => {
  return (
    <div className='w-screen h-screen fixed bg-white/50 backdrop-blur-xs top-0 left-0 flex justify-center items-center'>
      <div className="max-w-lg w-full bg-white border rounded-md p-4 flex flex-col">
        <div className="flex justify-end w-full">
          <button onClick={close}>
            <IoMdClose />
          </button>
        </div>
        <h1 className='text-center text-lg font-bold'>
          Mohon Maaf terjadi error dalam system
        </h1>
        <p className='w-full text-center'>{errorMsg}</p>
      </div>
    </div>
  )
}
