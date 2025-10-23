import './App.css'
import Ricebox from './pages/Ricebox'
import Wedding from './pages/Wedding'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './utils/protectedRoutes'
import CreateOrderWedding from './pages/WeddingCreate'
import CreateOrderRicebox from './pages/RiceboxCreate'
import UpdateOrderWedding from './pages/WeddingUpdate'
import UpdateOrderRicebox from './pages/RiceboxUpdate'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signin from './pages/auth/Signin'
import WeddingDetail from './pages/WeddingDetail'
import RiceboxDetail from './pages/RiceboxDetail'
import TestingPage from './pages/TestingPage'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hello" element={<h1>hello World</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/ricebox" element={<Ricebox />} />
          <Route path="/wedding/create/" element={<CreateOrderWedding />} />
          <Route path="/wedding/update/:uid" element={<UpdateOrderWedding />} />
          <Route path="/wedding/detail/:uid" element={<WeddingDetail />} />
          <Route path="/ricebox/create/" element={<CreateOrderRicebox />} />
          <Route path="/ricebox/update/:uid" element={<UpdateOrderRicebox />} />
          <Route path="/ricebox/detail/:uid" element={<RiceboxDetail />} />
        </Route>
          <Route path="/testing/page" element={<TestingPage />} />
      </Routes>
    </Router> 
  )
}

export default App
