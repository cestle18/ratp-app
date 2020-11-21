// thoose const are used to display data on the page
const lineSelectElement = document.querySelector("#line-select");
const stationSelectElement = document.querySelector("#station-select");
const validateButton = document.querySelector("#go-button");
const schedulesContainer = document.querySelector("#schedules");

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
  lineSelectElement.innerHTML =
    '<option value="">--Please choose a metro line--</option>';
  metroLines.forEach(function (line) {
    // name and number display
    lineSelectElement.innerHTML +=
      "<option value='" + line.code + "'>" + line.name + "</option>";
  });
}

// select
async function main() {
  const metroLines = await fetchMetroLines();
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
  fillStationsSelectOptions(metroLineStations);
}

lineSelectElement.addEventListener("change", function (e) {
  const metroLineCode = lineSelectElement.value;
  fetchAndUpdateMetroLineStations(metroLineCode);
});

//step 5
// creating the query selector
function fillStationsSelectOptions(metroLineStations) {
  stationSelectElement.innerHTML = "";
  metroLineStations.forEach(function (metroLineStation) {
    // station name display
    stationSelectElement.innerHTML +=
      "<option value='" +
      metroLineStation.slug +
      "'>" +
      metroLineStation.name +
      "</option>";
  });
}

//step 6
// at this step we fetch schedules of metro line station
async function fetchMetroLineStationSchedules(metroLineCode, metroStationSlug) {
  let response = await fetch(
    "https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/" +
      metroLineCode +
      "/" +
      metroStationSlug +
      "/A+R"
  );
  response = await response.json();
  const metroLineStationSchedules = response.result.schedules;
  console.log(metroLineStationSchedules);
  return metroLineStationSchedules;
}

async function fetchAndUpdateMetroLineStationSchedule(
  metroLineCode,
  metroStationSlug
) {
  const metroLineStationSchedules = await fetchMetroLineStationSchedules(
    metroLineCode,
    metroStationSlug
  );
  fillMetroLineStationSchedules(metroLineStationSchedules);
}

// i choosed to add a button to display schedules at click
validateButton.addEventListener("click", function () {
  const metroLineCode = lineSelectElement.value;
  const metroStationSlug = stationSelectElement.value;
  fetchAndUpdateMetroLineStationSchedule(metroLineCode, metroStationSlug);
});

function fillMetroLineStationSchedules(metroLineStationSchedules) {
  schedulesContainer.innerHTML = "";
  metroLineStationSchedules.forEach(function (metroLineStationSchedule) {
    // schedules display
    schedulesContainer.innerHTML +=
      "<li> Next metro in : " +
      metroLineStationSchedule.message +
      " Destination : " +
      metroLineStationSchedule.destination +
      "</li>";
  });
}

// this function will refresh the schedules every 30 secondes
window.setInterval(function () {
  const metroLineCode = lineSelectElement.value;
  const metroStationSlug = stationSelectElement.value;
  fetchAndUpdateMetroLineStationSchedule(metroLineCode, metroStationSlug);
}, 30000);
