import styles from "../assets/Categories.module.css";
import datas from "../Datas/Products.json";
import { NavLink } from "react-router-dom";

function Categories() {
  return (
    <>
      <section className={styles.categories}>
        {datas.categories.map((category) => (
          <NavLink
            key={category.id}
            to={category.path}
            className={({ isActive }) =>
              `${styles.label} ${isActive ? styles.active : ""}`
            }
          >
            <span className={styles.link}>{category.name}</span>
          </NavLink>
        ))}
      </section>
    </>
  );
}

export default Categories;
