import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import styles from "../assets/Products.module.css";
import { toast } from 'react-toastify';
import { addToCartFirebase } from "../Redux/Slice/CartSlice";
import { useState } from "react";
import Loader from "./Loader";
import { auth } from "../Firebase/Config";



function DoubleButton(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const cartItems = useSelector((state) => state.cart.items);

  // const handleClick = (pro) => {
  //   const isProductInCart = cartItems.some(item => item.id === pro.id);
  //   if (isProductInCart) {
  //     toast.error("Məhsul artıq səbətdədir");
  //   } else {
  //     dispatch(addToCartFirebase(pro));
  //     toast.success("Səbətə əlavə olundu");
  //   }
  // };

  const cartItems = useSelector((state) => state.cart.items);

  const handleClick = (pro) => {

    const user = auth.currentUser;
  
    if (!user) {
      toast.error("Zəhmət olmasa daxil olun");
      return;
    }


    const isProductInCart = cartItems.some((item) => item.id === pro.id);
    setLoading(true);
  
    if (isProductInCart) {
      toast.error("Məhsul artıq səbətdədir"); // Product is already in the cart
      setLoading(false); // Ensure loading is stopped in case product is already in cart
    } else {
      dispatch(addToCartFirebase(pro))
        .unwrap()
        .then(() => {
          toast.success("Səbətə əlavə olundu"); // Added to cart
        })
        .catch((error) => {
          toast.error("Xəta baş verdi: " + error); // Error occurred
        })
        .finally(() => {
          setLoading(false); // Ensure loading is always stopped
        });
    }
  };
  
  return (
      <>
      {loading && <Loader />}
    <div>
      <button className={styles.btnProducts} onClick={() => handleClick(props.products)}>
        <span>Səbətə əlavə et</span>
      </button>
    </div>
    </>
  );
}

DoubleButton.propTypes = {
  products: PropTypes.array.isRequired,
};

export default DoubleButton;
