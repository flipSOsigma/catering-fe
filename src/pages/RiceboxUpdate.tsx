'use client';

import { useState, useCallback, useEffect } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import Navbar from '../components/Navbar';
import { MdChevronRight } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import PDFPopUp from '../popup/PDFPopUp';
import Loading from '../components/Loading';
import Cookies from 'js-cookie';

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
  unique_id?: string;
  updated_by?: string;
  created_by?: string;
  event_name: string;
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

export default function UpdateOrderRicebox() {
  const [user, setUser] = useState('');
  const uid = useParams().uid
  const apiRoute = import.meta.env.VITE_API_ROUTE
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
        console.log(data[0])
        setOrder(data[0]);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    if (uid) {
      fetchData();
    }

    const userStringed = Cookies.get('user')
    const userData = userStringed ? JSON.parse(userStringed) : null
    setUser(userData.username)

  }, []);

  const [order, setOrder] = useState<OrderData>({
    event_name: '',
    updated_by: user,
    invitation: 1,
    visitor: 1,
    note: '',
    price: 0,
    portion: 0,
    customer: {
      customer_name: '',
      customer_phone: '',
      customer_email: ''
    },
    event: {
      event_name: '',
      event_location: '',
      event_date: new Date().toISOString().split('T')[0],
      event_building: '',
      event_category: 'Ricebox',
      event_time: '08:00'
    },
    sections: [
      {
        id: 'menu-section',
        section_name: 'Menu Pondokan',
        section_note: '',
        section_price: 0,
        section_portion: 0,
        section_total_price: 0,
        portions: [{ id: 'menu-portion-0', portion_name: '', portion_note: '', portion_count: 0, portion_price: 0, portion_total_price: 0 }]
      }
    ]
  });

  const [approve, setApprove] = useState(false);
  const [validation, setValidation] = useState({ isValid: false, message: '' });

  const validateOrder = (order: OrderData): { isValid: boolean; message: string } => {
  // Check required fields in main order
  if (!order.event_name) {
    return { isValid: false, message: 'Event name is required' };
  }

  // Check required customer fields
  if (
    !order.customer.customer_name ||
    !order.customer.customer_phone ||
    !order.customer.customer_email
  ) {
    return { isValid: false, message: 'All customer fields are required' };
  }

  // Check required event fields
  if (
    !order.event_name ||
    !order.event.event_location ||
    !order.event.event_building ||
    !order.event.event_date ||
    !order.event.event_time
  ) {
    return { isValid: false, message: 'All event fields are required' };
  }

  // Check if at least one portion has a name and count > 0
  const hasValidPortions = order.sections.some(section => 
    section.portions.some(portion => 
      portion.portion_name && portion.portion_count > 0
    )
  );

  if (!hasValidPortions) {
    return { isValid: false, message: 'At least one menu item with portion count > 0 is required' };
  }

  return { isValid: true, message: '' };
};

  useEffect(() => {
  setValidation(validateOrder(order));
}, [order, order.customer, order.event, order.sections]);

  const createEmptyPortion = useCallback((sectionId: string, index: number): Portion => {
    return {
      id: `${sectionId}-portion-${index}`,
      portion_name: '',
      portion_note: '',
      portion_count: 0,
      portion_price: 0,
      portion_total_price: 0
    };
  }, []);

  const handlePortionChange = useCallback((
    sectionId: string,
    portionId: string,
    field: keyof Portion | 'section_note',
    value: string | number
  ) => {
    if (field === 'section_note') {
      setOrder(prev => {
        const updated = {
          ...prev,
          sections: prev.sections.map(section => 
            section.id === sectionId 
              ? { ...section, section_note: value as string }
              : section
          )
        };
        setValidation(validateOrder(updated));
        return updated;
      });
      return;
    }

    setOrder(prev => {
      const updatedSections = prev.sections.map(section => {
        if (section.id === sectionId) {
          const updatedPortions = section.portions.map(portion => {
            if (portion.id === portionId) {
              const updatedPortion = { ...portion, [field]: value };
              
              if (field === 'portion_count' || field === 'portion_price') {
                const count = field === 'portion_count' ? Number(value) : portion.portion_count;
                const price = field === 'portion_price' ? Number(value) : portion.portion_price;
                updatedPortion.portion_total_price = count * price;
              }
              
              return updatedPortion;
            }
            return portion;
          });
          
          return {
            ...section,
            portions: updatedPortions,
            section_portion: updatedPortions.reduce((sum, p) => sum + p.portion_count, 0),
            section_total_price: updatedPortions.reduce((sum, p) => sum + p.portion_total_price, 0)
          };
        }
        return section;
      });

      const updatedOrder = {
        ...prev,
        sections: updatedSections,
        price: updatedSections.reduce((sum, section) => sum + section.section_total_price, 0),
        portion: updatedSections.reduce((sum, section) => sum + section.section_portion, 0)
      };
      
      setValidation(validateOrder(updatedOrder));
      return updatedOrder;
    });
  }, []);

  const addPortion = useCallback((sectionId: string) => {
    setOrder(prev => {
      const section = prev.sections.find(s => s.id === sectionId);
      if (!section) return prev;

      const newIndex = section.portions.length;
      const newPortion = createEmptyPortion(sectionId, newIndex);
      
      const updatedSections = prev.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              portions: [...s.portions, newPortion] 
            } 
          : s
      );

      const updatedOrder = {
        ...prev,
        sections: updatedSections
      };
      setValidation(validateOrder(updatedOrder));
      return updatedOrder;
    });
  }, [createEmptyPortion]);

  const removePortion = useCallback((sectionId: string, portionId: string) => {
    setOrder(prev => {
      const section = prev.sections.find(s => s.id === sectionId);
      if (!section || section.portions.length <= 1) return prev;

      const updatedPortions = section.portions.filter(p => p.id !== portionId);
      
      const updatedSections = prev.sections.map(s => 
        s.id === sectionId 
          ? { 
              ...s, 
              portions: updatedPortions,
              section_portion: updatedPortions.reduce((sum, p) => sum + p.portion_count, 0),
              section_total_price: updatedPortions.reduce((sum, p) => sum + p.portion_total_price, 0)
            } 
          : s
      );

      const updatedOrder = {
        ...prev,
        sections: updatedSections,
        price: updatedSections.reduce((sum, s) => sum + s.section_total_price, 0),
        portion: updatedSections.reduce((sum, s) => sum + s.section_portion, 0)
      };
      
      setValidation(validateOrder(updatedOrder));
      return updatedOrder;
    });
  }, []);

  const [openPDF, setOpenPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const validationResult = validateOrder(order);
    setValidation(validationResult);
    
    if (!validationResult.isValid || !approve) {
      return;
    }

    const payload = {
      ...order,
      updated_by: user,
      sections: order.sections.map(s => ({
        ...s,
        portions: s.section_portion === 0 ? [] : s.portions.map(p => ({
          ...p,
          portion_count: Number(p.portion_count),
          portion_price: Number(p.portion_price),
          portion_total_price: Number(p.portion_total_price)
        }))
      }))
    };
    try {
      const response = await fetch(`${apiRoute}/order/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      setIsLoading(false);
      if (!response.ok) throw new Error('Failed to create order');
      setOpenPDF(true);
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating order:', error);
      alert(`Error updating order | error: ${error}`);
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('id-ID');
  };

  const parseCurrency = (formattedValue: string): number => {
    const numericString = formattedValue.replace(/\D/g, '');
    return numericString ? parseInt(numericString, 10) : 0;
  };

  const FoodSection = useCallback(({ 
    title, 
    section, 
    onPortionChange, 
    onAddPortion, 
    onRemovePortion 
  }: {
    title: string;
    section: Section;
    onPortionChange: (sectionId: string, portionId: string, field: keyof Portion | 'section_note', value: string | number) => void;
    onAddPortion: (sectionId: string) => void;
    onRemovePortion: (sectionId: string, portionId: string) => void;
  }) => {
    return (
      <div className='bg-white p-6 rounded-md shadow border border-slate-200'>
        <h1 className='font-bold text-xl'>{title}</h1>
        <p>Silahkan perbarui menu {title.toLowerCase()}</p>

        <div className='grid grid-cols-4 mt-4 items-center gap-4'>
          <p className='text-sm'>Nama</p>
          <p className='text-sm'>Harga</p>
          <p className='text-sm'>Jumlah</p>
          <p className='text-sm'>Total</p>
        </div>
        
        {section.portions.map((portion) => (
          <div className='grid grid-cols-4 mt-4 items-center gap-4' key={portion.id}>
            <input
              type='text'
              placeholder='Nama menu'
              className='border px-4 py-3 text-sm border-slate-300 rounded'
              value={portion.portion_name}
              onChange={(e) => onPortionChange(section.id, portion.id, 'portion_name', e.target.value)}
            />
            <input
              type='text'
              placeholder='Harga /porsi'
              className='border px-4 py-3 text-sm border-slate-300 rounded'
              value={formatCurrency(portion.portion_price)}
              onChange={(e) => {
                const numericValue = parseCurrency(e.target.value);
                onPortionChange(section.id, portion.id, 'portion_price', numericValue);
              }}
              onBlur={(e) => {
                const numericValue = parseCurrency(e.target.value);
                onPortionChange(section.id, portion.id, 'portion_price', numericValue);
              }}
            />
            <input
              type='number'
              placeholder='Jumlah porsi'
              className='border px-4 py-3 text-sm border-slate-300 rounded'
              value={portion.portion_count}
              onChange={(e) => onPortionChange(section.id, portion.id, 'portion_count', Number(e.target.value))}
            />
            <input
              disabled
              type='number'
              placeholder='Total harga'
              className='border px-4 py-3 text-sm border-slate-300 rounded'
              value={portion.portion_total_price}
            />
            
            <textarea 
              className="border px-4 py-3 text-sm border-slate-300 rounded col-span-4" 
              placeholder={`Catatan untuk ${portion.portion_name}`}
              value={portion.portion_note}
              onChange={(e) => onPortionChange(section.id, portion.id, 'portion_note', e.target.value)}
            />
          </div>
        ))}

        <textarea
          rows={4}
          className='w-full border px-4 py-3 text-sm border-slate-300 rounded mt-4'
          placeholder={`Catatan untuk ${title.toLowerCase()}`}
          value={section.section_note}
          onChange={(e) => onPortionChange(section.id, '', 'section_note', e.target.value)}
        />

        <div className='text-sm text-right mt-2 text-slate-600'>
          Total Porsi: <strong>{section.section_portion}</strong> | Total Harga:{' '}
          <strong>{section.section_total_price.toLocaleString()}</strong>
        </div>

        <div className='flex justify-end gap-2'>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddPortion(section.id);
            }}
            className='mt-4 bg-primary text-white px-4 py-2 text-xs rounded flex items-center gap-2'
          >
            <FaPlus /> Tambah menu
          </button>
          {section.portions.length > 1 && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRemovePortion(section.id, section.portions[section.portions.length - 1].id);
              }}
              className='mt-4 bg-white text-black px-4 py-2 text-xs rounded flex items-center gap-2 border border-primary'
            >
              <FaMinus /> Hapus menu
            </button>
          )}
        </div>
      </div>
    );
  }, []);

  return (
    <div className='bg-slate-100 min-h-screen'>
      <Navbar />
      <div className='w-full flex border-b border-b-slate-100 flex-col lg:px-80 md:px-20 px-4 pt-2 pb-6 bg-white shadow'>
        <div className='pt-2 flex items-center gap-2'>
          <Link to="/dashboard">Dashboard</Link>
          <MdChevronRight />
          <Link to="/dashboard/wedding">Wedding</Link>
          <MdChevronRight />
          <span>Update Nasi Kotak</span>
        </div>
        <h1 className='font-bold mt-4 text-xl'>Update Nasi Kotak Order</h1>
        <p>Please fill out the form below to create a new wedding order</p>
        
        <div className='mt-8'>
          <p>Customer Data</p>
          <div className='grid grid-cols-1 md:grid-cols-3 mt-4 items-center gap-4'>
            <input
              type='text'
              value={order.event_name}
              onChange={(e) => setOrder({...order, event_name: e.target.value})}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Nama Pesanan'
              required
            />

            <input
              type='text'
              value={order.customer.customer_name}
              onChange={(e) => {
              const updated = {
                ...order, 
                customer: {
                  ...order.customer,
                  customer_name: e.target.value
                }
              };
              setOrder(updated);
              setValidation(validateOrder(updated));
            }}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Nama Penerima'
              required
            />

            <input
              type='number'
              value={order.customer.customer_phone}
              onChange={(e) => {
                const updated = {
                  ...order, 
                  customer: {
                    ...order.customer,
                    customer_phone: e.target.value
                  }
                };
                setOrder(updated);
              }}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Nomor HP'
              required
            />

            <input
              type='text'
              value={order.customer.customer_email}
              onChange={(e) => setOrder({
                ...order, 
                customer: {
                  ...order.customer,
                  customer_email: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Email'
              required
            />

            <input
              type='date'
              value={order.event.event_date}
              onChange={(e) => setOrder(prev => ({
                ...prev,
                event: {
                  ...prev.event,
                  event_date: e.target.value
                }
              }))}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Date'
              required
            />

            <input
              type='text'
              value={order.event.event_building}
              onChange={(e) => setOrder({
                ...order, 
                event: {
                  ...order.event,
                  event_building: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Rumah'
              required
            />

            <input
              type='text'
              value={order.event.event_location}
              onChange={(e) => setOrder({
                ...order, 
                event: {
                  ...order.event,
                  event_location: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Alamat'
              required
            />

            <input
              type='time'
              value={order.event.event_time}
              onChange={(e) => setOrder({
                ...order, 
                event: {
                  ...order.event,
                  event_time: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Time'
              required
            />

            <input
              type='text'
              value={order.event.event_category}
              disabled
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Event type'
            />
          </div> 
        </div>
      </div>

      <form onSubmit={handleSubmit} className='lg:px-80 md:px-20 px-4 p-6 space-y-4 bg-slate-100'>
        {order.sections.map(section => (
          <FoodSection
            key={section.id}
            title={section.section_name}
            section={section}
            onPortionChange={handlePortionChange}
            onAddPortion={addPortion}
            onRemovePortion={removePortion}
          />
        ))}
        
        <div className='bg-white p-6 rounded-md shadow border border-slate-200'>
          <div className='text-sm text-slate-700 mb-4 flex items-center flex-wrap gap-2'>
            <strong>Estimasi total Tamu:</strong> {order.visitor} | {' '}
            <strong>Total Semua Porsi:</strong> {order.portion} | {' '}
            <strong>Total Semua Harga:</strong> {order.price.toLocaleString()}
          </div>

          <label className='block mb-1 font-medium'>Catatan Tambahan</label>
          <textarea
            rows={6}
            className='w-full border px-4 py-3 text-sm border-slate-300 rounded'
            placeholder='Catatan umum'
            value={order.note}
            onChange={(e) => setOrder({...order, note: e.target.value})}
          />

          {!validation.isValid && validation.message && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {validation.message}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={approve}
              onChange={() => setApprove(!approve)}
              id='accept'
            />
            <label htmlFor='accept' className="text-sm">Saya yakin dengan perubahan data di atas</label>
          </div>
          
          <div className='flex justify-end gap-2 mt-6'>
            <button
              onClick={() => setOpenPDF(true)}
              className='text-xs bg-primary disabled:bg-slate-400 text-white px-4 py-2 rounded hover:bg-yellow-600 duration-300'
            >
              Download PDF
            </button>
            <button
              type='submit'
              disabled={!approve || !validation.isValid}
              className='text-xs bg-primary disabled:bg-slate-400 text-white px-4 py-2 rounded hover:bg-yellow-600 duration-300'
            >
              Update Pesanan
            </button>
          </div>
        </div>
      </form>
      {openPDF && <PDFPopUp order={order} close={() => setOpenPDF(false)} />}
      {isLoading && <Loading />}
    </div>
  );
}