import { useDispatch, useSelector } from "react-redux";
import styles from "../assets/Search.module.css";
import { closeSearch } from "../Redux/Slice/OpenCartSlice";
import { useEffect, useMemo, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { FaHeart, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import {
  addToFavoritesFirebase,
  fetchFavorites,
  removeFromFavoritesFirebase,
} from "../Redux/Slice/FavoritesSlice";
import { auth } from "../Firebase/Config";
import { toast } from "react-toastify";
import rawData from "../Datas/Products.json";
import { addToCartFirebase } from "../Redux/Slice/CartSlice";
import Loader from "./Loader";



const initialData =
  Array.isArray(rawData?.products) && rawData.products.length > 0
    ? rawData.products
    : [];

function Search() {
  const [data, setData] = useState([]); // Store data in state
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const isSearchOpen = useSelector((state) => state.opencart.isSearchOpen);

  useEffect(() => {
    console.log("useEffect running"); // Debugging log
    // Populate rawData with products from Products.json
    setData(initialData);
  }, []);

  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchFavorites());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

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
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling on the page
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when closed
    }
  }, [isSearchOpen]);

  const filteredItems = useMemo(() => {
    console.log("Filtering...");
    if (filter.trim() === "") {
        return [];
    }
    return data.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const handleOverlayClick = () => {
    dispatch(closeSearch()); // Close the search overlay
    setFilter(""); // Clear the search input

};
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
      {isSearchOpen && (
        <div
          className={styles.overlay}
          onClick={handleOverlayClick}
        ></div>
      )}

      <div
        className={`${styles.input} ${isSearchOpen ? styles.openInput : ""}`}
      >
        <input
          type="text"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <IoSearch className={styles.icon} />
      </div>
      

      <div className={styles.container}>
        <div
          className={`${styles.searchResults} ${
            isSearchOpen ? styles.open : ""
          }`}
        >
          <div className={styles.center}>
            {filteredItems.map((item) => {
              const isFav = favorites.some((product) => product.id === item.id);
              return (
                <div key={item.id} className={styles.cart}>
                  <div className={styles.cartCenter}>
                    <div className={styles.cartImgDiv}>
                      <img
                        src={item.image}
                        alt={item.name}
                        width="120px"
                        height="160px"
                      />
                    </div>
                    <div className={styles.cartItemsDiv}>
                      <span>{item.name}</span>
                      <h5 style={{ paddingTop: "10px" }}>{item.price} ₼</h5>
                      <div className={styles.iconContainer}>
                        <div className={styles.icons}>
                          <span onClick={() => handleFavoriteClick(item)} style={{cursor: "pointer", padding: "10px"}}>
                            {isFav ? <FaHeart /> : <FaRegHeart />}
                          </span>
                        </div>
                    <div className={styles.icons} onClick={()=>handleBagClick(item)}>
                      <FaShoppingBag />
                    </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Search;
