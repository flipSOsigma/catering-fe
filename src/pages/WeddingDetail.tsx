'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { MdChevronRight } from 'react-icons/md';
import { CiCirclePlus, CiTrash } from 'react-icons/ci';
import { HiEquals } from 'react-icons/hi2';
import { Link, useParams } from 'react-router-dom';
import PDFPopUp from '../popup/PDFPopUp';
import Loading from '../components/Loading';
import Cookies from 'js-cookie';
import DeleteConfirmation from '../popup/DeleteConfirmation';

type Portion = {
  id: string;
  portion_name: string;
  portion_note: string;
  portion_count: number;
  portion_price: number;
  portion_total_price: number;
};

type Section = {
  id: string;
  section_name: string;
  section_note: string;
  section_price: number;
  section_portion: number;
  section_total_price: number;
  portions: Portion[];
};

type OrderData = {
  updated_by?: string;
  unique_id?: string;
  event_name: string;
  created_at?: Date;
  invitation: number;
  visitor: number;
  note: string;
  price: number;
  portion: number;
  customer: {
    id?: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
  };
  event: {
    id?: string;
    event_name: string;
    event_location: string;
    event_date: string;
    event_building: string; 
    event_category: string;
    event_time: string;
  };
  sections: Section[];
};

export default function WeddingDetail() {
  const [openDelete, setOpenDelete] = useState(false);
  const [user, setUser] = useState('');
  const uid = useParams().uid;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [openPDF, setOpenPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROUTE}/order/${uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        setOrder(data[0]);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setIsLoading(false);
      }
    };

    if (uid) {
      fetchData();
    }

    const userStringed = Cookies.get('user');
    const userData = userStringed ? JSON.parse(userStringed) : null;
    setUser(userData?.username || '');
  }, [uid]);

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('id-ID');
  };

  const FoodSection = ({ 
    title, 
    section
  }: {
    title: string;
    section: Section;
  }) => {
    return (
      <div className='bg-white p-6 rounded-md shadow border border-slate-200'>
        <h1 className='font-bold text-xl'>{title}</h1>
        <p>Menu {title.toLowerCase()}</p>
        
        {section.portions.map((portion) => (
          <div className='grid grid-cols-4 mt-4 items-center gap-4' key={portion.id}>
            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {portion.portion_name || '-'}
            </div>
            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {formatCurrency(portion.portion_price)}
            </div>
            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {portion.portion_count}
            </div>
            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {formatCurrency(portion.portion_total_price)}
            </div>
            
            {portion.portion_note && (
              <div className="border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50 col-span-4">
                <strong>Catatan:</strong> {portion.portion_note}
              </div>
            )}
          </div>
        ))}

        {section.section_note && (
          <div className="w-full border px-4 py-3 text-sm border-slate-300 rounded mt-4 bg-slate-50">
            <strong>Catatan {title.toLowerCase()}:</strong> {section.section_note}
          </div>
        )}

        <div className='text-sm text-right mt-2 text-slate-600'>
          Total Porsi: <strong>{section.section_portion}</strong> | Total Harga:{' '}
          <strong>{formatCurrency(section.section_total_price)}</strong>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!order) {
    return (
      <div className='bg-slate-100 min-h-screen'>
        <Navbar />
        <div className='flex items-center justify-center h-64'>
          <p>Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-slate-100 min-h-screen'>
      <Navbar />
      <div className='w-full flex border-b border-b-slate-100 flex-col lg:px-80 md:px-20 px-4 pt-2 pb-6 bg-white shadow'>
        <div className='pt-2 flex items-center gap-2'>
          <Link to="/dashboard">Dashboard</Link>
          <MdChevronRight />
          <Link to="/dashboard/wedding">Wedding</Link>
          <MdChevronRight />
          <span>Order Detail</span>
        </div>
        <h1 className='font-bold mt-4 text-xl'>Wedding Order Details</h1>
        <p>Viewing details for order: {order.unique_id}</p>
        
        <div className='mt-8'>
          <p>Customer Data</p>
          <div className='grid grid-cols-3 mt-4 items-center gap-4'>
            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.event_name}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.customer.customer_name}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.customer.customer_phone}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.customer.customer_email}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {new Date(order.event.event_date).toLocaleDateString()}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.event.event_building}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.event.event_location}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.event.event_time}
            </div>

            <div className='border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.event.event_category}
            </div>
          </div> 
        </div>

        <div className='border-b border-b-slate-200 mt-4' />
        
        <div className='mt-8'>
          <p>Order Data</p>
          <div className='flex mt-4 items-center gap-4'>
            <div className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.invitation}
            </div>
            <MdChevronRight />
            <div className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.invitation * 2}
            </div>
          </div>
          <div className='flex mt-4 items-center gap-4'>
            <div className='flex-1 px-4'></div>
            <CiCirclePlus />
            <div className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.visitor - (order.invitation * 2)}
            </div>
          </div>
          <div className='flex mt-4 items-center gap-4'>
            <div className='flex-1 px-4 text-end'>Total People</div>
            <HiEquals />
            <div className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50'>
              {order.visitor}
            </div>
          </div>
        </div>
      </div>

      <div className='lg:px-80 md:px-20 px-4 p-6 space-y-4 bg-slate-100'>
        {order.sections.map(section => (
          <FoodSection
            key={section.id}
            title={section.section_name}
            section={section}
          />
        ))}
        
        <div className='bg-white p-6 rounded-md shadow border border-slate-200'>
          <div className='text-sm text-slate-700 mb-4 flex items-center flex-wrap gap-2'>
            <strong>Estimasi total Tamu:</strong> {order.visitor} | {' '}
            <strong>Total Semua Porsi:</strong> {order.portion} | {' '}
            <strong>Total Semua Harga:</strong> {formatCurrency(order.price)}
          </div>

          {order.note && (
            <div className="w-full border px-4 py-3 text-sm border-slate-300 rounded bg-slate-50">
              <strong>Catatan umum:</strong> {order.note}
            </div>
          )}

          <div className='flex justify-end gap-2 mt-6'>
            <button
              onClick={() => setOpenPDF(true)}
              className='text-xs bg-primary text-white px-4 py-2 rounded hover:bg-yellow-600 duration-300'
            >
              Download PDF
            </button>
            <button className='text-xs bg-primary text-white px-4 py-2 rounded hover:bg-yellow-600 duration-300'>
              <Link to={'/wedding/update/' + order.unique_id}>edit</Link>
            </button>
            <button onClick={() => setOpenDelete(!openDelete)} className='bg-white px-4 py-2 text-xs border border-primary rounded-md flex gap-2 items-center'><CiTrash/> Delete</button>
          </div>
        </div>
      </div>
      {openPDF && order && <PDFPopUp order={order} close={() => setOpenPDF(false)} />}
      {openDelete && (<DeleteConfirmation uid={uid ? uid : ""} close={() => setOpenDelete(!openDelete)}/>)}
    </div>
  );
}