// Fetch 25 US users
async function getPeople() {
  const resp = await fetch("https://randomuser.me/api/?results=25&nat=us");
  if (!resp.ok) throw new Error(`HTTP Error: ${resp.status}`);
  return resp.json();
}

function toRowModel(u) {
  // Map randomuser fields -> the table fields we need
  const name = `${u.name.title} ${u.name.first} ${u.name.last}`.trim();
  const address = `${u.location.street.number} ${u.location.street.name}`;
  const city = u.location.city;
  const state = u.location.state;
  const zip = String(u.location.postcode);
  const lat = Number(u.location.coordinates.latitude);
  const lng = Number(u.location.coordinates.longitude);
  const phone = u.phone || u.cell || "";

  return { name, last: u.name.last, address, city, state, zip, lat, lng, phone };
}

function renderRows(rows) {
  const $tbody = $("#people tbody");
  $tbody.empty();

  rows.forEach(r => {
    // Title attribute shows phone as a native tooltip on hover (per assignment)
    const $tr = $(`
      <tr title="${r.phone}">
        <td>${r.name}</td>
        <td>${r.address}</td>
        <td>${r.city}</td>
        <td>${r.state}</td>
        <td class="num">${r.zip}</td>
        <td class="num">${r.lat.toFixed(4)}</td>
        <td class="num">${r.lng.toFixed(4)}</td>
      </tr>
    `);
    $tbody.append($tr);
  });
}

async function buildTable() {
  try {
    const data = await getPeople(); // raw randomuser data
    // Transform
    const rows = data.results.map(toRowModel);
    // Sort by last name (A→Z) as required
    rows.sort((a, b) => a.last.localeCompare(b.last));
    // Render
    renderRows(rows);
  } catch (err) {
    console.error("Error building table:", err);
    $("#people tbody").html(`<tr><td colspan="7">Failed to load data.</td></tr>`);
  }
}

buildTable();
