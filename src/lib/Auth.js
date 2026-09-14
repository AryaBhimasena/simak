import { api } from "./api";


/* =========================================================
   STORAGE
   ---------------------------------------------------------
   Auth.js hanya bertanggung jawab terhadap persistence
   session di browser.

   React state tetap menjadi tanggung jawab UserContext.
========================================================= */

const STORAGE = {
  USER_ID: "auth_user_id",
  SESSION_ID: "auth_session_id",
};


/* =========================================================
   BROWSER CHECK
========================================================= */

const isBrowser = () =>
  typeof window !== "undefined";


/* =========================================================
   SAVE SESSION
========================================================= */

const saveSession = (
  userId,
  sessionId
) => {

  if (!isBrowser()) {
    return;
  }


  if (!userId || !sessionId) {
    return;
  }


  localStorage.setItem(
    STORAGE.USER_ID,
    String(userId)
  );

  localStorage.setItem(
    STORAGE.SESSION_ID,
    String(sessionId)
  );

};


/* =========================================================
   GET STORED SESSION
   ---------------------------------------------------------
   Mengambil session yang tersimpan di browser.

   Hanya mengembalikan identifier session.
   Access TIDAK disimpan di localStorage.

   Access harus selalu berasal dari server.
========================================================= */

export const getStoredCredentials = () => {

  if (!isBrowser()) {
    return null;
  }


  const user_id =
    localStorage.getItem(
      STORAGE.USER_ID
    );


  const session_id =
    localStorage.getItem(
      STORAGE.SESSION_ID
    );


  if (
    !user_id ||
    !session_id
  ) {

    return null;

  }


  return {
    user_id,
    session_id,
  };

};


/* =========================================================
   CLEAR SESSION
========================================================= */

export const clearCredentials = () => {

  if (!isBrowser()) {
    return;
  }


  localStorage.removeItem(
    STORAGE.USER_ID
  );


  localStorage.removeItem(
    STORAGE.SESSION_ID
  );

};


/* =========================================================
   LOGIN
   ---------------------------------------------------------
   Auth.js:

   username/password
        ↓
   API
        ↓
   backend
        ↓
   credentials

   Tidak mengubah React state.
========================================================= */

export async function login(
  username,
  password
) {

  try {

    const result =
      await api.post({

        action: "login",

        username,
        password,

      });


    /*
     * Pastikan response login
     * benar-benar menyediakan credentials.
     */

    if (
      !result?.success ||
      !result?.credentials
    ) {

      return {

        success:
          false,

        message:
          result?.message ||
          "Login gagal.",

      };

    }


    const {
      user_id,
      session_id,
    } =
      result.credentials;


    /*
     * Session identifier disimpan
     * untuk kebutuhan restore ketika
     * browser melakukan refresh.
     */

    saveSession(
      user_id,
      session_id
    );


    /*
     * Kembalikan response apa adanya
     * kepada UserContext.
     *
     * UserContext yang akan memasukkan
     * credentials tersebut ke React state.
     */

    return result;

  } catch (error) {

    return {

      success:
        false,

      message:
        error?.message ||
        "Terjadi kesalahan saat login.",

    };

  }

}


/* =========================================================
   REFRESH / RESTORE SESSION
   ---------------------------------------------------------
   Digunakan UserContext ketika aplikasi pertama kali
   dijalankan atau browser di-refresh.

   Flow:

   localStorage
        ↓
   user_id + session_id
        ↓
   server
        ↓
   credentials terbaru
        ↓
   UserContext
========================================================= */

export async function refresh() {

  const session =
    getStoredCredentials();


  /*
   * Tidak ada session lokal.
   *
   * Ini bukan error.
   *
   * Artinya browser memang belum mempunyai
   * session yang dapat direstore.
   */

  if (!session) {

    return {

      success:
        false,

      authenticated:
        false,

      credentials:
        null,

      message:
        "Session tidak ditemukan.",

    };

  }


  try {

    const result =
      await api.get({

        action:
          "getCredentials",

        ...session,

      });


    /*
     * Server harus mengembalikan
     * credentials yang valid.
     */

    if (
      !result?.success ||
      !result?.credentials
    ) {

      clearCredentials();


      return {

        success:
          false,

        authenticated:
          false,

        credentials:
          null,

        message:
          result?.message ||
          "Session tidak valid.",

      };

    }


    /*
     * Pastikan session yang digunakan
     * tetap tersimpan.

     * Access TIDAK disimpan ke localStorage.
     * Access berasal dari response server.
     */

    saveSession(
      session.user_id,
      session.session_id
    );


    /*
     * UserContext akan mengambil
     * credentials dari response ini.
     */

    return {

      ...result,

      authenticated:
        true,

    };

  } catch (error) {

    /*
     * Jika server menyatakan session
     * tidak dapat divalidasi, hapus
     * session lokal.
     */

    clearCredentials();


    return {

      success:
        false,

      authenticated:
        false,

      credentials:
        null,

      message:
        error?.message ||
        "Session tidak dapat divalidasi.",

    };

  }

}


/* =========================================================
   LOGOUT
   ---------------------------------------------------------
   Logout tidak bergantung pada React.

   Auth.js:

   session lokal
        ↓
   hapus localStorage
        ↓
   request logout ke server
========================================================= */

export async function logout() {

  const session =
    getStoredCredentials();


  /*
   * Hapus local session SEGERA.

   * Dengan demikian apabila request
   * logout gagal, browser tetap tidak
   * menyimpan session lama.
   */

  clearCredentials();


  /*
   * Tidak ada session.
   *
   * Dari sisi browser, logout sudah selesai.
   */

  if (!session) {

    return {

      success:
        true,

      authenticated:
        false,

    };

  }


  try {

    const result =
      await api.post({

        action:
          "logout",

        ...session,

      });


    return {

      ...result,

      authenticated:
        false,

    };

  } catch (error) {

    /*
     * Session lokal sudah dihapus.
     *
     * Jadi kegagalan request logout
     * tidak boleh membuat user tetap
     * dianggap mempunyai session lokal.
     */

    return {

      success:
        true,

      authenticated:
        false,

      message:
        error?.message ||
        "Session lokal telah dihapus.",

    };

  }

}


/* =========================================================
   CHECK AUTH
   ---------------------------------------------------------
   Alias untuk compatibility.

   UserContext dapat menggunakan:

      Auth.refresh()

   atau:

      Auth.checkAuth()
========================================================= */

export const checkAuth =
  refresh;


/* =========================================================
   STORAGE KEYS
========================================================= */

export const AUTH_KEYS =
  STORAGE;