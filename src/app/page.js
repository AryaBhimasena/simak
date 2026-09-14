"use client";

/* =========================================================
   app/page.js

   LOGIN PAGE
   ---------------------------------------------------------
   Tanggung jawab:

   - Membersihkan localStorage ketika login page dibuka
   - Menampilkan UI login
   - Menangani input username
   - Menangani input password
   - Melakukan validasi input dasar
   - Memanggil UserContext.login()
   - Menampilkan loading
   - Menampilkan error login

   TIDAK menangani:

   - authentication logic
   - credentials
   - access
   - authorization
   - route permission
   - first accessible route
   - redirect
   - session restore

   FLOW:

   page.js
      ↓
   clear localStorage
      ↓
   UserContext.login()
      ↓
   Auth.login()
      ↓
   Backend
      ↓
   credentials
      ↓
   UserContext state
      ↓
   RouteGuard
      ↓
   route yang sesuai
========================================================= */

import {
  useEffect,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  ArrowRight,
} from "lucide-react";

import {
  useUser,
} from "@/contexts/userContext";

import "@/styles/pages/login.css";


/* =========================================================
   INPUT SECURITY
========================================================= */

/*
 * Username hanya menerima:
 *
 * A-Z
 * a-z
 * 0-9
 * titik
 * underscore
 * hyphen
 *
 * Contoh valid:
 *
 * admin
 * admin01
 * admin.user
 * admin_user
 * admin-user
 *
 * Karakter HTML / script seperti:
 *
 * <
 * >
 * '
 * "
 * `
 * /
 * =
 *
 * tidak diperlukan untuk username
 * sehingga ditolak.
 */
const USERNAME_PATTERN =
  /^[A-Za-z0-9._-]+$/;


/*
 * Password tidak disanitasi.
 *
 * Jangan melakukan:
 *
 * password.replace(...)
 *
 * karena dapat mengubah password sebenarnya.
 *
 * Contoh:
 *
 * Password asli:
 * abc<123
 *
 * Jika "<" dihapus:
 *
 * abc123
 *
 * maka password yang dikirim
 * bukan lagi password asli.
 *
 * Untuk defense-in-depth pada sisi client,
 * kita reject delimiter HTML utama:
 *
 * <
 * >
 *
 * Backend tetap wajib melakukan
 * validasi dan keamanan input.
 */
const PASSWORD_FORBIDDEN_PATTERN =
  /[<>]/;


/**
 * Validasi username.
 */
function isValidUsername(
  value
) {

  return (
    value.length > 0 &&
    USERNAME_PATTERN.test(
      value
    )
  );

}


/**
 * Validasi password.
 */
function isValidPassword(
  value
) {

  return (
    value.length > 0 &&
    !PASSWORD_FORBIDDEN_PATTERN.test(
      value
    )
  );

}


/* =========================================================
   LOGIN PAGE
========================================================= */

export default function LoginPage() {


  /* =======================================================
     CLEAR LOCAL STORAGE
     -------------------------------------------------------
     Login page selalu dianggap sebagai titik awal
     authentication.

     Ketika "/" dibuka:

         /
         ↓
     clear localStorage
         ↓
     login form

     Tidak ada credential lama yang boleh digunakan
     dari localStorage.
  ======================================================= */

  useEffect(() => {

    /*
     * Pastikan hanya berjalan di browser.
     *
     * useEffect sendiri hanya berjalan
     * setelah component mounted di client.
     */
    if (
      typeof window === "undefined"
    ) {

      return;

    }


    /*
     * Requirement:
     *
     * bersihkan localStorage ketika
     * login page pertama kali diakses.
     */
    localStorage.clear();

  }, []);


  /* =======================================================
     USER CONTEXT
     -------------------------------------------------------
     page.js hanya mengetahui method login().
  ======================================================= */

  const {
    login,
  } = useUser();


  /* =======================================================
     FORM STATE
  ======================================================= */

  const [
    username,
    setUsername,
  ] = useState("");


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    isLoading,
    setIsLoading,
  ] = useState(false);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /* =======================================================
     USERNAME CHANGE
  ======================================================= */

  const handleUsernameChange =
    (event) => {

      const value =
        event.target.value;


      /*
       * Username tidak langsung
       * menerima karakter yang tidak
       * termasuk allowlist.
       *
       * Contoh:
       *
       * admin<script>
       *
       * akan ditolak.
       *
       * Kita TIDAK melakukan HTML escaping
       * karena value ini akan dikirim sebagai
       * data biasa ke backend.
       */
      if (
        value &&
        !USERNAME_PATTERN.test(
          value
        )
      ) {

        setErrorMessage(
          "Username hanya boleh mengandung huruf, angka, titik, underscore, dan tanda hubung."
        );

        return;

      }


      setErrorMessage("");

      setUsername(value);

    };


  /* =======================================================
     PASSWORD CHANGE
  ======================================================= */

  const handlePasswordChange =
    (event) => {

      const value =
        event.target.value;


      /*
       * Password tidak disanitasi.
       *
       * Jika ditemukan delimiter HTML
       * yang ditolak, input tidak diterima.
       */
      if (
        PASSWORD_FORBIDDEN_PATTERN.test(
          value
        )
      ) {

        setErrorMessage(
          "Password mengandung karakter yang tidak diperbolehkan."
        );

        return;

      }


      setErrorMessage("");

      setPassword(value);

    };


  /* =======================================================
     LOGIN SUBMIT
     -------------------------------------------------------
     page.js hanya:

        username
        password
           ↓
        validasi
           ↓
        login()
           ↓
        tampilkan hasil

     Tidak melakukan redirect.
  ======================================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (isLoading) {

        return;

      }


      setErrorMessage("");


      /* ===================================================
         VALIDASI USERNAME
      =================================================== */

      const normalizedUsername =
        username.trim();


      if (
        !isValidUsername(
          normalizedUsername
        )
      ) {

        setErrorMessage(
          "Username tidak valid."
        );

        return;

      }


      /* ===================================================
         VALIDASI PASSWORD
      =================================================== */

      if (
        !isValidPassword(
          password
        )
      ) {

        setErrorMessage(
          "Password tidak valid."
        );

        return;

      }


      setIsLoading(true);


      try {

        const result =
          await login(
            normalizedUsername,
            password
          );


        /*
         * UserContext.login()
         * mengembalikan hasil login.
         *
         * Jika gagal, tampilkan pesan.
         *
         * Jika berhasil:
         *
         * UserContext
         *      ↓
         * authenticated
         *      ↓
         * RouteGuard
         *      ↓
         * navigation
         */

        if (
          !result ||
          !result.success
        ) {

          setErrorMessage(
            result?.message ||
            "Username atau password salah."
          );

        }

      } catch (error) {

        console.error(
          "Login error:",
          error
        );


        setErrorMessage(
          error?.message ||
          "Terjadi kesalahan saat menghubungkan ke server."
        );

      } finally {

        setIsLoading(false);

      }

    };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <main className="login-page">

      <div className="login-container">


        {/* =================================================
            BRANDING
        ================================================= */}

        <section className="login-brand">

          <div className="brand-content">

            <div className="brand-mark">
              KII
            </div>


            <div className="brand-title">

              <span>
                SIMAK
              </span>

              <strong>
                -KII
              </strong>

            </div>


            <p className="brand-description">
              Sistem Informasi Management dan Administrasi Kantor
            </p>


            <div className="brand-divider" />


            <p className="brand-company">
              Kreasi Inovasi Indonesia
            </p>


            <p className="brand-tagline">
              Mengelola administrasi kantor dengan lebih sederhana,
              terstruktur, dan efisien.
            </p>

          </div>


          <div className="brand-decoration">

            <span />
            <span />
            <span />

          </div>

        </section>


        {/* =================================================
            LOGIN PANEL
        ================================================= */}

        <section className="login-panel">

          <div className="login-form-wrapper">


            {/* =================================================
                MOBILE BRAND
            ================================================= */}

            <div className="mobile-brand">

              <div className="mobile-brand-mark">
                KII
              </div>


              <div>

                <div className="mobile-brand-title">
                  SIMAK<span>-KII</span>
                </div>


                <p>
                  Sistem Informasi Management dan Administrasi Kantor
                </p>

              </div>

            </div>


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="login-header">

              <p className="login-eyebrow">
                SELAMAT DATANG
              </p>


              <h1>
                Masuk ke SIMAK-KII
              </h1>


              <p>
                Gunakan akun Anda untuk mengakses sistem administrasi kantor.
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              className="login-form"
            >


              {/* =================================================
                  USERNAME
              ================================================= */}

              <div className="form-group">

                <label htmlFor="username">
                  Username
                </label>


                <div className="input-wrapper">

                  <UserRound
                    size={19}
                    strokeWidth={1.8}
                  />


                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={username}
                    onChange={
                      handleUsernameChange
                    }
                    autoComplete="username"
                    disabled={isLoading}
                    maxLength={100}
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="form-group">

                <div className="form-label-row">

                  <label htmlFor="password">
                    Password
                  </label>


                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      console.log(
                        "Forgot password"
                      )
                    }
                    disabled={isLoading}
                  >
                    Lupa password?
                  </button>

                </div>


                <div className="input-wrapper">

                  <LockKeyhole
                    size={19}
                    strokeWidth={1.8}
                  />


                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Masukkan password"
                    value={password}
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="current-password"
                    disabled={isLoading}
                    maxLength={256}
                    required
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={isLoading}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                  >

                    {showPassword ? (

                      <EyeOff
                        size={19}
                        strokeWidth={1.8}
                      />

                    ) : (

                      <Eye
                        size={19}
                        strokeWidth={1.8}
                      />

                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  LOGIN ERROR
              ================================================= */}

              {errorMessage && (

                <div
                  className="login-error"
                  role="alert"
                >

                  {errorMessage}

                </div>

              )}


              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >

                <span>

                  {isLoading
                    ? "Memproses..."
                    : "Masuk"}

                </span>


                {!isLoading && (

                  <ArrowRight
                    size={19}
                    strokeWidth={2}
                  />

                )}

              </button>

            </form>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="login-footer">

              <span>
                SIMAK-KII
              </span>


              <span className="footer-dot">
                •
              </span>


              <span>
                Kreasi Inovasi Indonesia
              </span>

            </div>

          </div>

        </section>

      </div>

    </main>

  );

}