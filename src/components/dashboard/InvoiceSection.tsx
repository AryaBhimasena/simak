export default function InvoiceSection() {

  return (

    <div className="simakDash__sectionCard">

      <div className="simakDash__sectionHeader">

        <div className="simakDash__sectionHeading">

          <p className="simakDash__sectionLabel">
            Finance Overview
          </p>

          <h3 className="simakDash__sectionTitle">
            Total Tagihan Invoice Belum Dibayar
          </h3>

        </div>

        <div className="simakDash__sectionBadge">
          2 Invoice
        </div>

      </div>

      <div className="simakDash__sectionToolbar">

        <div className="simakDash__filters">

          <input
            type="text"
            placeholder="Search invoice..."
            className="simakDash__input"
          />

          <select className="simakDash__input">

            <option>
              Filter by Client
            </option>

            <option>
              PT Alpha
            </option>

            <option>
              PT Beta
            </option>

          </select>

        </div>

      </div>

      <div className="simakDash__tableWrapper">

        <table className="simakDash__table">

          <thead>

            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>No Invoice</th>
              <th>Client</th>
              <th>Nominal</th>
              <th>Periode</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>1</td>
              <td>02 Jan 2026</td>
              <td>INV-001</td>
              <td>PT Alpha</td>

              <td className="simakDash__amount">
                Rp 120.000.000
              </td>

              <td>Januari</td>
            </tr>

            <tr>
              <td>2</td>
              <td>05 Jan 2026</td>
              <td>INV-002</td>
              <td>PT Beta</td>

              <td className="simakDash__amount">
                Rp 85.000.000
              </td>

              <td>Januari</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  );

}