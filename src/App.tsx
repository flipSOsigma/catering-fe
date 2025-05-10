import './App.css'
import Login from './auth/Login'
import Ricebox from './pages/Ricebox'
import Wedding from './pages/Wedding'
import Dashboard from './pages/Dashboard'
import ProtectedRoutes from './utils/protectedRoutes'
import CreateOrderWedding from './pages/WeddingCreate'
import CreateOrderRicebox from './pages/RiceboxCreate'
import UpdateOrderWedding from './pages/WeddingUpdate'
import UpdateOrderRicebox from './pages/RiceboxUpdate'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hello" element={<h1>hello World</h1>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/ricebox" element={<Ricebox />} />
          <Route path="/wedding/create/" element={<CreateOrderWedding />} />
          <Route path="/wedding/update/:uid" element={<UpdateOrderWedding />} />
          <Route path="/ricebox/create/" element={<CreateOrderRicebox />} />
          <Route path="/ricebox/update/:uid" element={<UpdateOrderRicebox />} />
        </Route>
      </Routes>
    </Router> 
  )
}

export default App
