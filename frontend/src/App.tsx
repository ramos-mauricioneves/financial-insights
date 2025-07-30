import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import TokenMenu from './pages/TokenMenu'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Budget from './pages/Budget'
import Insights from './pages/Insights'
import Investments from './pages/Investments'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="token" element={<TokenMenu />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="insights" element={<Insights />} />
        <Route path="investments" element={<Investments />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
