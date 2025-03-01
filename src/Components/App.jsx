import '../assets/App.css'
import { useLocation } from 'react-router-dom'
import Accessories from './Accessories'
import Account from './Account'
import Categories from './Categories'
import Ecobags from './Ecobags'
import Footer from './Footer'
import Gifts from './Gifts'
import Header from './Header'
import {Routes , Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cart from './Cart'
import Favorites from './Favorites'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchCart } from "../Redux/Slice/CartSlice";
import Search from './Search'
import ProductDetail from './ProductDetail'

function App() {
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  return (
    <>
      <ToastContainer />
      {location.pathname !== '/hesab' && <Header />}
      {location.pathname !== '/hesab' && <Categories />}
      <Routes>
        <Route exact path='/' element={<Accessories/>} />
        <Route exact path='/hediyyeler' element={<Gifts/>} />
        <Route exact path='/ekocantalar' element={<Ecobags/>} />
        <Route path='/hesab' element={<Account/>} />
      </Routes>
      {location.pathname !== '/hesab' && <Footer />}
      {location.pathname !== '/hesab' && <Cart />}
      {location.pathname !== '/hesab' && <Favorites />}
      {location.pathname !== '/hesab' && <Search />}
      {location.pathname !== '/hesab' && <ProductDetail />}
    </>
  )
}

export default App