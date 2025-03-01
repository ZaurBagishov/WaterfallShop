import style from "../assets/Favorites.module.css";
import { HiOutlineX } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { closeFav} from "../Redux/Slice/OpenCartSlice";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Button from "./Button";
import ShowOnLogin, { ShowOnLogOut} from "./HiddenLinks/HiddenLink";
import { useNavigate } from "react-router-dom";
import {removeFromFavoritesFirebase} from '../Redux/Slice/FavoritesSlice'
import { FaTrashAlt } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { toast } from 'react-toastify';
import { addToCartFirebase } from "../Redux/Slice/CartSlice";
import Loader from "./Loader";






function Favorites() {
  const isFavOpen = useSelector((state) => state.opencart.isFavOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {items:favoritesItems}=useSelector(state=>state.favorites)

const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFavOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling on the page
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when closed
    }
  }, [isFavOpen]);

  const handleClick = () => {
    navigate("/hesab");
  };

  const handleRemoveItem=(id)=>{
    dispatch(removeFromFavoritesFirebase(id))
  }

  // const cartItems = useSelector((state) => state.cart.items);

  // const handleBagClick = (pro) => {
  //   const isProductInCart = cartItems.some(item => item.id === pro.id);
  //   if (isProductInCart) {
  //     toast.error("Məhsul artıq səbətdədir");
  //   } else {
  //     dispatch(addToCartFirebase(pro));
  //     toast.success("Səbətə əlavə olundu");
  //   }
  // };
  
  const cartItems = useSelector((state) => state.cart.items);



  const handleBagClick = async (pro) => {
    const isProductInCart = cartItems.some((item) => item.id === pro.id);
    if (isProductInCart) {
      toast.error("Məhsul artıq səbətdədir"); // Product is already in the cart
    } else {
      setLoading(true);
      try {
        await dispatch(addToCartFirebase(pro)).unwrap();
        toast.success("Səbətə əlavə olundu"); // Added to cart
      } catch (error) {
        toast.error("Xəta baş verdi: " + error); // Error occurred
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <>
    {loading && <Loader />}
      {isFavOpen && (
        <div
          className={style.overlay}
          onClick={() => dispatch(closeFav())}
        ></div>
      )}
      <section className={style.container}>
        <div
          style={isFavOpen ? { width: "30em" } : { width: 0 }}
          className={style.sidebar}>
          <div className={style.center}>
            <div className={style.head}>
              <h1 className={style.bagName}>Favoritlər</h1>
              <HiOutlineX
                style={{ fontSize: "30px" }}
                onClick={() => dispatch(closeFav())}
              />
            </div>
            <ShowOnLogOut>
              <div className={style.signInDiv}>
                <div className={style.first}>
                  <FaHeart />
                  <h2>Favoritdə saxla</h2>
                </div>
                <div className={style.second}>
                  <p>
                    ✨Daha sonra geri qayıtmaq üçün bütün sevimli məhsullarınızı
                    və aksesuarlarınızı bir yerdə saxlamaq istərdinizmi?✨{" "}
                  </p>
                </div>
                <Button onClick={handleClick} name="Qeydiyyatdan keç" />
              </div>
            </ShowOnLogOut>
            <ShowOnLogin>
            { favoritesItems.map((item)=>(
            <div key={item.id} className={style.cart}>
              <div className={style.cartCenter}>
                <div className={style.cartImgDiv}>
                  <img
                    src={item.image}
                    alt={item.name}
                    width="120px"
                    height="160px"
                  />
                </div>
                <div className={style.cartItemsDiv}>
                  <h2>{item.name}</h2>
                  <h5 style={{ paddingTop: "10px" }}>{item.price}</h5>
                  <div className={style.iconContainer}>
                    <div className={style.icons} onClick={()=>handleBagClick(item)}>
                      <FaShoppingBag />
                    </div>
                    <div
                      className={style.icons}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <FaTrashAlt />
                    </div>
                  </div>
                </div>
              </div>
            </div>
                   ))}
           </ShowOnLogin>
          </div>
        </div>
      </section>
    </>
  );
}

export default Favorites;
