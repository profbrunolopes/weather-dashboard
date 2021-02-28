$("#temp").knob({
  min: 0,
  max: 100,
  step: 1,
  readOnly: true,
  width: 125,
  height: 125,
});

$("#humi").knob({
  min: 0,
  max: 100,
  step: 1,
  readOnly: true,
  width: 125,
  height: 125,
});

$("#pres").knob({
  min: 0,
  max: 1300,
  step: 1,
  readOnly: true,
  width: 125,
  height: 125,
});

$("#alti").knob({
  min: 0,
  max: 1000,
  step: 1,
  readOnly: true,
  width: 125,
  height: 125,
});

$("#station-alert").hide();

$("#station1").click(function () {
  if (station != stations[0]) {
    station = stations[0];

    $("#station-alert").hide();
    $("#station-name").text(station.name);

    $("#temp").val(0).trigger("change");
    $("#humi").val(0).trigger("change");
    $("#pres").val(0).trigger("change");
    $("#alti").val(0).trigger("change");

    config.data.labels = [];
    config.data.datasets[0].data = [];
    config.data.datasets[1].data = [];
    chart.update();

    makeStationRequest();
  }
});

$("#station2").click(function () {
  if (station != stations[1]) {
    station = stations[1];

    $("#station-alert").hide();
    $("#station-name").text(station.name);

    $("#temp").val(0).trigger("change");
    $("#humi").val(0).trigger("change");
    $("#pres").val(0).trigger("change");
    $("#alti").val(0).trigger("change");

    config.data.labels = [];
    config.data.datasets[0].data = [];
    config.data.datasets[1].data = [];
    chart.update();

    makeStationRequest();
  }
});

var config = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperatrure",
        backgroundColor: "rgb(255, 0, 0)",
        borderColor: "rgb(255, 0, 0)",
        data: [],
        fill: false,
      },
      {
        label: "Humidity",
        backgroundColor: "rgb(0, 255, 0)",
        borderColor: "rgb(0, 255, 0)",
        data: [],
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: "Temperature",
    },
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Hour",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
          },
        },
      ],
    },
  },
};

let fakeData = [
  { alti: 0, date: "", humi: 0, id: 0, pres: 0, station: 1, temp: 0 },
];

let stations = [
  { id: 1, name: "Bruno's Room" },
  { id: 2, name: "Backyard" },
];
let station = stations[0];

let temp = document.getElementById("temp");
let humi = document.getElementById("humi");
let pres = document.getElementById("pres");
let alti = document.getElementById("alti");

let ctx = document.getElementById("temp-canvas").getContext("2d");
chart = new Chart(ctx, config);

function addData(temp, humi, label) {
  if (config.data.datasets.length > 0) {
    config.data.labels.push(label);

    config.data.datasets.forEach(function (dataset) {
      if (dataset.label == "Temperatrure") {
        dataset.data.push(temp);
      } else if (dataset.label == "Humidity") {
        dataset.data.push(humi);
      }
    });

    if (config.data.labels.length > 20) {
      config.data.labels.shift();
      config.data.datasets.forEach(function (dataset) {
        if (dataset.label == "Temperatrure") {
          dataset.data.shift();
        } else if (dataset.label == "Humidity") {
          dataset.data.shift();
        }
      });
    }

    chart.update();
  }
}

function updateUI(data) {
  hour = data[0].date.substring(11, 19);

  tempValue = data[0].temp.toFixed(2);
  humiValue = data[0].humi.toFixed(2);
  presValue = data[0].pres.toFixed(2);
  altiValue = data[0].alti.toFixed(2);

  temp.value = tempValue;
  humi.value = humiValue;
  pres.value = presValue;
  alti.value = altiValue;

  $("#temp").val(tempValue).trigger("change");
  $("#humi").val(humiValue).trigger("change");
  $("#pres").val(presValue).trigger("change");
  $("#alti").val(altiValue).trigger("change");

  if (tempValue != 0 && humiValue != 0) {
    addData(tempValue, humiValue, hour);
  }
}

function makeStationRequest(){
  let url = `https://6c061cbec2d9.ngrok.io/weather?station=${station.id}&limit=1`;
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      updateUI(data);
      $("#station-alert").hide();
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
      $("#station-alert").text(`Probably the Station ${station.name} is offline! Try another weather station!`).show();
    });
}

setInterval(makeStationRequest, 5000);

updateUI(fakeData);
makeStationRequest();
