import SmartView from './smart.js';
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {countDuration, findTopGenre, countWatchedInPeriod} from "../utils/statistics.js";
import {userGradeSettings} from '../const.js';
import {getUserRank} from '../utils/user-profile.js';

const renderChart = (statisticCtx, data) => {
  const watchedInPeriod = countWatchedInPeriod(data);

  const genresMap = watchedInPeriod ? findTopGenre(watchedInPeriod) : false;
  const genreNames = genresMap ? genresMap.map((pare) => pare[0]) : [];
  const genreNumbers = genresMap ? genresMap.map((pare) => pare[1]) : [];

  const BAR_HEIGHT = 50;

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * 5;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genreNames,
      datasets: [{
        data: genreNumbers,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = (data) => {
  const watchedInPeriod = countWatchedInPeriod(data);
  const watchedAmount = watchedInPeriod.length;

  const totalDuration = watchedAmount ? countDuration(watchedInPeriod) : 0;
  const hours = totalDuration.hours ? totalDuration.hours : 0;
  const minutes = totalDuration.minutes ? totalDuration.minutes : 0;
  const topGenre = watchedAmount ? findTopGenre(watchedInPeriod)[0][0] : ``;

  const userRank = getUserRank(data.cards, userGradeSettings);

  return (
    `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time">
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedAmount}<span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${hours}<span class="statistic__item-description">h</span>${minutes}<span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(films) {
    super();

    this._data = {
      cards: films,
      period: `all-time`
    };

    this._chart = null;
    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setChart();
    this._setPeriodChangeHandler();
    this._setChecked(this._data.period);
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart = null;
    }
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);
    this._chart = renderChart(statisticCtx, this._data);
  }

  _setPeriodChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    const period = evt.target.value;
    if (!period) {
      return;
    }

    this.updateData({
      period
    });

    this._setChecked(this._data.period);
  }

  restoreHandlers() {
    this._setPeriodChangeHandler();
    this._setChart();
  }

  _setChecked(period) {
    this.getElement().querySelector(`input[value="${period}"]`).checked = true;
  }
}
