import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import OrderCard from '../components/OrderCard'
import { useLocation } from 'react-router-dom'

const Wedding = () => {
  const [orderData, setOrderData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const routeApi = import.meta.env.VITE_API_ROUTE

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${routeApi}/order/Wedding`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        setOrderData(data)
        setFilteredData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [routeApi])

  // Filter data whenever searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(orderData)
      return
    }
    console.log(orderData)

    const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/)
    const filtered = orderData.filter(item => {
      const eventMatch = searchTerms.every(term => 
        item.event_name?.toLowerCase().includes(term)
      )
      
      const customerMatch = searchTerms.every(term =>
        item.customer?.customer_name?.toLowerCase().includes(term)
      )

      return eventMatch || customerMatch
    })
    
    setFilteredData(filtered)
  }, [searchTerm, orderData])

  const path = (useLocation().pathname === '/' ? 'Dashboard' : useLocation().pathname).toLowerCase()

  return (
    <div>
      <Navbar />
      <div className="flex flex-col w-full xl:px-80 lg:px-40 md:px-20 sm:px-10 px-4">
        <div className='py-10'>   
          <p className="mb-4">{path}</p>
          <h1 className='text-2xl font-bold'>Hello Marketing</h1>
          <p className='text-gray-600'>Selamat datang di halaman dashboard</p>
          <input 
            placeholder='Cari berdasarkan nama event atau nama pemesan' 
            type="text" 
            className='border border-neutral-200 mt-4 rounded-md py-2 px-4 text-sm w-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>  
      </div>
      <div className="min-h-screen bg-neutral-100 py-4">
        {isLoading ? (
          <div className="text-center py-10">Memuat data...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 xl:px-80 lg:px-40 md:px-20 sm:px-10 px-4">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, index: number) => (
                <OrderCard key={`${item.id || index}`} {...item} />
              ))
            ) : (
              <div className="col-span-2 text-center py-10 text-gray-500">
                {searchTerm.trim() 
                  ? `Tidak ditemukan hasil untuk "${searchTerm}"`
                  : 'Tidak ada data pesanan'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Wedding