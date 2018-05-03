// api.openweathermap.org/data/2.5/forecast?id=634963&appid=ce26a83b9f50ebb0c052b891d8e3a087

// Run only once
if (typeof(owmfirst) == 'undefined') {
  // load Highcharts
  $.getScript("https://code.highcharts.com/highcharts.js").done(function() {
    console.log("Highcharts loaded");
    $.getScript("https://code.highcharts.com/modules/windbarb.js");
    $.getScript("https://highcharts.github.io/pattern-fill/pattern-fill-v2.js");
  });
  owmfirst = false;
  // time of previous update
  prevowmupdate = 0;
}

if (typeof(Highcharts) != 'undefined' && typeof(highcloaded) == 'undefined') {
  // When highcharts has loaded, create Meteogram once
  // Adapted from highcharts demos
  function Meteogram(data, container) {
    // Parallel arrays for the chart data, these are populated as the XML/JSON file
    // is loaded
    this.symbols = [];
    //this.precipitations = [];
    //this.precipitationsError = []; // Only for some data sets
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];

    // Initialize
    this.data = data;
    this.container = container;

    // Run
    this.parseWeatherData();
  }

  /**
   * Function to smooth the temperature line. The original data provides only whole degrees,
   * which makes the line graph look jagged. So we apply a running mean on it, but preserve
   * the unaltered value in the tooltip.
   */
  Meteogram.prototype.smoothLine = function(data) {
    var i = data.length,
      sum,
      value;

    while (i--) {
      data[i].value = value = data[i].y; // preserve value for tooltip

      // Set the smoothed value to the average of the closest points, but don't allow
      // it to differ more than 0.5 degrees from the given value
      sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
      data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
    }
  };

  /**
   * Draw the weather symbols on top of the temperature series. The symbols are
   * fetched from OpenWeatherMap.
   */
  Meteogram.prototype.drawWeatherSymbols = function(chart) {
    var meteogram = this;

    $.each(chart.series[0].data, function(i, point) {
      if (meteogram.resolution > 36e5 || i % 2 === 0) {

        chart.renderer
          .image(
            'http://openweathermap.org/img/w/' +
            meteogram.symbols[i] + '.png',
            point.plotX + chart.plotLeft - 8,
            point.plotY + chart.plotTop - 30,
            30,
            30
          )
          .attr({
            zIndex: 5
          })
          .add();
      }
    });
  };

  /**
   * Draw blocks around wind arrows, below the plot area
   */
  Meteogram.prototype.drawBlocksForWindArrows = function(chart) {
    var xAxis = chart.xAxis[0],
      x,
      pos,
      max,
      isLong,
      isLast,
      i;

    for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {

      // Get the X position
      isLast = pos === max + 36e5;
      x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

      // Draw the vertical dividers and ticks
      if (this.resolution > 36e5) {
        isLong = pos % this.resolution === 0;
      } else {
        isLong = i % 2 === 0;
      }
      chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
          'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'
        ])
        .attr({
          'stroke': chart.options.chart.plotBorderColor,
          'stroke-width': 1
        })
        .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
      translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

  };

  /**
   * Get the title based on the XML data
   */
  Meteogram.prototype.getTitle = function() {
    return 'Meteogram for ' + this.data.city.name;
  };

  /**
   * Build and return the Highcharts options structure
   */
  Meteogram.prototype.getChartOptions = function() {
    var meteogram = this;

    return {
      chart: {
        renderTo: this.container,
        /*marginBottom: 70,
        marginRight: 40,
        marginTop: 50,*/
        plotBorderWidth: 1,
        /*height: 310,*/
        alignTicks: false,
        /*scrollablePlotArea: {
            minWidth: 720
        }*/
      },

      title: {
        text: this.getTitle(),
        align: 'left',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      },

      credits: {
        text: 'Forecast from OpenWeatherMap',
        href: 'https://openweathermap.org',
        position: {
          x: -40
        }
      },

      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat: '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
          '<b>{point.point.symbolName}</b><br>'

      },

      xAxis: [{ // Bottom X axis
        type: 'datetime',
        tickInterval: 2 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
          format: '{value:%H}'
        },
        crosshair: true
      }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'left',
          x: 3,
          y: -5
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
      }],

      yAxis: [{ // temperature axis
        title: {
          text: null
        },
        labels: {
          format: '{value}°',
          style: {
            fontSize: '10px'
          },
          x: -3
        },
        plotLines: [{ // zero plane
          value: 0,
          color: '#BBBBBB',
          width: 1,
          zIndex: 2
        }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: (Highcharts.theme && Highcharts.theme.background2) || '#F0F0F0'

      }, /*{ // precipitation axis
        title: {
          text: null
        },
        labels: {
          enabled: false
        },
        gridLineWidth: 0,
        tickLength: 0,
        minRange: 10,
        min: 0

      }, */{ // Air pressure
        allowDecimals: false,
        title: { // Title on top of axis
          text: 'hPa',
          offset: 0,
          align: 'high',
          rotation: 0,
          style: {
            fontSize: '10px',
            color: Highcharts.getOptions().colors[2]
          },
          textAlign: 'left',
          x: 3
        },
        labels: {
          style: {
            fontSize: '8px',
            color: Highcharts.getOptions().colors[2]
          },
          y: 2,
          x: 3
        },
        gridLineWidth: 0,
        opposite: true,
        showLastLabel: false
      }],

      legend: {
        enabled: false
      },

      plotOptions: {
        series: {
          pointPlacement: 'between'
        }
      },


      series: [{
        name: 'Temperature',
        data: this.temperatures,
        type: 'spline',
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.value}°C</b><br/>'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
      }, {
        name: 'Air pressure',
        color: Highcharts.getOptions().colors[2],
        data: this.pressures,
        marker: {
          enabled: false
        },
        shadow: false,
        tooltip: {
          valueSuffix: ' hPa'
        },
        dashStyle: 'shortdot',
        yAxis: 1
      }, {
        name: 'Wind',
        type: 'windbarb',
        id: 'windbarbs',
        color: Highcharts.getOptions().colors[1],
        lineWidth: 1.5,
        data: this.winds,
        vectorLength: 18,
        yOffset: -15,
        tooltip: {
          valueSuffix: ' m/s'
        }
      }]
    };
  };

  /**
   * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
   */
  Meteogram.prototype.onChartLoad = function(chart) {

    this.drawWeatherSymbols(chart);
    this.drawBlocksForWindArrows(chart);

  };

  /**
   * Create the chart. This function is called async when the data file is loaded and parsed.
   */
  Meteogram.prototype.createChart = function() {
    var meteogram = this;
    this.chart = new Highcharts.Chart(this.getChartOptions(), function(chart) {
      meteogram.onChartLoad(chart);
    });
  };

  Meteogram.prototype.error = function() {
    $('#loading').html('<i class="fa fa-frown-o"></i> Failed loading data, please try again later');
  };

  /**
   * Handle the data.
   */
  Meteogram.prototype.parseWeatherData = function() {

    var meteogram = this,
      data = this.data,
      pointStart,
      forecast = data.list;

    if (!forecast) {
      return this.error();
    }

    meteogram.symbols = [];
    meteogram.temperatures = [];
    meteogram.winds = [];
    meteogram.pressures = [];

    // The data is JSON with metric units, easy to read into arrays
    Highcharts.each(
      forecast,
      function(datapoint, i) {
        // time for the samples
        var from = datapoint.dt * 1000;
        var to = from + 10800000;

        // If it is more than an hour between points, show all symbols
        if (i === 0) {
          meteogram.resolution = to - from;
        }

        // Populate the parallel arrays
        meteogram.symbols.push(
          datapoint.weather[0].icon
        );

        meteogram.temperatures.push({
          x: from,
          y: datapoint.main.temp,
          // custom options used in the tooltip formatter
          to: to,
          symbolName: datapoint.weather.main
        });

        meteogram.winds.push({
          x: from,
          value: datapoint.wind.speed,
          direction: datapoint.wind.deg
        });

        meteogram.pressures.push({
          x: from,
          y: datapoint.main.pressure
        });

        if (i === 0) {
          pointStart = (from + to) / 2;
        }
      }
    );

    // Smooth the line
    this.smoothLine(this.temperatures);

    // Create the chart when the data is loaded
    this.createChart();
  };
  // End of the Meteogram protype

  // Create the chart with the first datafetch
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?id=634963&units=metric&appid=ce26a83b9f50ebb0c052b891d8e3a087",
    success: function(data) {
      window.meteogram = new Meteogram(data, 'container');
      // last updatetime
      prevowmupdate = new Date().getTime();
    },
    error: Meteogram.prototype.error
  });

  // don't run again
  highcloaded = true;
}

// Update data every 15 minutes
if ((prevowmupdate + 15* 60 * 1000) < new Date().getTime()) {
  if (typeof(window.meteogram) != 'undefined') {
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/forecast?id=634963&units=metric&appid=ce26a83b9f50ebb0c052b891d8e3a087",
      success: function(data) {
        window.meteogram.data = data;
        window.meteogram.parseWeatherData();
        // last updatetime
        prevowmupdate = new Date().getTime();
      }
    });
  }
}
