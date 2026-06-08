"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

import "@/style/upload-invoice.css";

interface InvoiceFile {
  file_id: string;
  invoice_id: string;

  file_name: string;

  nama_client: string;
  kategori_tk: string;

  periode_invoice: string;
  tahun: string;

  folder_bulan: string;
  folder_tipe: string;

  url: string;
}

export default function UploadPage() {
  const [loading, setLoading] =
    useState(false);

  const [selectedClient, setSelectedClient] =
    useState("");

  const [files, setFiles] =
    useState<InvoiceFile[]>([]);

  const loadFiles = async () => {
    try {
      const response =
        await api.get<
          InvoiceFile[]
        >(
          "invoice.files.list"
        );

      if (
        response.success
      ) {
        setFiles(
          response.data || []
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const syncDrive = async () => {
    try {
      setLoading(true);

      const response =
        await api.get(
          "invoice.files.sync"
        );

      if (
        response.success
      ) {
        await loadFiles();
      }
    } catch (error) {
      console.error(error);

      alert(
        "Gagal sync invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceId =
    (
      fileId: string,
      value: string
    ) => {

      setFiles(
        (prev) =>
          prev.map(
            (item) =>
              item.file_id ===
              fileId
                ? {
                    ...item,
                    invoice_id:
                      value,
                  }
                : item
          )
      );

    };

  const clientOptions =
    useMemo(() => {

      const clients =
        files
          .map(
            (
              item
            ) =>
              item.nama_client
          )
          .filter(
            Boolean
          );

      return [
        ...new Set(
          clients
        ),
      ].sort();

    }, [files]);

  const filteredFiles =
    useMemo(() => {

      if (
        !selectedClient
      ) {
        return files;
      }

      return files.filter(
        (
          item
        ) =>
          item.nama_client ===
          selectedClient
      );

    }, [
      files,
      selectedClient,
    ]);

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="uploadPage">

      <div className="uploadPage__header">

        <h1>
          Invoice Mapping
        </h1>

        <button
          className="uploadPage__syncButton"
          onClick={
            syncDrive
          }
          disabled={
            loading
          }
        >
          {loading
            ? "Scanning..."
            : "Sync Drive"}
        </button>

      </div>

      <div className="uploadPage__filterBar">

        <label>
          Filter Client
        </label>

        <select
          value={
            selectedClient
          }
          onChange={(
            e
          ) =>
            setSelectedClient(
              e.target
                .value
            )
          }
        >
          <option value="">
            Semua Client
          </option>

          {clientOptions.map(
            (
              client
            ) => (
              <option
                key={
                  client
                }
                value={
                  client
                }
              >
                {client}
              </option>
            )
          )}
        </select>

        <span className="uploadPage__count">
          Total :
          {" "}
          {
            filteredFiles.length
          }
        </span>

      </div>

      <div className="uploadPage__tableWrapper">

        <table className="uploadPage__table">

          <thead>

            <tr>

              <th>
                File Name
              </th>

              <th>
                Client
              </th>

              <th>
                Kategori
              </th>

              <th>
                Periode
              </th>

              <th>
                Tahun
              </th>

              <th>
                Folder Bulan
              </th>

              <th>
                Invoice ID
              </th>

              <th>
                PDF
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredFiles.map(
              (
                item
              ) => (
                <tr
                  key={
                    item.file_id
                  }
                >

                  <td>
                    {
                      item.file_name
                    }
                  </td>

                  <td>
                    {
                      item.nama_client
                    }
                  </td>

                  <td>
                    {
                      item.kategori_tk
                    }
                  </td>

                  <td>
                    {
                      item.periode_invoice
                    }
                  </td>

                  <td>
                    {
                      item.tahun
                    }
                  </td>

                  <td>
                    {
                      item.folder_bulan
                    }
                  </td>

                  <td>

                    <input
                      type="text"
                      className="uploadPage__invoiceInput"
                      value={
                        item.invoice_id ||
                        ""
                      }
                      onChange={(
                        e
                      ) =>
                        updateInvoiceId(
                          item.file_id,
                          e.target
                            .value
                        )
                      }
                    />

                  </td>

                  <td>

                    <a
                      href={
                        item.url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="uploadPage__link"
                    >
                      Open
                    </a>

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}