import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Body from './components/Body'
import { Route, Routes } from 'react-router-dom'
import RestaurantMenu from './components/Menu/RestaurantMenu'
import Cart from './components/Cart'
import { CookiesProvider, useCookies } from 'react-cookie'
import Signin from './components/Signin'
import Profile from './components/Profile'
import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';
import Search from './components/search/Search'
import { AxiosResponse } from 'axios'
import { cartItemType } from './context/contextApi'
import { fetchCart, resInfo } from './utils/cartSlice'
import { useAppDispatch, useAppSelector } from './utils/hooks'
import axiosInstance from './config/AxiosInstance'
import { setLoggedIn, setUserData } from './utils/userLoginSlice'
import UserType from './interfaces/User'


function App() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    // get user data, is 401 received then set isLoggedIn to false;
    console.log('useeffect triggered on reload');

    // const fetchUserData = async () => {
    //   try {
    //     // 1. Attempt to fetch the user data
    //     const userResponse = await axiosInstance.get("/api/user/userData");
    //     console.log('user response number 1', userResponse);
    //     if (userResponse.status === 200) {
    //       loginAfterEffects(userResponse);
    //       console.log("user response retrieved in first attempt");
    //     }
    //     else if (userResponse.status === 401) {
    //       // 2. Access token invalid, try to refresh it
    //       console.log('refreshing access token');
    //       const refreshResponse = await axiosInstance.post("/auth/refresh-access-token");
    //       console.log('refresh access token response', refreshResponse);

    //       if (refreshResponse.status === 200) {
    //         //3. Try fetching the data again
    //         console.log("access token refreshed successfully");
    //         const retryUserResponse = await axiosInstance.get("/api/user/userData");

    //         if (retryUserResponse.status === 200) {
    //           console.log("user data fetched after refreshing");
    //           loginAfterEffects(retryUserResponse);
    //         }
    //         else {
    //           console.log("Failed to fetch data even after refreshing access token");
    //         }
    //       } else {
    //         console.log("Failed to refresh the access token");
    //       }
    //     }
    //   }
    //   catch (error) {
    //     console.log("An error occurred: ", error);
    //   }
    // }

    // if (isLoggedIn) {
      const fetchUserData = async () => {

        const userResponse = await axiosInstance.get("/api/user/userData");
        if (userResponse.status === 200) {
          loginAfterEffects(userResponse);
        }

      }
      fetchUserData();
    // }
  }, [])    // runs only one on component mount

  const loginAfterEffects = (response: AxiosResponse<any, any>) => {
    dispatch(setLoggedIn());
    const userData = {
      "fullName": response.data?.fullName,
      "email": response.data?.email,
      "role": response.data?.user_role,
      "uid": response.data?.uid,
      "imageUrl": response.data?.imageUrl,
      "phoneNumber": response.data?.phoneNumber
    } as UserType

    dispatch(setUserData({ userData: userData }));
    dispatch(fetchCart());
  }

  const visible = useAppSelector(state => state.toggleSlice.searchToggle);
  const signInSliderVisible = useAppSelector(state => state.toggleSlice.loginToggle);
  const showFoodDetailsCard = useAppSelector(state => state.toggleSlice.foodDetailsCardPopUp);

  const isLoggedIn = useAppSelector(state => state.loginSlice.isLoggedIn);

  const cartData = useAppSelector(state => state.cartSlice.cartItems);
  const resInfo = useAppSelector(state => state.cartSlice.resInfo);

  const [cookies, setCookie] = useCookies(['auth_token', 'refresh_token']);
  const authToken = cookies.auth_token;


  // useEffect(() => { console.log('isLoggedIn in app', isLoggedIn); dispatch(fetchCart({ authToken: authToken })) }, []);

  return (
    <APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY} onLoad={() => console.log('Maps API has loaded.')}>
      <CookiesProvider>
        <div className={visible || signInSliderVisible || showFoodDetailsCard ? 'max-h-screen overflow-hidden' : 'overflow-x-hidden '}>
          <Routes>
            <Route path='/' element={<Navbar />} >
              <Route path='/' element={<Body />}></Route>
              <Route path='/restaurantMenu/:id' element={<RestaurantMenu />}></Route>
              <Route path='/cart' element={<Cart />}></Route>
              <Route path='/signin' element={<Signin />}></Route>
              <Route path='/profile' element={<Profile />}></Route>
              <Route path='/search' element={<Search />}></Route>
            </Route>
            {/* <Body /> */}
          </Routes>
        </div>
      </CookiesProvider>
    </APIProvider>
  )
}

export default App
