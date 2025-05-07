import { IoMdClose } from "react-icons/io"

const DeleteConfirmation = ({uid, close}: {uid: string, close:() => void}) => {

  const apiRoute = import.meta.env.VITE_API_ROUTE

  const deleteOrder = async () => {
    try {
      const res = await fetch(`${apiRoute}/order/${uid}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) {
        throw new Error('Failed to delete order');
      }
      console.log('Order deleted successfully');
      window.location.reload();
    } catch (err) {
      console.error('Fetch error:', err);
      throw err;
    }
  }
  
  return (
    <div>
      <div className="w-screen h-screen fixed bg-white/50 backdrop-blur-xs top-0 left-0 flex justify-center items-center">
        <div className="max-w-sm w-full bg-white border rounded-md p-4 flex flex-col">
          <div className="flex justify-end w-full">
            <button onClick={close}>
              <IoMdClose />
            </button>
          </div>
          <h1 className="text-center text-lg font-bold">
            Hapus Pesanan
          </h1>
          <p className="w-full text-center">
            Apakah anda yakin ingin menghapus pesanan ini?
          </p>
          <div className="flex items-center w-full mt-4">
            <button className="bg-primary flex-1" onClick={close}>
              Batal
            </button>
            <button onClick={() => {close(); deleteOrder()}} className="bg-primary flex-1">Hapus</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmation