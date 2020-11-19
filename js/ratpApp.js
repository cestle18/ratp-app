const lineSelectElement = document.querySelector("#line-select");
const stationSelectElement = document.querySelector("#station-select");

//function that return metro lines
async function fetchMetroLines() {
  let response = await fetch(
    "https://api-ratp.pierre-grimaud.fr/v4/lines/metros"
  );
  response = await response.json();

  // renaming and extraction of metro lines only
  const metroLines = response.result.metros;
  return metroLines;
}

// creating the query selector
function fillLinesSelectOptions(metroLines) {
  console.log(lineSelectElement);
  lineSelectElement.innerHTML =
    '<option value="">--Please choose a metro line--</option>';
  metroLines.forEach(function (line) {
    // name and number display
    console.log(line.code, line.name);
    console.log("<option value='" + line.code + "'>" + line.name + "</option>");
    lineSelectElement.innerHTML +=
      "<option value='" + line.code + "'>" + line.name + "</option>";
  });
}

// select
async function main() {
  const metroLines = await fetchMetroLines();
  console.log(metroLines);
  fillLinesSelectOptions(metroLines);
}

main();

// now we will fetch metro lines stations

async function fetchMetroLineStations(metroLineCode) {
  let response = await fetch(
    "https://api-ratp.pierre-grimaud.fr/v4/stations/metros/" + metroLineCode
  );
  response = await response.json();
  const metroLineStations = response.result.stations;
  return metroLineStations;
}

async function fetchAndUpdateMetroLineStations(metroLineCode) {
  const metroLineStations = await fetchMetroLineStations(metroLineCode);
  console.log(metroLineStations);
  fillStationsSelectOptions(metroLineStations);
}

lineSelectElement.addEventListener("change", function (e) {
  const metroLineCode = lineSelectElement.value;
  fetchAndUpdateMetroLineStations(metroLineCode);
});

//étape 5
// creating the query selector
function fillStationsSelectOptions(metroLineStations) {
  stationSelectElement.innerHTML = "";
  metroLineStations.forEach(function (metroLineStation) {
    // station name display
    console.log(metroLineStation);
    console.log(
      "<option value='" +
        metroLineStation.slug +
        "'>" +
        metroLineStation.name +
        "</option>"
    );
    stationSelectElement.innerHTML +=
      "<option value='" +
      metroLineStation.slug +
      "'>" +
      metroLineStation.name +
      "</option>";
  });
}
