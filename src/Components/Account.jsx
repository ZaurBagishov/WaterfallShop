import clsx from 'clsx';
import styled from '../assets/Account.module.css';
import { useState, useRef, useEffect } from 'react';
import { useFormik } from "formik";
import { AccountSchema } from "../Components/AccountSchema"; 
import { LoginSchema } from "../Components/LoginSchema";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase/Config';
import Loader from "./Loader";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Account() {
  const [isActive, setIsActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const loginButtonRef = useRef(null);

  useEffect(() => {
    if (isRegistering) {
      loginButtonRef.current.click();
    }
  }, [isRegistering]);

  // Handle user registration
  const handleRegisterSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.registerPassword);
      await updateProfile(userCredential.user, { displayName: values.username });
     setIsLoading(false);

      toast.success("Qeydiyyatdan keçdiniz");
      resetForm();
      setIsRegistering(true);
    } catch (error) {
      setIsLoading(false);
      toast.error(`Xəta baş verdi: ${error.message}`);
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  // Handle user login
  const handleLoginSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      resetForm();
      navigate("/");
    } catch (error) {
      toast.error(`Xəta baş verdi: ${error.message}`);
      resetForm();
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Formik instance for registration
  const formikRegister = useFormik({
    initialValues: {
      username: '',
      email: '',
      registerPassword: '',
    },
    validationSchema: AccountSchema,
    onSubmit: handleRegisterSubmit,
  });

  // Formik instance for login
  const formikLogin = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema, // Assuming you have a separate schema for login
    onSubmit: handleLoginSubmit,
  });

  return (
    <>
      {isLoading && <Loader />}
      <div className={styled.body}>
        <div className={`${styled.container} ${isActive ? styled.active : ""}`}>
          
          {/* Login Form */}
          <div className={clsx(styled.formBox, styled.login)}>
            <form onSubmit={formikLogin.handleSubmit}>
              <h1>Daxil ol</h1>
              <div className={styled.inputBox}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formikLogin.values.email}
                  onChange={formikLogin.handleChange}
                />
                {formikLogin.errors.email && <p style={{ color: 'red' }}>{formikLogin.errors.email}</p>}
              </div>
              <div className={styled.inputBox}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Şifrə"
                  value={formikLogin.values.password}
                  onChange={formikLogin.handleChange}
                />
                {showPassword ? 
                  <FaRegEyeSlash className={styled.icon} onClick={() => setShowPassword(false)} /> :
                  <FaRegEye className={styled.icon} onClick={() => setShowPassword(true)} />}
                {formikLogin.errors.password && <p style={{ color: 'red' }}>{formikLogin.errors.password}</p>}
              </div>
              <div className={styled.forgotLink}>
                <a href="#">Şifrəni unutmusan?</a>
              </div>
              <button disabled={!(formikLogin.dirty && formikLogin.isValid)} type="submit" className={styled.btn}>
                Daxil ol
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div className={clsx(styled.formBox, styled.register)}>
            <form onSubmit={formikRegister.handleSubmit}>
              <h1>Qeydiyyat</h1>
              <div className={styled.inputBox}>
                <input
                  type="text"
                  name="username"
                  placeholder="İstifadəçi adı"
                  value={formikRegister.values.username}
                  onChange={formikRegister.handleChange}
                />
                {formikRegister.errors.username && <p style={{ color: 'red' }}>{formikRegister.errors.username}</p>}
              </div>
              <div className={styled.inputBox}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formikRegister.values.email}
                  onChange={formikRegister.handleChange}
                />
                {formikRegister.errors.email && <p style={{ color: 'red' }}>{formikRegister.errors.email}</p>}
              </div>
              <div className={styled.inputBox}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="registerPassword"
                  placeholder="Şifrə"
                  value={formikRegister.values.registerPassword}
                  onChange={formikRegister.handleChange}
                />
                {showPassword ? 
                  <FaRegEyeSlash className={styled.icon} onClick={() => setShowPassword(false)} /> :
                  <FaRegEye className={styled.icon} onClick={() => setShowPassword(true)} />}
                {formikRegister.errors.registerPassword && <p style={{ color: 'red' }}>{formikRegister.errors.registerPassword}</p>}
              </div>
              <button type="submit" className={styled.btn}>Qeydiyyatdan keç</button>
            </form>
          </div>

          {/* Toggle Box */}
          <div className={styled.toggleBox}>
            <div className={clsx(styled.togglePanel, styled.toggleLeft)}>
              <h1>Xoş Gəldiniz</h1>
              <p>Hesabınız yoxdur?</p>
              <button className={styled.btn} onClick={() => setIsActive(true)}>Qeydiyyat</button>
            </div>
            <div className={clsx(styled.togglePanel, styled.toggleRight)}>
              <h1>Təkrar xoş Gəldiniz</h1>
              <p>Əvvəl qeydiyyatdan keçmisiniz?</p>
              <button ref={loginButtonRef} className={styled.btn} onClick={() => setIsActive(false)}>Daxil ol</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
