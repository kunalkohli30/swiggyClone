import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Body from './components/Body'
import { Route, Routes } from 'react-router-dom'
import RestaurantMenu from './components/Menu/RestaurantMenu'
import { Visibility } from './context/contextApi'
import { cartContext } from './context/contextApi'
import { cartItemType } from './context/contextApi'
import Cart from './components/Cart'
import { useDispatch, useSelector } from 'react-redux'
import toggleSlice from './utils/toggleSlice';
function App() {

  const visible = useSelector(state => state.toggleSlice.searchToggle);
  const dispatch = useDispatch();

  return (
        <div className={visible ? 'max-h-screen overflow-hidden' : ''}>
          <Routes>
            <Route path='/' element={<Navbar />} >
              <Route path='/' element={<Body />}></Route>
              <Route path='/restaurantMenu/:id' element={<RestaurantMenu />}></Route>
              <Route path='/cart' element={<Cart />}></Route>
            </Route>
            {/* <Body /> */}
          </Routes>
        </div>
  )
}

export default App
