import { useDispatch, useSelector } from "react-redux";
import styles from "../assets/ProductDetail.module.css";
import { useEffect, useState } from "react";
import { closeProductDetail } from "../Redux/Slice/OpenCartSlice";
import { HiOutlineX } from "react-icons/hi";
import { auth } from "../Firebase/Config";
import { toast } from "react-toastify";
import {
  addToFavoritesFirebase,
  fetchFavorites,
  removeFromFavoritesFirebase,
} from "../Redux/Slice/FavoritesSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Button from "./Button";
import { addToCartFirebase } from "../Redux/Slice/CartSlice";
import Loader from "./Loader";


function ProductDetail() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isProductDetailOpen = useSelector(
    (state) => state.opencart.isProductDetailOpen
  );

  // position x və position y i reduxdan çağırırıq
  const position = useSelector((state) => state.opencart.position);

  const selectedProduct = useSelector(
    (state) => state.productdetail.selectedProduct
  );
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchFavorites());
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
    document.body.style.overflow = isProductDetailOpen ? "hidden" : "auto";
  }, [isProductDetailOpen]);

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
      {isProductDetailOpen && (
        <div
          className={styles.overlay}
          onClick={() => dispatch(closeProductDetail())}
        ></div>
      )}
      <div className={styles.container}>
        <div
          className={`${styles.productDetail} ${
            isProductDetailOpen ? styles.open : ""
          }`}
          style={{
            // productdetail divinə position vermək üçün reduxdan çağırdığımız position ları burda istifadə edirikş
            // positionların özlərini isə product komponentlərində müəyyən edirik
            top: `${position.y}px`,
            left: `${position.x}px`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <HiOutlineX
            className={styles.iconX}
            style={{ fontSize: "30px" }}
            onClick={() => dispatch(closeProductDetail())}
          />

          <div className={styles.center}>
            {selectedProduct && (
              <div key={selectedProduct.id} className={styles.cart}>
                <div className={styles.cartCenter}>
                  <div className={styles.cartImgDiv}>
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      // width="120px"
                      // height="160px"
                    />
                  </div>
                  <div className={styles.cartItemsDiv}>
                    <h2>{selectedProduct.name}</h2>
                    <h5 style={{ paddingTop: "10px" }}>
                      {selectedProduct.price} ₼
                    </h5>
                    <p style={{ paddingTop: "10px" }}>
                      {selectedProduct.description}
                    </p>
                    <span
                      className={styles.heart}
                      onClick={() => handleFavoriteClick(selectedProduct)}
                    >
                      {favorites.some(
                        (product) => product.id === selectedProduct.id
                      ) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                    </span>
                    <div className={styles.button}>
                      <Button
                        width={"15em"}
                        height={"40px"}
                        name={"Səbətə əlavə et"}
                        onClick={()=>handleBagClick(selectedProduct)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>{" "}
      {/* This closing div was missing */}
    </>
  );
}

export default ProductDetail;
