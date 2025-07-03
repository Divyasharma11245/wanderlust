document.addEventListener("DOMContentLoaded", function () {
  const mapDiv = document.getElementById("map");

  if (typeof coordinates !== "undefined" && coordinates.length === 2) {
    const map = L.map("map").setView([coordinates[1], coordinates[0]], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

L.marker([coordinates[1], coordinates[0]])
  .addTo(map)
  .bindPopup(`<b>${listingTitle}</b><br>${listingLocation}`)
  .openPopup();

  } else if (mapDiv) {
    mapDiv.innerHTML =
      "<p style='padding: 1rem;'>Map not available for this listing.</p>";
  }
});

