"use client";

/* =========================================================
   components/Navbar.js

   TANGGUNG JAWAB:

   1. Menampilkan navigation.
   2. Menampilkan informasi user.
   3. Menangani user menu.
   4. Menangani logout.
   5. Menangani UI authorization ketika menu diklik.
   6. Menampilkan modal jika user tidak memiliki access.

   AUTHENTICATION:

   UserContext
        ↓
   authenticated
        ↓
   Navbar tampil

   AUTHORIZATION:

   UserContext
        ↓
   hasAccess()
        ↓
   Navbar
        ↓
   menu diklik
        ↓
   memiliki access?
      ↙       ↘
    YES        NO
     ↓          ↓
   Link       preventDefault()
                ↓
              modal

   CATATAN:

   Navbar TIDAK bertanggung jawab terhadap
   direct URL authorization.

   Direct URL:

   /finance/reports
          ↓
   RouteGuard
          ↓
   memiliki access.finance?
       ↙       ↘
     YES        NO
      ↓          ↓
   render       block / redirect

========================================================= */

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  ChevronDown,
  LayoutDashboard,
  UsersRound,
  WalletCards,
  ReceiptText,
  CalendarCheck2,
  Settings,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldAlert,
  LogOut,
} from "lucide-react";

import {
  useUser,
} from "@/contexts/userContext";

import "@/styles/components/navbar.css";


/* =========================================================
   NAVIGATION
========================================================= */

const navigation = [

  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    accessKey: "dashboard",
  },

  {
    label: "Master Data",
    icon: UsersRound,
    accessKey: "master_data",

    children: [

      {
        label: "Clients",
        href: "/clients",
      },

      {
        label: "Karyawan",
        href: "/master-data/karyawan",
      },

    ],
  },

  {
    label: "Payroll",
    icon: WalletCards,
    accessKey: "payroll",

    children: [

      {
        label: "Rekap Gaji",
        href: "/payroll",
      },

      {
        label: "Payroll File",
        href: "/payroll/file",
      },

    ],
  },

  {
    label: "Finance",
    icon: ReceiptText,
    accessKey: "finance",

    children: [

      {
        label: "Invoice",
        href: "/finance/invoice",
      },

      {
        label: "Monitoring Invoice",
        href: "/finance/invoice/monitoring",
      },

      {
        label: "Laporan Keuangan",
        href: "/finance/reports",
      },

    ],
  },

  {
    label: "Absensi",
    href: "/attendance",
    icon: CalendarCheck2,
    accessKey: "absensi",
  },

];


const settingsNavigation = {

  label: "Pengaturan",

  href: "/pengaturan",

  icon: Settings,

  accessKey: "pengaturan",

};


/* =========================================================
   PATH HELPERS
========================================================= */

/**
 * Mengecek apakah pathname berada pada route tertentu.
 */
function isPathActive(
  pathname,
  href
) {

  return (
    pathname === href ||
    pathname.startsWith(
      `${href}/`
    )
  );

}


/**
 * Mengecek apakah parent navigation
 * sedang aktif.
 */
function isParentActive(
  item,
  pathname
) {

  if (item.href) {

    return isPathActive(
      pathname,
      item.href
    );

  }


  return (
    item.children?.some(
      (child) =>
        isPathActive(
          pathname,
          child.href
        )
    ) || false
  );

}


/* =========================================================
   COMPONENT
========================================================= */

export default function Navbar() {

  const pathname =
    usePathname();


  /* =======================================================
     USER CONTEXT
  ======================================================= */

  /*
   * SEMUA authentication dan authorization
   * berasal dari UserContext.
   *
   * Navbar TIDAK membuat ulang logic authorization.
   *
   * UserContext adalah single source of truth.
   */
  const {
    credentials,

    authenticated,
    authStatus,
    isInitializing,

    hasAccess,

    logout,

  } = useUser();


  /* =======================================================
     USER MENU
  ======================================================= */

  const [
    isUserOpen,
    setIsUserOpen,
  ] = useState(false);


  const userMenuRef =
    useRef(null);


  /* =======================================================
     AUTHORIZATION MODAL
  ======================================================= */

  const [
    authorizationModal,
    setAuthorizationModal,
  ] = useState(null);


  /* =======================================================
     CHANGE PASSWORD
  ======================================================= */

  const [
    changePassword,
    setChangePassword,
  ] = useState(false);


  const [
    showPassword,
    setShowPassword,
  ] = useState(false);


  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);


  const [
    password,
    setPassword,
  ] = useState("");


  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");


  /* =======================================================
     CLOSE USER MENU
  ======================================================= */

  useEffect(
    () => {

      const handleClickOutside =
        (event) => {

          if (
            userMenuRef.current &&
            !userMenuRef.current.contains(
              event.target
            )
          ) {

            setIsUserOpen(false);

          }

        };


      document.addEventListener(
        "mousedown",
        handleClickOutside
      );


      return () => {

        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );

      };

    },
    []
  );


  /* =======================================================
     USER INFORMATION
  ======================================================= */

  /*
   * Semua informasi user dibaca dari
   * credentials yang diberikan UserContext.
   *
   * Saat ini Auth.gs mengirim:
   *
   * credentials.user_id
   * credentials.session_id
   * credentials.access
   *
   * Field username, id_karyawan, dan role
   * hanya akan tersedia jika Auth.gs mengirimkannya.
   */

  const userId =
    credentials?.user_id ||
    "";


  const username =
    credentials?.username ||
    "";


  const idKaryawan =
    credentials?.id_karyawan ||
    "";


  const role =
    credentials?.role ||
    "";


  const displayName =
    username ||
    credentials?.name ||
    userId ||
    "User";


  const avatarLetter =
    displayName
      .charAt(0)
      .toUpperCase() ||
    "?";


  /* =======================================================
     PASSWORD
  ======================================================= */

  const handlePasswordToggle =
    (checked) => {

      setChangePassword(
        checked
      );


      if (!checked) {

        setPassword("");

        setConfirmPassword("");

        setShowPassword(false);

        setShowConfirmPassword(false);

      }

    };


  const handlePasswordSubmit =
    (event) => {

      event.preventDefault();


      if (
        !password ||
        !confirmPassword
      ) {

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        return;

      }


      /*
       * Endpoint change password
       * dapat diimplementasikan kemudian.
       */
      console.log(
        "Update password:",
        {
          user_id: userId,
          password,
        }
      );

    };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout =
    async () => {

      setIsUserOpen(false);

      await logout();

    };


  /* =======================================================
     AUTHORIZATION MODAL
  ======================================================= */

  const showDeniedModal =
    (
      label,
      accessKey
    ) => {

      setAuthorizationModal({

        pageLabel:
          label,

        accessKey,

      });

    };


  const closeAuthorizationModal =
    () => {

      setAuthorizationModal(
        null
      );

    };


  /* =======================================================
     NAVIGATION AUTHORIZATION
========================================================= */

  const handleNavigation =
    (
      event,
      item,
      label = item.label
    ) => {

      /*
       * UserContext masih melakukan
       * restore session.
       *
       * Jangan membuat keputusan
       * authorization ketika initializing.
       */
      if (
        isInitializing ||
        authStatus ===
          "initializing"
      ) {

        event.preventDefault();

        return;

      }


      /*
       * User belum authenticated.
       *
       * RouteGuard menangani authentication.
       *
       * Navbar hanya mencegah navigasi
       * dari Navbar.
       */
      if (
        !authenticated ||
        authStatus !==
          "authenticated"
      ) {

        event.preventDefault();

        return;

      }


      /*
       * Setiap navigation yang dilindungi
       * WAJIB memiliki accessKey.
       */
      if (
        !item.accessKey
      ) {

        event.preventDefault();

        return;

      }


      /*
       * SINGLE SOURCE OF TRUTH:
       *
       * Authorization hanya diperiksa
       * melalui UserContext.hasAccess().
       */
      if (
        hasAccess(
          item.accessKey
        )
      ) {

        return;

      }


      /*
       * Tidak memiliki access.
       *
       * Jangan navigasi.
       *
       * Jangan redirect.
       *
       * Tampilkan modal.
       */
      event.preventDefault();


      showDeniedModal(
        label,
        item.accessKey
      );

    };


  /* =======================================================
     PUBLIC / UNAUTHENTICATED
  ======================================================= */

  if (
    isInitializing ||
    authStatus !==
      "authenticated" ||
    !authenticated
  ) {

    return null;

  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <>

      <header className="navbar">

        <div className="navbar-inner">


          {/* ===============================================
              BRAND
          =============================================== */}

          <Link
            href="/dashboard"
            className="navbar-brand"
            onClick={(event) =>
              handleNavigation(
                event,
                navigation[0]
              )
            }
          >

            <div className="navbar-brand-mark">
              KII
            </div>


            <div className="navbar-brand-text">

              <span>
                SIMAK
              </span>

              <strong>
                -KII
              </strong>

            </div>

          </Link>


          {/* ===============================================
              NAVIGATION
          =============================================== */}

          <nav className="navbar-menu">

            {navigation.map(
              (item) => {

                const Icon =
                  item.icon;


                const active =
                  isParentActive(
                    item,
                    pathname
                  );


                /* =========================================
                   SINGLE ROUTE
                ========================================= */

                if (
                  !item.children
                ) {

                  return (

                    <Link
                      key={
                        item.label
                      }
                      href={
                        item.href
                      }
                      className={`navbar-link ${
                        active
                          ? "active"
                          : ""
                      }`}
                      onClick={(
                        event
                      ) =>
                        handleNavigation(
                          event,
                          item
                        )
                      }
                    >

                      <Icon
                        size={16}
                        strokeWidth={1.8}
                      />

                      <span>
                        {item.label}
                      </span>

                    </Link>

                  );

                }


                /* =========================================
                   PARENT DROPDOWN
                ========================================= */

                return (

                  <div
                    key={
                      item.label
                    }
                    className={`navbar-dropdown ${
                      active
                        ? "active"
                        : ""
                    }`}
                  >

                    <button
                      type="button"
                      className="navbar-link navbar-dropdown-trigger"
                      onClick={(event) =>
                        handleNavigation(
                          event,
                          item
                        )
                      }
                    >

                      <Icon
                        size={16}
                        strokeWidth={1.8}
                      />

                      <span>
                        {item.label}
                      </span>

                      <ChevronDown
                        className="navbar-chevron"
                        size={14}
                        strokeWidth={1.8}
                      />

                    </button>


                    <div className="navbar-dropdown-menu">

                      {item.children.map(
                        (child) => {

                          const childActive =
                            isPathActive(
                              pathname,
                              child.href
                            );


                          return (

                            <Link
                              key={
                                child.label
                              }
                              href={
                                child.href
                              }
                              className={`navbar-dropdown-item ${
                                childActive
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(
                                event
                              ) =>
                                handleNavigation(
                                  event,
                                  item,
                                  child.label
                                )
                              }
                            >

                              <span className="navbar-dropdown-dot" />

                              <span>
                                {child.label}
                              </span>

                            </Link>

                          );

                        }
                      )}

                    </div>

                  </div>

                );

              }
            )}

          </nav>


          {/* ===============================================
              RIGHT SIDE
          =============================================== */}

          <div className="navbar-right">


            {/* =============================================
                USER
            ============================================= */}

            <div
              className="navbar-user-wrapper"
              ref={
                userMenuRef
              }
            >

              <button
                type="button"
                className={`navbar-user ${
                  isUserOpen
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setIsUserOpen(
                    (value) =>
                      !value
                  )
                }
              >

                <div className="navbar-user-avatar">
                  {avatarLetter}
                </div>


                <div className="navbar-user-info">

                  <strong>
                    {displayName}
                  </strong>

                  <span>
                    {role || "User"}
                  </span>

                </div>


                <ChevronDown
                  className={`navbar-user-chevron ${
                    isUserOpen
                      ? "open"
                      : ""
                  }`}
                  size={14}
                  strokeWidth={1.8}
                />

              </button>


              {/* =========================================
                  USER MENU
              ========================================= */}

              {isUserOpen && (

                <div className="navbar-user-menu">


                  {/* USER HEADER */}

                  <div className="user-menu-header">

                    <div className="user-menu-avatar">
                      {avatarLetter}
                    </div>


                    <div>

                      <strong>
                        {displayName}
                      </strong>

                      <span>
                        {role || "User"}
                      </span>

                    </div>

                  </div>


                  <div className="user-menu-divider" />


                  {/* USER INFORMATION */}

                  <div className="user-information">

                    <div className="user-field">

                      <span>
                        ID User
                      </span>

                      <strong>
                        {userId || "-"}
                      </strong>

                    </div>


                    <div className="user-field">

                      <span>
                        ID Karyawan
                      </span>

                      <strong>
                        {idKaryawan || "-"}
                      </strong>

                    </div>


                    <div className="user-field">

                      <span>
                        Username
                      </span>

                      <strong>
                        {username || "-"}
                      </strong>

                    </div>


                    <div className="user-field">

                      <span>
                        Role
                      </span>

                      <strong>
                        {role || "-"}
                      </strong>

                    </div>

                  </div>


                  <div className="user-menu-divider" />


                  {/* CHANGE PASSWORD */}

                  <div className="password-section">

                    <label className="password-toggle-row">

                      <span className="custom-checkbox">

                        <input
                          type="checkbox"
                          checked={
                            changePassword
                          }
                          onChange={(
                            event
                          ) =>
                            handlePasswordToggle(
                              event
                                .target
                                .checked
                            )
                          }
                        />

                        <span className="checkbox-box">

                          <Check
                            size={12}
                          />

                        </span>

                      </span>


                      <span className="password-toggle-label">
                        Ganti password
                      </span>

                    </label>


                    {changePassword && (

                      <form
                        className="password-form"
                        onSubmit={
                          handlePasswordSubmit
                        }
                      >

                        <div className="password-field">

                          <label>
                            Password baru
                          </label>


                          <div className="password-input">

                            <KeyRound
                              size={15}
                              strokeWidth={1.8}
                            />


                            <input
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              value={
                                password
                              }
                              onChange={(
                                event
                              ) =>
                                setPassword(
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Password baru"
                            />


                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(
                                  (value) =>
                                    !value
                                )
                              }
                            >

                              {showPassword ? (

                                <EyeOff
                                  size={15}
                                />

                              ) : (

                                <Eye
                                  size={15}
                                />

                              )}

                            </button>

                          </div>

                        </div>


                        <div className="password-field">

                          <label>
                            Konfirmasi password
                          </label>


                          <div className="password-input">

                            <KeyRound
                              size={15}
                              strokeWidth={1.8}
                            />


                            <input
                              type={
                                showConfirmPassword
                                  ? "text"
                                  : "password"
                              }
                              value={
                                confirmPassword
                              }
                              onChange={(
                                event
                              ) =>
                                setConfirmPassword(
                                  event
                                    .target
                                    .value
                                )
                              }
                              placeholder="Ulangi password"
                            />


                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(
                                  (value) =>
                                    !value
                                )
                              }
                            >

                              {showConfirmPassword ? (

                                <EyeOff
                                  size={15}
                                />

                              ) : (

                                <Eye
                                  size={15}
                                />

                              )}

                            </button>

                          </div>

                        </div>


                        {password &&
                          confirmPassword &&
                          password !==
                            confirmPassword && (

                            <div className="password-error">

                              <X
                                size={13}
                              />

                              <span>
                                Password tidak sama.
                              </span>

                            </div>

                          )}


                        <button
                          type="submit"
                          className="password-save-button"
                          disabled={
                            !password ||
                            !confirmPassword ||
                            password !==
                              confirmPassword
                          }
                        >
                          Simpan password
                        </button>

                      </form>

                    )}

                  </div>


                  <div className="user-menu-divider" />


                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="navbar-logout-button"
                    onClick={
                      handleLogout
                    }
                  >

                    <LogOut
                      size={16}
                      strokeWidth={1.8}
                    />

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </div>


            <div className="navbar-right-divider" />


            {/* =============================================
                SETTINGS
            ============================================= */}

            <div className="navbar-settings">

              <Link
                href={
                  settingsNavigation.href
                }
                className={`navbar-settings-link ${
                  isPathActive(
                    pathname,
                    settingsNavigation.href
                  )
                    ? "active"
                    : ""
                }`}
                onClick={(event) =>
                  handleNavigation(
                    event,
                    settingsNavigation
                  )
                }
              >

                <Settings
                  size={18}
                  strokeWidth={1.8}
                />

                <span>
                  Pengaturan
                </span>

              </Link>

            </div>

          </div>

        </div>

      </header>


      {/* =====================================================
          AUTHORIZATION MODAL
      ===================================================== */}

      {authorizationModal && (

        <div
          className="authorization-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="authorization-modal-title"
        >

          <div className="authorization-modal">

            <div className="authorization-modal-icon">

              <ShieldAlert
                size={28}
                strokeWidth={1.8}
              />

            </div>


            <h2
              id="authorization-modal-title"
            >
              Akses Ditolak
            </h2>


            <p>

              Anda tidak memiliki akses
              ke halaman{" "}

              <strong>
                {authorizationModal.pageLabel}
              </strong>.

            </p>


            <button
              type="button"
              className="authorization-modal-button"
              onClick={
                closeAuthorizationModal
              }
            >
              Mengerti
            </button>

          </div>

        </div>

      )}

    </>

  );

}