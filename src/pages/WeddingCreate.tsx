'use client';

import { useState, useCallback } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6';
import Navbar from '../components/Navbar';
import { MdChevronRight } from 'react-icons/md';
import { CiCirclePlus } from 'react-icons/ci';
import { HiEquals } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { generateCateringPDF } from '../lib/pdfGenerator';
import PDFPopUp from '../popup/PDFPopUp';

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

export default function CreateOrderWedding() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData>({
    event_name: '',
    invitation: 0,
    visitor: 0,
    note: '',
    price: 0,
    portion: 0,
    customer: {
      customer_name: '',
      customer_phone: '',
      customer_email: ''
    },
    event: {
      event_name: 'Wedding',
      event_location: '',
      event_date: new Date().toISOString().split('T')[0],
      event_building: '',
      event_category: 'Wedding',
      event_time: '08:00'
    },
    sections: [
      {
        id: 'buffet-section',
        section_name: 'Buffet',
        section_note: '',
        section_price: 0,
        section_portion: 0,
        section_total_price: 0,
        portions: [{ id: 'buffet-portion-0', portion_name: '', portion_note: '', portion_count: 0, portion_price: 0, portion_total_price: 0 }]
      },
      {
        id: 'menu-section',
        section_name: 'Menu Pondokan',
        section_note: '',
        section_price: 0,
        section_portion: 0,
        section_total_price: 0,
        portions: [{ id: 'menu-portion-0', portion_name: '', portion_note: '', portion_count: 0, portion_price: 0, portion_total_price: 0 }]
      },
      {
        id: 'dessert-section',
        section_name: 'Dessert',
        section_note: '',
        section_price: 0,
        section_portion: 0,
        section_total_price: 0,
        portions: [{ id: 'dessert-portion-0', portion_name: '', portion_note: '', portion_count: 0, portion_price: 0, portion_total_price: 0 }]
      },
      {
        id: 'akad-section',
        section_name: 'Akad',
        section_note: '',
        section_price: 0,
        section_portion: 0,
        section_total_price: 0,
        portions: [{ id: 'akad-portion-0', portion_name: '', portion_note: '', portion_count: 0, portion_price: 0, portion_total_price: 0 }]
      }
    ]
  });

  const [approve, setApprove] = useState(false);
  const [validation, setValidation] = useState({ isValid: false, message: '' });

  const validateOrder = (order: OrderData): { isValid: boolean; message: string } => {
    // Condition 3: Check all required fields are filled
    if (
      !order.event_name ||
      !order.customer.customer_name ||
      !order.customer.customer_phone ||
      !order.event.event_location ||
      !order.event.event_building
    ) {
      return { isValid: false, message: 'Please fill all required fields' };
    }

    const buffetSection = order.sections.find(s => s.section_name === 'Buffet');
    const menuSection = order.sections.find(s => s.section_name === 'Menu Pondokan');
    const dessertSection = order.sections.find(s => s.section_name === 'Dessert');

    const buffetPortion = buffetSection?.section_portion || 0;
    const menuPortion = menuSection?.section_portion || 0;
    const dessertPortion = dessertSection?.section_portion || 0;

    // Condition 1: (buffet + menu) >= visitor * 3
    if (buffetPortion + menuPortion < order.visitor * 3) {
      return {
        isValid: false,
        message: `Total Buffet + Menu portions (${buffetPortion + menuPortion}) must be at least ${order.visitor * 3} (visitors × 3)`
      };
    }

    // Condition 2: (buffet + dessert) >= visitor
    if (buffetPortion + dessertPortion < order.visitor) {
      return {
        isValid: false,
        message: `Total Buffet + Dessert portions (${buffetPortion + dessertPortion}) must be at least ${order.visitor} (number of visitors)`
      };
    }

    return { isValid: true, message: '' };
  };

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

  const handleSectionUpdate = useCallback((sectionId: string, updatedPortions: Portion[]) => {
    setOrder(prev => {
      const updatedOrder = {
        ...prev,
        sections: prev.sections.map(section => 
          section.id === sectionId 
            ? { 
                ...section, 
                portions: updatedPortions,
                section_portion: updatedPortions.reduce((sum, portion) => sum + portion.portion_count, 0),
                section_total_price: updatedPortions.reduce((sum, portion) => sum + portion.portion_total_price, 0)
              } 
            : section
        ),
        price: prev.sections.reduce((sum, section) => 
          sum + (section.id === sectionId 
            ? updatedPortions.reduce((s, p) => s + p.portion_total_price, 0)
            : section.section_total_price), 0),
        portion: prev.sections.reduce((sum, section) => 
          sum + (section.id === sectionId 
            ? updatedPortions.reduce((s, p) => s + p.portion_count, 0)
            : section.section_portion), 0)
      };
      setValidation(validateOrder(updatedOrder));
      return updatedOrder;
    });
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

  
  const handleGeneratePDF = async (order: any) => {
    try {
      await generateCateringPDF(order);
    } catch (error: any) {
      alert('Failed to generate PDF: ' + error.message);
    }
  };

  const [openPDF, setOpenPDF] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationResult = validateOrder(order);
    setValidation(validationResult);
    
    if (!validationResult.isValid || !approve) {
      return;
    }

    const payload = {
      ...order,
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
      const response = await fetch('http://localhost:3030/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      // handleGeneratePDF(order)

      if (!response.ok) throw new Error('Failed to create order');
      setOpenPDF(true);
      const result = await response.json();
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
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
                // Format the value on blur
                const numericValue = parseCurrency(e.target.value);
                onPortionChange(section.id, portion.id, 'portion_price', numericValue);
              }}
            />
            {/* <input
              type='number'
              placeholder='Harga /porsi'
              className='border px-4 py-3 text-sm border-slate-300 rounded'
              value={portion.portion_price}
              onChange={(e) => onPortionChange(section.id, portion.id, 'portion_price', Number(e.target.value))}
            /> */}
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
          <span>Create New Order</span>
        </div>
        <h1 className='font-bold mt-4 text-xl'>Create New Wedding Order</h1>
        <p>Please fill out the form below to create a new wedding order</p>
        
        <div className='mt-8'>
          <p>Customer Data</p>
          <div className='grid grid-cols-3 mt-4 items-center gap-4'>
            <input
              type='text'
              value={order.event_name}
              onChange={(e) => setOrder({...order, event_name: e.target.value})}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Event name'
              required
            />

            <input
              type='text'
              value={order.customer.customer_name}
              onChange={(e) => setOrder({
                ...order, 
                customer: {
                  ...order.customer,
                  customer_name: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Customer name'
              required
            />

            <input
              type='number'
              value={order.customer.customer_phone}
              onChange={(e) => setOrder({
                ...order, 
                customer: {
                  ...order.customer,
                  customer_phone: e.target.value
                }
              })}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Phone number'
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
              onChange={(e) => setOrder({
                ...order, 
                event: {
                  ...order.event,
                  event_date: e.target.value
                }
              })}
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
              placeholder='Building'
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
              placeholder='Location'
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

        <div className='border-b border-b-slate-200 mt-4' />
        
        <div className='mt-8'>
          <p>Order Data</p>
          <div className='flex mt-4 items-center gap-4'>
            <input
              type='number'
              value={order.invitation || ''}
              onChange={(e) => {
                const newVisitor = (Number(e.target.value) || 0) * 2;
                setOrder(prev => {
                  const updated = {
                    ...prev,
                    invitation: Number(e.target.value) || 0,
                    visitor: newVisitor
                  };
                  setValidation(validateOrder(updated));
                  return updated;
                });
              }}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Invitations'
              required
            />
            <MdChevronRight />
            <input
              value={order.invitation * 2}
              type='number'
              disabled
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Estimated people'
            />
          </div>
          <div className='flex mt-4 items-center gap-4'>
            <div className='flex-1 px-4'></div>
            <CiCirclePlus />
            <input
              type='number'
              value={order.visitor - (order.invitation * 2)}
              onChange={(e) => {
                const newVisitor = (order.invitation * 2) + (Number(e.target.value) || 0);
                setOrder(prev => {
                  const updated = {
                    ...prev,
                    visitor: newVisitor
                  };
                  setValidation(validateOrder(updated));
                  return updated;
                });
              }}
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Additional people'
            />
          </div>
          <div className='flex mt-4 items-center gap-4'>
            <div className='flex-1 px-4 text-end'>Total People</div>
            <HiEquals />
            <input
              value={order.visitor}
              disabled
              type='number'
              className='flex-1 border px-4 py-3 text-sm border-slate-300 rounded'
              placeholder='Total people'
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
              type='submit'
              disabled={!approve || !validation.isValid}
              className='text-xs bg-primary disabled:bg-slate-400 text-white px-4 py-2 rounded hover:bg-yellow-600 duration-300'
            >
              Buat Pesanan
            </button>
          </div>
        </div>
      </form>
      {openPDF && <PDFPopUp order={order} close={() => setOpenPDF(false)} />}
    </div>
  );
}