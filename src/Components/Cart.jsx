import style from "../assets/Cart.module.css";
import { HiOutlineX } from "react-icons/hi";
import Button from "./Button";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { closeCart } from "../Redux/Slice/OpenCartSlice";
import { useEffect, useState } from "react";
import {
  addToFavoritesFirebase,
  fetchFavorites,
  removeFromFavoritesFirebase,
} from "../Redux/Slice/FavoritesSlice";
import {
  removeFromCartFirebase,
  incrementQuantityFirebase,
  decrementQuantityFirebase,
} from "../Redux/Slice/CartSlice";
import { auth } from "../Firebase/Config";
import { toast } from "react-toastify";
import Loader from "./Loader";



function Cart() {
  const { items: cartItems, totalPrice } = useSelector((state) => state.cart);
  const isOpen = useSelector((state) => state.opencart.isOpen);

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const favorites = useSelector((state) => state.favorites.items);
  // const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchFavorites());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  // if (loading) {
  //   return <p>Loading favorites...</p>; // Show a loading message while fetching
  // }

  const handleFavoriteClick = async (product) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Zəhmət olmasa daxil olun");
      return;
    }

    const isFav = favorites.some((item) => item.id === product.id);
    setLoading(true)
    try {
      if (isFav) {
        await dispatch(removeFromFavoritesFirebase(product.id));
        toast.success("Məhsul favorilərdən çıxarıldı");
      } else {
        await dispatch(addToFavoritesFirebase(product));
        toast.success("Məhsul favorilərə əlavə olundu");
      }

      // Re-fetch favorites after updating Firebase
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Xəta baş verdi, yenidən cəhd edin");
    }
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling on the page
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when closed
    }
  }, [isOpen]);


  const handleIncrement = (id) => {
    dispatch(incrementQuantityFirebase(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantityFirebase(id));
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCartFirebase(id));
  };

  return (
    <>
    {loading && <Loader />}
      {isOpen && (
        <div
          className={style.overlay}
          onClick={() => dispatch(closeCart())}
        ></div>
      )}
      <section className={style.container}>
        <div
          style={isOpen ? { width: "30em" } : { width: 0 }}
          className={`${style.sidebar} ${isOpen ? style.open : ""}`}
        >
          <div className={style.center}>
            <div className={style.head}>
              <h1 className={style.bagName}>Səbət</h1>
              <HiOutlineX
                style={{ fontSize: "30px" }}
                onClick={() => dispatch(closeCart())}
              />
            </div>
            {cartItems.map((item) => {
              const isFav = favorites.some((product) => product.id === item.id);
              return (
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
                    <h5 style={{ paddingTop: "10px" }}>{item.price} ₼</h5>
                    <div className={style.iconContainer}>
                      <div className={style.icons}>
                        <span onClick={() => handleFavoriteClick(item)}>
                          {isFav ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </span>
                      </div>
                      <div
                        className={style.icons}
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaTrashAlt />
                      </div>
                      <div className={style.quantityDiv}>
                        <button onClick={() => handleDecrement(item.id)}>
                          -
                        </button>
                        <input type="number" value={item.quantity} readOnly />
                        <button onClick={() => handleIncrement(item.id)}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
            <div className={style.total}>
              <div>
                <p>Standart çatdərəlma</p>
                <p>Pulsuz</p>
              </div>
              <div>
                <p>
                  <b>Cəmi</b>
                </p>
                <p>
                  <b>{totalPrice}AZN</b>
                </p>
              </div>
            </div>
            <div className={style.checkout}>
              <Button name="Sifatiş et" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
