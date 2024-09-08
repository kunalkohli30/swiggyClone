import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Body from './components/Body'
import { Route, Routes } from 'react-router-dom'
import RestaurantMenu from './components/RestaurantMenu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path='/' element={<Navbar />} >
        <Route path='/' element={ <Body />}></Route>
        <Route path='/restaurantMenu/:id' element={ <RestaurantMenu />}></Route>
      </Route>
      {/* <Body /> */}
    </Routes>
  )
}

export default App
