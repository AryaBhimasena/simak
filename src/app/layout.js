"use client";

/* =========================================================
   app/layout.js

   ROOT APPLICATION LAYOUT
   ---------------------------------------------------------

   TANGGUNG JAWAB:

   1. Menyediakan UserProvider ke seluruh aplikasi.
   2. Menyediakan RouteGuard ke seluruh aplikasi.
   3. Menyediakan container aplikasi.
   4. Tidak memiliki authentication logic.
   5. Tidak memiliki authorization logic.
   6. Tidak melakukan redirect.
   7. Tidak menentukan pathname.
   8. Tidak menentukan public/protected route.
   9. Tidak menentukan kapan Navbar ditampilkan.

   ARCHITECTURE:

        UserProvider
             │
             ▼
        RouteGuard
             │
             ├── public route
             │      │
             │      ▼
             │   children
             │
             └── protected route
                    │
                    ▼
                 Navbar
                    │
                    ▼
                 children

   RouteGuard bertanggung jawab terhadap
   route boundary.

   Layout hanya menyusun provider
   dan route boundary.
========================================================= */

import {
  UserProvider,
} from "@/contexts/userContext";

import RouteGuard from "@/lib/RouteGuard";

import "./globals.css";


/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}) {

  return (

    <html lang="id">

      <body>

        <UserProvider>

          <RouteGuard>

            <div className="app-content">

              {children}

            </div>

          </RouteGuard>

        </UserProvider>

      </body>

    </html>

  );

}