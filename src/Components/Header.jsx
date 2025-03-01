import style from '../assets/Header.module.css'
import clsx from 'clsx'
import { FaRegHeart } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import WaterfallPhoto from "../assets/IMG_5814.png"
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { auth } from '../Firebase/Config';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { LOGIN, LOGOUT } from '../Redux/Slice/AuthSlice';
import ShowOnLogin from './HiddenLinks/HiddenLink';
import { openCart, openFav, openSearch } from '../Redux/Slice/OpenCartSlice'; 
import { useSelector } from "react-redux";
import { selectUniqueItemCount } from "../Redux/Slice/CartSlice";
import { selectUniqueFavItemCount } from '../Redux/Slice/FavoritesSlice';
import { IoSearch } from "react-icons/io5";


function Header() {
  const [displayName, setDisplayName] = useState("")

  const uniqueItemCount = useSelector(selectUniqueItemCount);
  const uniqueFavItemCount = useSelector(selectUniqueFavItemCount);



  
  const dispatch = useDispatch()
  const navigate = useNavigate();


useEffect(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      setDisplayName(user.displayName);

      dispatch(LOGIN({
        userId: uid,
        email: user.email,
        userName: user.displayName
      }));
    } else {
      setDisplayName("Giriş et");

      dispatch(LOGOUT({
        userId: null,
        email: null,
        userName: null
      }));
    }
  });
}, [dispatch, setDisplayName]);

  const logOutUser = () => {

    signOut(auth).then(() => {
     toast.success("Çıxış edildi");
     navigate("/hesab");
      
   }).catch((error) => {
     toast.error(`Xəta baş verdi: ${error.message}`);
   });
 }
 
  return (
    <>
     <header className={clsx(style.head, style.bgMainColor)}>
        <nav className={`${style.nav}`}>

          <div className={style.waterfallLogo}>
            <Link to="/">
            <img width="150" height="103" src={WaterfallPhoto} alt="..." />
            </Link>
          </div>
          <div className={style.icons} style={{position: "relative"}}>
          <IoSearch className={clsx(style.textWhite, style.fontSize)} onClick={() => dispatch(openSearch())}/>
          <FaRegHeart className={clsx(style.textWhite, style.fontSize)} onClick={() => dispatch(openFav())}/>
            <ShowOnLogin>
          <span className={style.favCount}>{uniqueFavItemCount}</span>
          </ShowOnLogin>
          <div style={{position: "relative"}} >
          <FaShoppingBag className={clsx(style.textWhite, style.fontSize)} onClick={() => dispatch(openCart())}/>
          <span className={style.basketCount}>{uniqueItemCount}</span>
          </div>
            
          
            
            <Link to="/hesab" className={clsx(style.textWhite, style.decoration)}>
            <IoPersonSharp className={clsx(style.textWhite, style.fontSize)}/> <span className={style.accountText}>{displayName}</span>
            </Link>
            <ShowOnLogin>
            <Link to="/" className={clsx(style.textWhite, style.decoration)} onClick={logOutUser}>
            <span className={style.accountText}>Çıxış et</span>
            </Link>
            </ShowOnLogin>
          </div>
        </nav>
    </header>
    </>
  )
}

export default Header

