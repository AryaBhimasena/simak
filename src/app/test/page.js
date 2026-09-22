"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [imgStatus, setImgStatus] = useState("Menunggu...");
  const [iframeStatus, setIframeStatus] = useState("Menunggu...");
  const [objectStatus, setObjectStatus] = useState("Menunggu...");
  const [embedStatus, setEmbedStatus] = useState("Menunggu...");
  const [fetchStatus, setFetchStatus] = useState("Menunggu...");

  const [blobUrl, setBlobUrl] = useState("");

  /* =========================================================
     LOAD KARYAWAN
  ========================================================= */

  useEffect(() => {
    loadKaryawan();
  }, []);

async function loadKaryawan() {
  try {
    setLoading(true);
    setApiError("");

    const userId = localStorage.getItem("auth_user_id");
    const sessionId = localStorage.getItem("auth_session_id");

    if (!userId || !sessionId) {
      throw new Error(
        "Session login tidak ditemukan di localStorage."
      );
    }

    console.log("AUTH USER ID:", userId);
    console.log("AUTH SESSION ID:", sessionId);

    const response = await api.get({
      action: "getKaryawan",
      user_id: userId,
      session_id: sessionId,
    });

    console.log("RESPONSE getKaryawan:", response);

    const data = response.data || [];

    setEmployees(data);

    const riska = data.find(
      (item) =>
        String(item.nama_karyawan || "")
          .trim()
          .toLowerCase() === "riska"
    );

    if (riska) {
      setSelectedEmployee(riska);
    } else if (data.length > 0) {
      setSelectedEmployee(data[0]);
    }
  } catch (error) {
    console.error("GET KARYAWAN ERROR:", error);

    setApiError(
      error.message || "Gagal mengambil data karyawan."
    );
  } finally {
    setLoading(false);
  }
}

  /* =========================================================
     SELECT EMPLOYEE
  ========================================================= */

  function handleSelectEmployee(event) {
    const id = event.target.value;

    const employee = employees.find(
      (item) => String(item.id_karyawan) === String(id)
    );

    setSelectedEmployee(employee || null);

    resetTestStatus();
  }

  /* =========================================================
     RESET STATUS
  ========================================================= */

  function resetTestStatus() {
    setImgStatus("Menunggu...");
    setIframeStatus("Menunggu...");
    setObjectStatus("Menunggu...");
    setEmbedStatus("Menunggu...");
    setFetchStatus("Menunggu...");

    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl("");
    }
  }

  /* =========================================================
     FOTO URL
  ========================================================= */

  const fotoUrl = selectedEmployee?.foto_url || "";

  /* =========================================================
     TEST FETCH
  ========================================================= */

  async function testFetch() {
    if (!fotoUrl) {
      setFetchStatus("ERROR: foto_url kosong.");
      return;
    }

    setFetchStatus("Mencoba fetch...");

    try {
      const response = await fetch(fotoUrl);

      console.log("FETCH FOTO RESPONSE:", response);

      if (!response.ok) {
        setFetchStatus(
          `ERROR HTTP ${response.status} ${response.statusText}`
        );
        return;
      }

      const blob = await response.blob();

      console.log("FOTO BLOB:", blob);

      const objectUrl = URL.createObjectURL(blob);

      setBlobUrl(objectUrl);

      setFetchStatus(
        `BERHASIL — ${blob.type || "unknown"} — ${blob.size} bytes`
      );
    } catch (error) {
      console.error("FETCH FOTO ERROR:", error);

      setFetchStatus(
        `ERROR: ${error.message || "Fetch gagal."}`
      );
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.container}>
          <h1>Test Foto Google Drive</h1>
          <p>Mengambil data karyawan...</p>
        </div>
      </main>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Test Foto Google Drive
            </h1>

            <p style={styles.subtitle}>
              Pengujian berbagai metode browser untuk
              menampilkan <code>foto_url</code>.
            </p>
          </div>

          <button
            type="button"
            onClick={loadKaryawan}
            style={styles.button}
          >
            Refresh Data
          </button>
        </header>

        {/* =====================================================
            API ERROR
        ===================================================== */}

        {apiError && (
          <section style={styles.errorBox}>
            <strong>ERROR API</strong>

            <pre style={styles.errorText}>
              {apiError}
            </pre>

            <p style={styles.smallText}>
              Endpoint yang dipanggil:
            </p>

            <code>
              api.get(&#123; action: "getKaryawan" &#125;)
            </code>
          </section>
        )}

        {/* =====================================================
            EMPLOYEE SELECT
        ===================================================== */}

        <section style={styles.card}>
          <h2 style={styles.sectionTitle}>
            1. Data Karyawan dari API
          </h2>

          {employees.length === 0 ? (
            <p>Tidak ada data karyawan.</p>
          ) : (
            <>
              <label style={styles.label}>
                Pilih Karyawan
              </label>

              <select
                value={selectedEmployee?.id_karyawan || ""}
                onChange={handleSelectEmployee}
                style={styles.select}
              >
                {employees.map((employee) => (
                  <option
                    key={employee.id_karyawan}
                    value={employee.id_karyawan}
                  >
                    {employee.nama_karyawan} —{" "}
                    {employee.id_karyawan}
                  </option>
                ))}
              </select>
            </>
          )}
        </section>

        {/* =====================================================
            PAYLOAD
        ===================================================== */}

        {selectedEmployee && (
          <>
            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                2. Payload Foto
              </h2>

              <div style={styles.infoGrid}>
                <div>
                  <span style={styles.infoLabel}>
                    Nama
                  </span>

                  <strong>
                    {selectedEmployee.nama_karyawan}
                  </strong>
                </div>

                <div>
                  <span style={styles.infoLabel}>
                    ID Karyawan
                  </span>

                  <strong>
                    {selectedEmployee.id_karyawan}
                  </strong>
                </div>
              </div>

              <div style={styles.urlBox}>
                <span style={styles.infoLabel}>
                  foto_url
                </span>

                <code style={styles.url}>
                  {fotoUrl || "(kosong)"}
                </code>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (fotoUrl) {
                    window.open(
                      fotoUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }
                }}
                disabled={!fotoUrl}
                style={styles.button}
              >
                Buka URL Langsung
              </button>
            </section>

            {/* =================================================
                IMG
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                3. Method: &lt;img&gt;
              </h2>

              <Status text={imgStatus} />

              <div style={styles.preview}>
                {fotoUrl ? (
                  <img
                    src={fotoUrl}
                    alt={selectedEmployee.nama_karyawan}
                    style={styles.media}
                    onLoad={() => {
                      console.log("IMG BERHASIL LOAD");

                      setImgStatus(
                        "BERHASIL — <img> berhasil memuat foto."
                      );
                    }}
                    onError={(event) => {
                      console.error(
                        "IMG ERROR:",
                        event
                      );

                      setImgStatus(
                        "ERROR — <img> gagal memuat foto. Lihat Console / Network."
                      );
                    }}
                  />
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* =================================================
                IFRAME
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                4. Method: &lt;iframe&gt;
              </h2>

              <Status text={iframeStatus} />

              <div style={styles.preview}>
                {fotoUrl ? (
                  <iframe
                    src={fotoUrl}
                    title="Foto Karyawan"
                    style={styles.media}
                    onLoad={() => {
                      console.log(
                        "IFRAME LOAD EVENT"
                      );

                      setIframeStatus(
                        "LOAD EVENT — iframe selesai memuat URL."
                      );
                    }}
                    onError={(event) => {
                      console.error(
                        "IFRAME ERROR:",
                        event
                      );

                      setIframeStatus(
                        "ERROR — iframe gagal memuat URL."
                      );
                    }}
                  />
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* =================================================
                OBJECT
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                5. Method: &lt;object&gt;
              </h2>

              <Status text={objectStatus} />

              <div style={styles.preview}>
                {fotoUrl ? (
                  <object
                    data={fotoUrl}
                    type="image/jpeg"
                    style={styles.media}
                    onLoad={() => {
                      console.log(
                        "OBJECT LOAD EVENT"
                      );

                      setObjectStatus(
                        "LOAD EVENT — object selesai memuat."
                      );
                    }}
                    onError={(event) => {
                      console.error(
                        "OBJECT ERROR:",
                        event
                      );

                      setObjectStatus(
                        "ERROR — object gagal memuat URL."
                      );
                    }}
                  >
                    <p>
                      Browser tidak dapat menampilkan
                      resource ini.
                    </p>
                  </object>
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* =================================================
                EMBED
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                6. Method: &lt;embed&gt;
              </h2>

              <Status text={embedStatus} />

              <div style={styles.preview}>
                {fotoUrl ? (
                  <embed
                    src={fotoUrl}
                    type="image/jpeg"
                    style={styles.media}
                    onLoad={() => {
                      console.log(
                        "EMBED LOAD EVENT"
                      );

                      setEmbedStatus(
                        "LOAD EVENT — embed selesai memuat."
                      );
                    }}
                    onError={(event) => {
                      console.error(
                        "EMBED ERROR:",
                        event
                      );

                      setEmbedStatus(
                        "ERROR — embed gagal memuat URL."
                      );
                    }}
                  />
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* =================================================
                FETCH
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                7. Method: fetch → Blob
              </h2>

              <Status text={fetchStatus} />

              <button
                type="button"
                onClick={testFetch}
                disabled={!fotoUrl}
                style={styles.button}
              >
                Test Fetch
              </button>

              <div style={styles.preview}>
                {blobUrl ? (
                  <img
                    src={blobUrl}
                    alt="Foto hasil Blob"
                    style={styles.media}
                  />
                ) : (
                  <Empty />
                )}
              </div>
            </section>

            {/* =================================================
                RAW DATA
            ================================================= */}

            <section style={styles.card}>
              <h2 style={styles.sectionTitle}>
                8. Raw Data Karyawan
              </h2>

              <pre style={styles.json}>
                {JSON.stringify(
                  selectedEmployee,
                  null,
                  2
                )}
              </pre>
            </section>
			
			<section style={styles.card}>
  <h2 style={styles.sectionTitle}>
    8. Google Drive UserContent Direct
  </h2>

  <div style={styles.preview}>
    <img
      src={`https://drive.usercontent.google.com/download?id=${encodeURIComponent(
        selectedEmployee.foto_url.match(/[?&]id=([^&]+)/)?.[1] || ""
      )}&export=view`}
      alt="Foto Google Drive"
      style={styles.media}
      onLoad={() => {
        console.log(
          "USERCONTENT IMG BERHASIL LOAD"
        );
      }}
      onError={(event) => {
        console.error(
          "USERCONTENT IMG ERROR:",
          event
        );
      }}
    />
  </div>
</section>
          </>
        )}
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function Status({ text }) {
  return (
    <div style={styles.status}>
      <strong>Status:</strong>{" "}
      <span>{text}</span>
    </div>
  );
}

function Empty() {
  return (
    <div style={styles.empty}>
      Tidak ada preview
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    padding: "40px 20px",
    color: "#172033",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "30px",
  },

  subtitle: {
    marginTop: "8px",
    color: "#667085",
  },

  card: {
    background: "#fff",
    border: "1px solid #e4e7ec",
    borderRadius: "14px",
    padding: "24px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(16,24,40,.04)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "19px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 600,
  },

  select: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #d0d5dd",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "14px",
  },

  button: {
    border: "none",
    borderRadius: "8px",
    padding: "10px 15px",
    background: "#3157d5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },

  infoLabel: {
    display: "block",
    fontSize: "12px",
    color: "#667085",
    marginBottom: "5px",
  },

  urlBox: {
    padding: "15px",
    background: "#f8fafc",
    border: "1px solid #e4e7ec",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  url: {
    display: "block",
    wordBreak: "break-all",
    lineHeight: 1.6,
  },

  preview: {
    width: "100%",
    height: "400px",
    marginTop: "15px",
    background: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  media: {
    width: "100%",
    height: "100%",
    border: "none",
    objectFit: "contain",
  },

  empty: {
    color: "#98a2b3",
  },

  status: {
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#f8fafc",
    border: "1px solid #e4e7ec",
    fontSize: "13px",
  },

  errorBox: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
  },

  errorText: {
    whiteSpace: "pre-wrap",
    color: "#b42318",
  },

  smallText: {
    fontSize: "13px",
    color: "#667085",
    marginBottom: "5px",
  },

  json: {
    margin: 0,
    padding: "16px",
    background: "#101828",
    color: "#e4e7ec",
    borderRadius: "8px",
    overflow: "auto",
    fontSize: "12px",
    lineHeight: 1.5,
  },
};