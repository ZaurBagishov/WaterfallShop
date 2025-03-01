import WaterfallPhoto from "../assets/IMG_5814.png"
import style from '../assets/Footer.module.css'
import clsx from "clsx";


function Footer() {
  return (
    <>
      <footer className={style.footer}>
        <div className={style.footCenter}>
          <div className={style.footFirst}>
            <div className={style.footFirstParts}>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize27)} href="#">
                  Mağaza
                </a>
              </div>
              <div className={clsx(style.partsItems, style.marginTop25)}>
                <a className={clsx(style.decoration, style.fontSize16)} href="#">
                  Haqqımızda
                </a>
              </div>
            </div>
            <div className={style.footFirstParts}>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize27)} href="#">
                  Müştərilər
                </a>
              </div>
              <div className={clsx(style.partsItems, style.marginTop25)}>
                <a className={clsx(style.decoration, style.fontSize16)} href="#">
                  Ödəniş və Çatdırılma
                </a>
              </div>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize16)} href="#">
                  Qaytarılma siyasəti
                </a>
              </div>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize16)} href="#">
                  Müştəri xidmətləri
                </a>
              </div>
            </div>
            <div className={style.footFirstParts}>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize27)} href="#">
                  Hesab
                </a>
              </div>
              <div className={clsx(style.partsItems, style.marginTop25)}>
                <a className={clsx(style.decoration, style.fontSize16)} href="./login.html">
                  Qeydiyyat
                </a>
              </div>
              <div className={style.partsItems}>
                <a className={clsx(style.decoration, style.fontSize16)} href="#">
                  Sifarişlərim
                </a>
              </div>
            </div>
          </div>
          <div className={style.footSecond}>
            <div className={style.footAddress}>
              <p  className={style.fontSize16}>Online mağaza</p>
              <p  className={style.fontSize16}>+994 50 12 34 567</p>
            </div>
            <div className={style.footAddressTwo}>
              <p  className={style.fontSize16}>Bizə yazın</p>
              <p  className={style.fontSize16}>bagisovaselale456@gmail.com</p>
            </div>
          </div>
          <div className={style.posAbs}>
            <img width="350" height="150" src={WaterfallPhoto} alt="..." />
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
