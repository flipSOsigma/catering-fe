import { Link } from 'react-router-dom'
import { useState } from 'react'
import { CiBank, CiBoxList, CiCalendar, CiLocationOn, CiTrash } from 'react-icons/ci'
import { dateFormating } from '../lib/functions'
import DeleteConfirmation from '../popup/DeleteConfirmation'

const OrderCard = (data: any) => {
  const [openDelete, setOpenDelete] = useState(false)

  const orderData = data
  console.log(orderData)
  const invoiceItem = [
    {
      id: 1,
      name: dateFormating(orderData.event.event_date),
      icon: <CiCalendar />,
    }, {
      id: 2,
      name: orderData.event.event_building,
      icon: <CiBank />
    }, {
      id: 3,
      name: orderData.event.event_location,
      icon: <CiLocationOn />,
    }
  ]


  return (
    orderData && (
      <div className='p-6 rounded-md flex bg-white shadow flex-col w-full'>
        <div className='flex justify-start'>
          <div className={((orderData.event.event_category).toLocaleLowerCase() == 'wedding' ? 'bg-paid ' : 'bg-unpaid ') +  "text-xs px-4 py-1 mb-2 rounded-full lowercase"}>{orderData.event.event_category}</div>
        </div>
        {(orderData.event.event_category).toLocaleLowerCase() == 'pernweddingikahan' ? (
          <Link to={'/wedding/update/' + orderData.uid} className='font-semibold'>{orderData.event_name}</Link>
        ) : (
          <Link to={'/ricebox/update/' + orderData.uid} className='font-semibold'>{orderData.event_name}</Link>
        )}
        <p className="mb-8">{orderData.customer.customer_name}</p>
        <div className="grid grid-cols-2 gap-1"> 
          {invoiceItem.map(( item ) => (
            <div className={( item.id == 3 ? "col-span-2 " : null ) + " flex gap-2 items-start"} key={item.id} >
              <div>
                {item.icon}
              </div>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col mt-6">
          <p className='text-gray-600 text-xs text-end mb-2'>dibuat pada {dateFormating(orderData.created_at)}</p>
          <div className="w-full flex justify-end items-center gap-2">
            {(orderData.event.event_category).toLocaleLowerCase() == 'wedding' ? (
              <Link to={'/wedding/update/' + orderData.unique_id } className='bg-primary px-4 py-2 text-xs border border-primary rounded-md flex gap-2 items-center'><CiBoxList/> Detail</Link>
            ) : (
              <Link to={'/ricebox/update/' + orderData.unique_id } className='bg-primary px-4 py-2 text-xs border border-primary rounded-md flex gap-2 items-center'><CiBoxList/> Detail</Link>
            )}
            <button onClick={() => setOpenDelete(!openDelete)} className='bg-white px-4 py-2 text-xs border border-primary rounded-md flex gap-2 items-center'><CiTrash/> Delete</button>
          </div>
        </div>  
        {
          openDelete && (
            <DeleteConfirmation uid={orderData.unique_id} close={() => setOpenDelete(!openDelete)}/>
          )
        }
      </div> 
    )
  )
}

export default OrderCard