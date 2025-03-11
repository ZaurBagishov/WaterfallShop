import datas from "../Datas/Products.json";
import styles from "../assets/Products.module.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import DoubleButton from "./DoubleButton";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../Firebase/Config"; // Ensure Firebase auth is imported
import { toast } from "react-toastify";
import {
  addToFavoritesFirebase,
  removeFromFavoritesFirebase,
  fetchFavorites
} from "../Redux/Slice/FavoritesSlice";
import { useEffect, useState } from "react";
import { fetchCart } from "../Redux/Slice/CartSlice";
import { openProductDetail } from "../Redux/Slice/OpenCartSlice";
import { setSelectedProduct } from "../Redux/Slice/ProductDetailSlice";
import Loader from "./Loader";



function Accessories() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      
      setLoading(true);
      await dispatch(fetchFavorites());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);
  
  useEffect(() => {
    const fetchCartData = async () => {
      
      setLoading(true);
      await dispatch(fetchCart());
      setLoading(false);
    };

    fetchCartData();
  }, [dispatch]);
  
  console.log("Favorites State:", favorites);
  const filteredProducts = datas.products.filter(
    (product) => product.categoryId === 3
  );

  
  const handleFavoriteClick = async (product) => {
    const user = auth.currentUser;
  
    if (!user) {
      toast.error("Zəhmət olmasa daxil olun");
      return;
    }
  
    const isFav = favorites.some((item) => item.id === product.id);
    console.log("Before Click, Is Favorite:", isFav); // Debugging log
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
      setLoading(false);
    }
  };
  
  const productDetailHandle = (event, product) => {
    // calculates the horizontal center of the viewport. 
    // window.innerWidth returns the width of the viewport in pixels. 
    // Dividing this value by 2 gives the centerX coordinate, which represents the midpoint on the X-axis.
    //  This ensures that any element positioned at centerX will be horizontally centered within the viewport.

    const centerX = window.innerWidth / 2; 

    //  calculates the vertical center of the viewport, taking into account the current scroll position. 
    // window.innerHeight returns the height of the viewport in pixels. Dividing this value by 2 gives the midpoint on the Y-axis. 
    // However, to account for any vertical scrolling, window.scrollY is added to this value. window.scrollY returns the number of pixels that the document has already been scrolled vertically. 
    // By adding this value, the centerY coordinate ensures that the element is centered vertically within the visible portion of the viewport, even if the user has scrolled down the page.

    const centerY = window.innerHeight / 2 + window.scrollY; 
// onları burda işlədirik
    dispatch(openProductDetail({ x: centerX, y: centerY }));
    dispatch(setSelectedProduct(product));
  };

  return (
    <>
      {loading && <Loader />}
    <div className={styles.products}>
      {filteredProducts.map((product) => {
        const isFav = favorites.some((item) => item.id === product.id);

        return (
          <div className={styles.productsDiv} key={product.id}>
            <img
              className={styles.image}
              width="480"
              height="500"
              src={product.image}
              alt={product.name}
             onClick={(e) => productDetailHandle(e, product)}
            />
            <DoubleButton products={product} />

            <span onClick={() => handleFavoriteClick(product)}>
              {isFav ? (
                <FaHeart className={styles.heart} />
              ) : (
                <FaRegHeart className={styles.heart} />
              )}
            </span>

            <h5 className={styles.h5Name}>{product.name}</h5>
            <h5 className={styles.h5Price}>{product.price} ₼</h5>
          </div>
        );
      })}
    </div>
    </>
  );
}

export default Accessories;
