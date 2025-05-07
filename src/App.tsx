import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProtectedRoutes from './utils/protectedRoutes'
import Dashboard from './pages/Dashboard'
import WeddingUpdate from './pages/WeddingUpdate'
import CreateOrderWedding from './pages/WeddingCreate'
import CreateOrderRicebox from './pages/RiceboxCreate'
import Login from './auth/Login'
import Ricebox from './pages/Ricebox'
import Wedding from './pages/Wedding'
function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wedding" element={<Wedding />} />
          <Route path="/ricebox" element={<Ricebox />} />
          <Route path="/wedding/create/" element={<CreateOrderWedding />} />
          <Route path="/wedding/update/:uid" element={<WeddingUpdate />} />
          <Route path="/ricebox/create/" element={<CreateOrderRicebox />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
