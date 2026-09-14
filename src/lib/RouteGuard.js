"use client";

/* =========================================================
   lib/RouteGuard.js

   TANGGUNG JAWAB:

   1. Melindungi protected route dari user yang belum login.
   2. Menunggu UserContext selesai restore session.
   3. Memeriksa authorization berdasarkan UserContext.access.
   4. Mencegah direct URL ke halaman yang tidak memiliki access.
   5. Mempertahankan pathname ketika refresh jika user memiliki access.
   6. Mengarahkan user ke firstAccessibleRoute jika access ditolak.
   7. Mengarahkan user yang berhasil login dari "/" ke
      firstAccessibleRoute.
   8. Menentukan apakah Navbar ditampilkan.
   9. Tidak mengelola authentication state.
   10. Tidak menghitung first accessible route.
   11. Tidak melakukan restore session.

   PUBLIC ROUTE:

        "/"          → Login route khusus
        "/register"  → Public route biasa

   PERILAKU:

        PUBLIC ROUTE
             │
             ├── "/" 
             │     │
             │     ├── belum login
             │     │      ↓
             │     │   render LoginPage
             │     │
             │     └── sudah login
             │            ↓
             │     firstAccessibleRoute
             │
             └── "/register"
                   │
                   ├── belum login
                   │      ↓
                   │   render RegisterPage
                   │
                   └── sudah login
                          ↓
                       render RegisterPage

        PROTECTED ROUTE
             │
             ├── belum login
             │      ↓
             │      "/"
             │
             └── sudah login
                    │
                    ├── punya permission
                    │      ↓
                    │   render page
                    │
                    └── tidak punya permission
                           ↓
                    firstAccessibleRoute
========================================================= */

import {
  useEffect,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  useUser,
} from "@/contexts/userContext";

import Navbar from "@/components/Navbar";


/* =========================================================
   CONFIGURATION
========================================================= */

/*
 * =========================================================
 * PUBLIC ROUTES
 * =========================================================
 *
 * Route yang dapat dibuka tanpa authentication.
 *
 * "/"         = Login
 * "/register" = Registrasi karyawan baru
 *
 * Public route menggunakan EXACT MATCH.
 *
 * Contoh:
 *
 * "/register"      → public
 * "/register/foo"  → BUKAN public
 *
 * Jika suatu saat membutuhkan child public route,
 * tambahkan route tersebut secara eksplisit atau ubah
 * helper isPublicRoute().
 */
const PUBLIC_ROUTES = [
  "/",
  "/register",
];


/*
 * =========================================================
 * LOGIN ROUTE
 * =========================================================
 *
 * "/" merupakan public route khusus yang berfungsi
 * sebagai halaman login.
 *
 * HANYA route ini yang mempunyai perilaku:
 *
 * authenticated
 *      ↓
 * firstAccessibleRoute
 *
 * Public route lain seperti "/register" tidak mengikuti
 * perilaku ini.
 */
const LOGIN_ROUTE = "/";


/*
 * =========================================================
 * ROUTE PERMISSIONS
 * =========================================================
 *
 * Mapping route terhadap permission.
 *
 * Parent permission berlaku terhadap
 * seluruh child route.
 *
 * Contoh:
 *
 * /finance
 * /finance/invoice
 * /finance/reports
 *
 * semuanya membutuhkan:
 *
 * access.finance === true
 */
const ROUTE_PERMISSIONS = {

  "/dashboard":
    "dashboard",

  "/master-data":
    "master_data",

  "/payroll":
    "payroll",

  "/finance":
    "finance",

  "/absensi":
    "absensi",

  "/pengaturan":
    "pengaturan",

};


/* =========================================================
   PATH HELPERS
========================================================= */

/*
 * Normalisasi pathname.
 *
 * Contoh:
 *
 * "/"                 → "/"
 * "/finance/"         → "/finance"
 * "/finance/report/"  → "/finance/report"
 */
function normalizePathname(
  pathname
) {

  if (!pathname) {

    return "/";

  }


  if (
    pathname.length > 1
  ) {

    return pathname.replace(
      /\/+$/,
      ""
    );

  }


  return pathname;

}


/*
 * =========================================================
 * IS PUBLIC ROUTE
 * =========================================================
 *
 * Public route menggunakan EXACT MATCH.
 *
 * Contoh:
 *
 * PUBLIC_ROUTES:
 *
 * "/"
 * "/register"
 *
 *
 * Hasil:
 *
 * "/"           → true
 * "/register"   → true
 * "/dashboard"  → false
 *
 *
 * "/register/test"
 * → false
 *
 * Ini disengaja agar public route tidak secara
 * tidak sengaja membuka seluruh subtree.
 */
function isPublicRoute(
  pathname
) {

  const normalizedPath =
    normalizePathname(
      pathname
    );


  return PUBLIC_ROUTES.some(
    (route) =>
      normalizedPath ===
      normalizePathname(
        route
      )
  );

}


/*
 * =========================================================
 * IS LOGIN ROUTE
 * =========================================================
 *
 * Public route dan login route adalah dua konsep berbeda.
 *
 * Public:
 *
 * "/" 
 * "/register"
 *
 *
 * Login route:
 *
 * "/"
 *
 *
 * Hanya "/" yang mendapatkan perlakuan khusus
 * setelah authenticated.
 */
function isLoginRoute(
  pathname
) {

  const normalizedPath =
    normalizePathname(
      pathname
    );


  return (
    normalizedPath ===
    normalizePathname(
      LOGIN_ROUTE
    )
  );

}


/* =========================================================
   AUTHORIZATION HELPERS
========================================================= */

/*
 * Mencari permission yang dibutuhkan
 * oleh pathname.
 *
 * Parent route berlaku terhadap
 * seluruh child route.
 *
 * Contoh:
 *
 * /finance
 * /finance/invoice
 * /finance/invoice/monitoring
 *
 * semuanya membutuhkan:
 *
 * finance
 */
function getRequiredPermission(
  pathname
) {

  const normalizedPath =
    normalizePathname(
      pathname
    );


  const matchedRoutes =
    Object.keys(
      ROUTE_PERMISSIONS
    ).filter(
      (route) => {

        const normalizedRoute =
          normalizePathname(
            route
          );


        /*
         * Exact route.
         */
        if (
          normalizedPath ===
          normalizedRoute
        ) {

          return true;

        }


        /*
         * Child route.
         *
         * Contoh:
         *
         * /finance/report
         *
         * cocok dengan:
         *
         * /finance
         *
         * tetapi:
         *
         * /finance-old
         *
         * tidak cocok.
         */
        return normalizedPath.startsWith(
          normalizedRoute + "/"
        );

      }
    );


  /*
   * Route tidak memiliki
   * permission khusus.
   */
  if (
    matchedRoutes.length === 0
  ) {

    return null;

  }


  /*
   * Jika ada beberapa parent route,
   * gunakan route paling spesifik.
   */
  matchedRoutes.sort(
    (a, b) =>
      b.length - a.length
  );


  const matchedRoute =
    matchedRoutes[0];


  return (
    ROUTE_PERMISSIONS[
      matchedRoute
    ] || null
  );

}


/*
 * Mengecek apakah user mempunyai
 * permission terhadap route.
 *
 * Route yang tidak mempunyai mapping
 * permission dianggap boleh selama
 * user sudah authenticated.
 */
function hasPermission(
  access,
  permission
) {

  /*
   * Tidak ada permission khusus.
   *
   * Authentication sudah diperiksa
   * oleh RouteGuard.
   */
  if (!permission) {

    return true;

  }


  /*
   * Access belum tersedia.
   */
  if (!access) {

    return false;

  }


  return (
    access[permission] === true
  );

}


/* =========================================================
   ROUTE GUARD
========================================================= */

export default function RouteGuard({
  children,
}) {

  const router =
    useRouter();


  const pathname =
    usePathname();


  /* =======================================================
     USER CONTEXT

     UserContext adalah sumber kebenaran:

     - authentication
     - access
     - firstAccessibleRoute

     RouteGuard TIDAK menghitung
     first accessible route.
  ======================================================= */

  const {
    access,
    authenticated,
    authStatus,
    isInitializing,
    firstAccessibleRoute,
  } = useUser();


  /* =======================================================
     PATH
  ======================================================= */

  const normalizedPath =
    normalizePathname(
      pathname
    );


  /* =======================================================
     PUBLIC ROUTE
  ======================================================= */

  const isPublic =
    isPublicRoute(
      normalizedPath
    );


  /*
   * Hanya "/" yang merupakan login route khusus.
   *
   * "/register" bukan login route.
   */
  const isLogin =
    isLoginRoute(
      normalizedPath
    );


  /* =======================================================
     REQUIRED PERMISSION
  ======================================================= */

  const requiredPermission =
    getRequiredPermission(
      normalizedPath
    );


  /* =======================================================
     CURRENT ROUTE ACCESS
  ======================================================= */

  const hasAccess =
    hasPermission(
      access,
      requiredPermission
    );


  /* =======================================================
     ROUTE PROTECTION
  ======================================================= */

  useEffect(() => {

    /* -----------------------------------------------------
       STEP 1
       -----------------------------------------------------

       UserContext masih melakukan
       restore session.

       Jangan mengambil keputusan
       authentication maupun authorization.
    ----------------------------------------------------- */

    if (
      isInitializing
    ) {

      return;

    }


    /* -----------------------------------------------------
       STEP 2
       -----------------------------------------------------

       PUBLIC ROUTE
       -----------------------------------------------------

       Semua route yang masuk PUBLIC_ROUTES
       tidak membutuhkan authentication.

       Tetapi "/" mempunyai perlakuan khusus
       karena "/" adalah LOGIN_ROUTE.
    ----------------------------------------------------- */

    if (
      isPublic
    ) {


      /* ===================================================
         PUBLIC LOGIN ROUTE
         =================================================== */

      if (
        isLogin
      ) {

        /*
         * Belum authenticated.
         *
         * "/" memang merupakan halaman login.
         *
         * Tidak perlu redirect.
         */
        if (
          !authenticated ||
          authStatus !==
            "authenticated"
        ) {

          return;

        }


        /*
         * User sudah authenticated.
         *
         * "/" tidak lagi menjadi halaman
         * yang valid untuk dipertahankan.
         *
         * Arahkan ke firstAccessibleRoute.
         */
        if (
          firstAccessibleRoute &&
          firstAccessibleRoute !==
            normalizedPath
        ) {

          router.replace(
            firstAccessibleRoute
          );

          return;

        }


        /*
         * User authenticated tetapi
         * tidak mempunyai access terhadap
         * satu pun protected route.
         *
         * Tidak ada tujuan redirect.
         *
         * Tetap berada di "/".
         *
         * Session TIDAK dihapus.
         */
        return;

      }


      /* ===================================================
         PUBLIC ROUTE BIASA
         =================================================== */

      /*
       * Contoh:
       *
       * /register
       *
       * Route ini public.
       *
       * Tidak peduli user:
       *
       * - belum login
       * - sudah login
       *
       * Tidak melakukan redirect.
       */
      return;

    }


    /* -----------------------------------------------------
       STEP 3
       -----------------------------------------------------

       PROTECTED ROUTE

       User belum authenticated.

       Redirect:

       protected route
            ↓
           "/"
    ----------------------------------------------------- */

    if (
      !authenticated ||
      authStatus !==
        "authenticated"
    ) {

      router.replace(
        LOGIN_ROUTE
      );

      return;

    }


    /* -----------------------------------------------------
       STEP 4
       -----------------------------------------------------

       AUTHORIZATION

       User sudah authenticated.

       Sekarang cek apakah user mempunyai
       permission terhadap pathname.
    ----------------------------------------------------- */

    if (
      !hasAccess
    ) {

      /*
       * User authenticated tetapi
       * tidak mempunyai permission
       * terhadap route saat ini.
       *
       * Gunakan firstAccessibleRoute
       * dari UserContext.
       */
      if (
        firstAccessibleRoute &&
        firstAccessibleRoute !==
          normalizedPath
      ) {

        router.replace(
          firstAccessibleRoute
        );

        return;

      }


      /*
       * Tidak ada route yang dapat
       * diakses user.
       *
       * Fallback ke login route.
       *
       * Session TIDAK dihapus.
       */
      if (
        !firstAccessibleRoute
      ) {

        router.replace(
          LOGIN_ROUTE
        );

        return;

      }

    }


    /* -----------------------------------------------------
       STEP 5

       User authenticated DAN mempunyai
       permission terhadap pathname.

       Tidak melakukan redirect.

       URL dipertahankan.
    ----------------------------------------------------- */

  }, [
    isInitializing,
    isPublic,
    isLogin,
    authenticated,
    authStatus,
    hasAccess,
    firstAccessibleRoute,
    normalizedPath,
    router,
  ]);


  /* =======================================================
     RENDER PROTECTION
  ======================================================= */

  /*
   * -------------------------------------------------------
   * STEP 1
   *
   * Session masih di-restore.
   *
   * Jangan render halaman.
   * -------------------------------------------------------
   */

  if (
    isInitializing
  ) {

    return (
      <RouteGuardLoading />
    );

  }


  /*
   * -------------------------------------------------------
   * STEP 2
   *
   * PUBLIC ROUTE
   * -------------------------------------------------------
   *
   * Public route tidak membutuhkan authentication.
   *
   * Tetapi "/" adalah login route khusus.
   */

  if (
    isPublic
  ) {


    /* ===================================================
       LOGIN ROUTE "/"
       =================================================== */

    if (
      isLogin
    ) {

      /*
       * Belum login:
       *
       * render LoginPage.
       */
      if (
        !authenticated ||
        authStatus !==
          "authenticated"
      ) {

        return children;

      }


      /*
       * Sudah login:
       *
       * jangan render LoginPage.
       *
       * useEffect akan melakukan redirect
       * ke firstAccessibleRoute.
       *
       * Ini mencegah flash LoginPage setelah
       * login berhasil.
       */
      return (
        <RouteGuardLoading />
      );

    }


    /* ===================================================
       PUBLIC ROUTE BIASA
       =================================================== */

    /*
     * Contoh:
     *
     * /register
     *
     * Selalu render children.
     *
     * Tidak menggunakan Navbar.
     *
     * Tidak peduli authenticated atau tidak.
     */
    return children;

  }


  /*
   * -------------------------------------------------------
   * STEP 3
   *
   * Protected route tetapi user
   * belum authenticated.
   *
   * Jangan render halaman.
   *
   * useEffect akan redirect ke "/".
   * -------------------------------------------------------
   */

  if (
    !authenticated ||
    authStatus !==
      "authenticated"
  ) {

    return (
      <RouteGuardLoading />
    );

  }


  /*
   * -------------------------------------------------------
   * STEP 4
   *
   * Authenticated tetapi tidak
   * memiliki permission.
   *
   * Jangan render halaman.
   *
   * useEffect akan redirect ke:
   *
   * firstAccessibleRoute
   * -------------------------------------------------------
   */

  if (
    !hasAccess
  ) {

    return (
      <RouteGuardLoading />
    );

  }


  /*
   * -------------------------------------------------------
   * STEP 5
   *
   * User authenticated DAN mempunyai
   * permission.
   *
   * Protected application shell:
   *
   * Navbar
   *   +
   * children
   *
   * Public route tidak pernah masuk ke sini.
   * -------------------------------------------------------
   */

  return (

    <>

      <Navbar />

      <div className="app-content">

        {children}

      </div>

    </>

  );

}


/* =========================================================
   LOADING
========================================================= */

function RouteGuardLoading() {

  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >

      Memuat aplikasi...

    </div>

  );

}


/* =========================================================
   EXPORT HELPERS
========================================================= */

export {
  normalizePathname,
  isPublicRoute,
  isLoginRoute,
  getRequiredPermission,
  hasPermission,
};