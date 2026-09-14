"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login as authLogin,
  logout as authLogout,
  refresh as authRefresh,
} from "@/lib/Auth";


/* =========================================================
   CONTEXT
========================================================= */

const UserContext = createContext(null);


/* =========================================================
   ROUTE CONFIGURATION
   ---------------------------------------------------------
   Urutan di sini menentukan prioritas
   first accessible route.

   Contoh:

   dashboard = true
   finance   = true

   maka hasil:

   /dashboard

   karena dashboard berada lebih dahulu.
========================================================= */

const FIRST_ACCESSIBLE_ROUTES = [

  {
    route: "/dashboard",
    accessKey: "dashboard",
  },

  {
    route: "/master-data",
    accessKey: "master_data",
  },

  {
    route: "/payroll",
    accessKey: "payroll",
  },

  {
    route: "/finance",
    accessKey: "finance",
  },

  {
    route: "/absensi",
    accessKey: "absensi",
  },

  {
    route: "/pengaturan",
    accessKey: "pengaturan",
  },

];


/* =========================================================
   FIRST ACCESSIBLE ROUTE
========================================================= */

/**
 * Menentukan route pertama yang dapat
 * diakses berdasarkan access user.
 *
 * Fungsi ini TIDAK melakukan redirect.
 *
 * Fungsi hanya mengembalikan:
 *
 * "/dashboard"
 * "/finance"
 * "/absensi"
 * dll.
 *
 * atau null jika user tidak memiliki
 * access ke route mana pun.
 */
function getFirstAccessibleRoute(
  access
) {

  if (
    !access
  ) {

    return null;

  }


  for (
    const item of FIRST_ACCESSIBLE_ROUTES
  ) {

    if (
      access[item.accessKey] === true
    ) {

      return item.route;

    }

  }


  return null;

}


/* =========================================================
   PROVIDER
========================================================= */

export function UserProvider({
  children,
}) {

  /* =======================================================
     AUTHENTICATION STATE
  ======================================================= */

  const [
    credentials,
    setCredentials,
  ] = useState(null);


  const [
    authStatus,
    setAuthStatus,
  ] = useState("initializing");


  /* =======================================================
     RESTORE SESSION
     -------------------------------------------------------
     Provider mount
          ↓
     Auth.js refresh()
          ↓
     backend
          ↓
     credentials
          ↓
     setCredentials()
          ↓
     access
          ↓
     firstAccessibleRoute
======================================================= */

  useEffect(() => {

    let mounted = true;


    async function restoreSession() {

      setAuthStatus(
        "initializing"
      );


      try {

        const result =
          await authRefresh();


        if (
          mounted &&
          result?.success &&
          result?.authenticated &&
          result?.credentials
        ) {

          setCredentials(
            result.credentials
          );


          setAuthStatus(
            "authenticated"
          );

        } else if (
          mounted
        ) {

          setCredentials(null);

          setAuthStatus(
            "unauthenticated"
          );

        }

      } catch (error) {

        console.error(
          "Restore session error:",
          error
        );


        if (
          mounted
        ) {

          setCredentials(null);

          setAuthStatus(
            "unauthenticated"
          );

        }

      }

    }


    restoreSession();


    return () => {

      mounted = false;

    };

  }, []);


  /* =======================================================
     LOGIN
     -------------------------------------------------------
     User
       ↓
     UserContext.login()
       ↓
     Auth.login()
       ↓
     credentials
       ↓
     setCredentials()
       ↓
     access
       ↓
     firstAccessibleRoute

     PENTING:

     login() TIDAK melakukan redirect.

     RouteGuard akan membaca:

     firstAccessibleRoute
======================================================= */

  async function login(
    username,
    password
  ) {

    try {

      const result =
        await authLogin(
          username,
          password
        );


      if (
        result?.success &&
        result?.credentials
      ) {

        setCredentials(
          result.credentials
        );


        setAuthStatus(
          "authenticated"
        );

      } else {

        setCredentials(null);

        setAuthStatus(
          "unauthenticated"
        );

      }


      return result;

    } catch (error) {

      setCredentials(null);

      setAuthStatus(
        "unauthenticated"
      );


      return {

        success: false,

        message:
          error?.message ||
          "Login gagal.",

      };

    }

  }


  /* =======================================================
     LOGOUT
     -------------------------------------------------------
     UserContext bertanggung jawab mengubah
     authentication state setelah Auth.js logout.

     firstAccessibleRoute akan otomatis menjadi
     null karena credentials menjadi null.
======================================================= */

  async function logout() {

    try {

      const result =
        await authLogout();


      setCredentials(null);

      setAuthStatus(
        "unauthenticated"
      );


      return result;

    } catch (error) {

      /*
       * Walaupun request logout gagal,
       * frontend tetap menganggap user
       * sudah logout.
       */

      setCredentials(null);

      setAuthStatus(
        "unauthenticated"
      );


      return {

        success: true,

        authenticated: false,

      };

    }

  }


  /* =======================================================
     REFRESH SESSION
======================================================= */

  async function refresh() {

    try {

      const result =
        await authRefresh();


      if (
        result?.success &&
        result?.authenticated &&
        result?.credentials
      ) {

        setCredentials(
          result.credentials
        );


        setAuthStatus(
          "authenticated"
        );

      } else {

        setCredentials(null);

        setAuthStatus(
          "unauthenticated"
        );

      }


      return result;

    } catch (error) {

      setCredentials(null);

      setAuthStatus(
        "unauthenticated"
      );


      return {

        success: false,

        authenticated: false,

        message:
          error?.message ||
          "Session tidak dapat divalidasi.",

      };

    }

  }


  /* =======================================================
     AUTHENTICATION STATUS
======================================================= */

  const authenticated =
    authStatus ===
    "authenticated";


  const isInitializing =
    authStatus ===
    "initializing";


  /* =======================================================
     ACCESS
     -------------------------------------------------------
     Access berasal langsung dari credentials.
======================================================= */

  const access =
    credentials?.access || {};


  /* =======================================================
     FIRST ACCESSIBLE ROUTE
     -------------------------------------------------------
     Derived dari access.

     Tidak menggunakan state terpisah karena
     firstAccessibleRoute selalu dapat dihitung
     dari access saat ini.

     Contoh:

     access = {
       dashboard: false,
       master_data: false,
       payroll: false,
       finance: true,
       absensi: true,
       pengaturan: false
     }

     hasil:

     firstAccessibleRoute = "/finance"
======================================================= */

  const firstAccessibleRoute =
    authenticated
      ? getFirstAccessibleRoute(
          access
        )
      : null;


  /* =======================================================
     AUTHORIZATION HELPER
======================================================= */

  function hasAccess(
    accessKey
  ) {

    if (
      !authenticated ||
      !accessKey
    ) {

      return false;

    }


    return (
      access[accessKey] === true
    );

  }


  /* =======================================================
     CONTEXT VALUE
======================================================= */

  const value = {

    /* -----------------------------------------------------
       CREDENTIALS
    ----------------------------------------------------- */

    credentials,


    /* -----------------------------------------------------
       USER ID
    ----------------------------------------------------- */

    userId:
      credentials?.user_id ||
      null,


    /* -----------------------------------------------------
       SESSION ID
    ----------------------------------------------------- */

    sessionId:
      credentials?.session_id ||
      null,


    /* -----------------------------------------------------
       ACCESS
    ----------------------------------------------------- */

    access,


    /* -----------------------------------------------------
       FIRST ACCESSIBLE ROUTE
       ----------------------------------------------------
       RouteGuard menggunakan property ini
       untuk menentukan tujuan redirect.
    ----------------------------------------------------- */

    firstAccessibleRoute,


    /* -----------------------------------------------------
       AUTH STATUS
    ----------------------------------------------------- */

    authenticated,

    authStatus,

    isInitializing,


    /* -----------------------------------------------------
       AUTHORIZATION
    ----------------------------------------------------- */

    hasAccess,


    /* -----------------------------------------------------
       AUTH ACTIONS
    ----------------------------------------------------- */

    login,

    logout,

    refresh,

  };


  /* =======================================================
     PROVIDER
======================================================= */

  return (

    <UserContext.Provider
      value={value}
    >

      {children}

    </UserContext.Provider>

  );

}


/* =========================================================
   useUser
========================================================= */

export function useUser() {

  const context =
    useContext(
      UserContext
    );


  if (!context) {

    throw new Error(
      "useUser harus digunakan di dalam UserProvider."
    );

  }


  return context;

}


/* =========================================================
   useAuth
   ---------------------------------------------------------
   Optional shortcut untuk komponen yang hanya
   membutuhkan authentication.
========================================================= */

export function useAuth() {

  const {
    credentials,
    authenticated,
    authStatus,
    isInitializing,
    login,
    logout,
    refresh,
  } = useUser();


  return {

    credentials,

    authenticated,

    authStatus,

    isInitializing,

    login,

    logout,

    refresh,

  };

}


/* =========================================================
   EXPORT UTILITY
========================================================= */

export {
  getFirstAccessibleRoute,
};