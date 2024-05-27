import * as d3 from 'd3';
import { Currency, Field, Grade, Month, SalaryFinal, Working, currency, fields, grades, working } from './keys';
import './style.scss';

const month = ['Январь' , 'Февраль' , 'Март' , 'Апрель' , 'Май' , 'Июнь' , 'Июль' , 'Август' , 'Сентябрь' , 'Октябрь' , 'Ноябрь' , 'Декабрь'];
const getMonth = (d) => Number(d.Month.split('.')[1]);
const salaries = {};

for (let i = 1; i < 21; i++) {
  salaries[i * 20] = {
    s: i * 20 * 1000,
    id: i,
  }
}

const getSalary = (d) => {
  const str = d[SalaryFinal].trim().split('₽')[1].replace(' ', '');
  const salary = Number(str);
  
  for (const key in salaries) {
    if (salary < salaries[key].s) {
      d.salary = salaries[Number(key) - 20];
      break;
    } else if (salary === salaries[key].s) {
      d.salary = salaries[key];
      break;
    }
  }
}

let data;
let svg;
let gradeFilter = null;
let currencyFilter = null;
let fieldFilter = null;
let formatFilter = null;
let workingFilter = null;

const teamleadButton = document.getElementById('teamleadButton');
const teamleadInfo = document.getElementById('teamlead');
const teamleadMedian = document.getElementById('teamleadMedian');
const seniorButton = document.getElementById('seniorButton');
const seniorInfo = document.getElementById('senior');
const seniorMedian = document.getElementById('seniorMedian');
const middleButton = document.getElementById('middleButton');
const middleInfo = document.getElementById('middle');
const middleMedian = document.getElementById('middleMedian');
const juniorButton = document.getElementById('juniorButton');
const juniorInfo = document.getElementById('junior');
const juniorMedian = document.getElementById('juniorMedian');

const rubButton = document.getElementById('rubButton');
const rubInfo = document.getElementById('rub');
const rubMedian = document.getElementById('rubMedian');
const euroButton = document.getElementById('euroButton');
const euroInfo = document.getElementById('euro');
const euroMedian = document.getElementById('euroMedian');
const dramButton = document.getElementById('dramButton');
const dramInfo = document.getElementById('dram');
const dramMedian = document.getElementById('dramMedian');
const cryptButton = document.getElementById('cryptButton');
const cryptInfo = document.getElementById('crypt');
const cryptMedian = document.getElementById('cryptMedian');

const officeButton = document.getElementById('officeButton');
const officeInfo = document.getElementById('office');
const officeMedian = document.getElementById('officeMedian');
const hybridButton = document.getElementById('hybridButton');
const hybridInfo = document.getElementById('hybrid');
const hybridMedian = document.getElementById('hybridMedian');
const remoteButton = document.getElementById('remoteButton');
const remoteInfo = document.getElementById('remote');
const remoteMedian = document.getElementById('remoteMedian');

const gosButton = document.getElementById('gosButton');
const gosInfo = document.getElementById('gos');
const gosMedian = document.getElementById('gosMedian');
const ecommButton = document.getElementById('ecommButton');
const ecommInfo = document.getElementById('ecomm');
const ecommMedian = document.getElementById('ecommMedian');
const aiButton = document.getElementById('aiButton');
const aiInfo = document.getElementById('ai');
const aiMedian = document.getElementById('aiMedian');
const datingButton = document.getElementById('datingButton');
const datingInfo = document.getElementById('dating');
const datingMedian = document.getElementById('datingMedian');


const margin = {top: 20, right: 25, bottom: 20, left: 40};
const width = 884 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

const axis = {
  x: null,
  y: null,
}

const clearRect = () => {
  d3.selectAll(`[data-rect]`).remove();
  d3.selectAll(`[data-median]`).remove();
}

const getGradeData = (data, grade) => {
  const filtered = data.filter(d => d[Grade] === grade);
  return filtered;
}

const getCurrencyData = (data, currency) => {
  const filtered = data.filter(d => d[Currency] === currency);
  return filtered;
}

const getFieldData = (data, field) => {
  const filtered = data.filter(d => d[Field] === field);
  return filtered;
}

const getWorkingData = (data, work) => {
  const filtered = data.filter(d => d[Working].toLowerCase() === work);
  return filtered;
}

const setGradeData = (data) => {
  teamleadInfo.textContent = getGradeData(data, grades.teamlead).length;
  seniorInfo.textContent = getGradeData(data, grades.senior).length;
  middleInfo.textContent = getGradeData(data, grades.middle).length;
  juniorInfo.textContent = getGradeData(data, grades.junior).length;
}

const setCurrencyData = (data) => {
  rubInfo.textContent = getCurrencyData(data, currency.rub).length;
  euroInfo.textContent = getCurrencyData(data, currency.euro).length;
  dramInfo.textContent = getCurrencyData(data, currency.dram).length;
  cryptInfo.textContent = getCurrencyData(data, currency.crypt).length;
}

const setFieldData = (data) => {
  gosInfo.textContent = getFieldData(data, fields.gos).length;
  ecommInfo.textContent = getFieldData(data, fields.ecomm).length;
  aiInfo.textContent = getFieldData(data, fields.ai).length;
  datingInfo.textContent = getFieldData(data, fields.dating).length;
}

const setWorkingData = (data) => {
  officeInfo.textContent = getWorkingData(data, working.office).length;
  hybridInfo.textContent = getWorkingData(data, working.hybrid).length;
  remoteInfo.textContent = getWorkingData(data, working.remote).length;
}

const setGradeFilter = (e) => {
  const grade = e.target.dataset.grade;
  if (gradeFilter !== grade) {
    gradeFilter = grade;
  } else {
    gradeFilter = null;
  }
  const elements = document.querySelectorAll(`[data-grade]`); 
  if (gradeFilter) {
    elements.forEach(e => e.classList.add('notActive'));
    const activeElements = document.querySelectorAll(`[data-grade=${gradeFilter}]`);
    activeElements.forEach(e => e.classList.remove('notActive'));
  } else {
    elements.forEach(e => e.classList.remove('notActive'));
  }

  setFilteredData(data);
}

const setCurrencyFilter = (e) => {
  const currency = e.target.dataset.currency;
  if (currencyFilter !== currency) {
    currencyFilter = currency;
  } else {
    currencyFilter = null;
  }
  const elements = document.querySelectorAll(`[data-currency]`); 
  if (currencyFilter) {
    elements.forEach(e => e.classList.add('notActive'));
    const activeElements = document.querySelectorAll(`[data-currency=${currencyFilter}]`);
    activeElements.forEach(e => e.classList.remove('notActive'));
  } else {
    elements.forEach(e => e.classList.remove('notActive'));
  }

  setFilteredData(data);
}

const setFieldFilter = (e) => {
  const field = e.target.dataset.field;
  if (fieldFilter !== field) {
    fieldFilter = field;
  } else {
    fieldFilter = null;
  }
  const elements = document.querySelectorAll(`[data-field]`); 
  if (fieldFilter) {
    elements.forEach(e => e.classList.add('notActive'));
    const activeElements = document.querySelectorAll(`[data-field=${fieldFilter}]`);
    activeElements.forEach(e => e.classList.remove('notActive'));
  } else {
    elements.forEach(e => e.classList.remove('notActive'));
  }

  setFilteredData(data);
}

const setWorkingFilter = (e) => {
  const working = e.target.dataset.working;
  if (workingFilter !== working) {
    workingFilter = working;
  } else {
    workingFilter = null;
  }
  const elements = document.querySelectorAll(`[data-working]`); 
  if (workingFilter) {
    elements.forEach(e => e.classList.add('notActive'));
    const activeElements = document.querySelectorAll(`[data-working=${workingFilter}]`);
    activeElements.forEach(e => e.classList.remove('notActive'));
  } else {
    elements.forEach(e => e.classList.remove('notActive'));
  }

  setFilteredData(data);
}

const setFilteredData = (data) => {
  let filtered = data;
  if (gradeFilter) {
    filtered = getGradeData(filtered, grades[gradeFilter]);
  }
  if (currencyFilter) {
    filtered = getCurrencyData(filtered, currency[currencyFilter]);
  }
  if (workingFilter) {
    filtered = getWorkingData(filtered, working[workingFilter]);
  }
  if (fieldFilter) {
    filtered = getFieldData(filtered, fields[fieldFilter]);
  }

  setGradeData(filtered);
  setCurrencyData(filtered);
  setWorkingData(filtered);
  setFieldData(filtered);

  clearRect();
  setRect(svg, filtered);
}

const setRect = (svg, data) => {
  svg.selectAll()
    .data(data)
    .enter()
    .append("rect")
      .attr("data-rect", true)
      .attr("x", d => axis.x(d.date))
      .attr("y", d => axis.y(d.salary.s / 1000))
      // .attr("data-salary",d => d.salary.s)
      .attr("width", axis.x.bandwidth() )
      .attr("height", axis.y.bandwidth() )
      .style("fill", d => '#c1c1c1')
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.4);

  const dataMapedObject = {};

  data.forEach(d => {
    if (dataMapedObject[d.date]) {
      dataMapedObject[d.date].value += d.salary.s;
      dataMapedObject[d.date].counter++;
    } else {
      dataMapedObject[d.date] = {
        value: d.salary.s,
        counter: 1,
      }
    }
  });

  svg.append("path")
      .datum(Object.entries(dataMapedObject))
      .attr("data-median", true)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => axis.x(d[0]) + 34.125)
        .y(d => axis.yLinear(d[1].value / d[1].counter / 1000))
        );
}

export const getCsv = async () => {
  data = await d3.csv('./Dataset HR - XYZ разработчик 2023 год.csv');
  data.sort((a, b) => getMonth(a) - getMonth(b));
  console.log(data);

  data.forEach(d => {
    const m = getMonth(d);
    d.date = month[m - 1];
    getSalary(d);
  });

  svg = d3.select("#graph1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const dates = d3.map(data, d => d.date);
  const salary = d3.map(Object.entries(salaries), s => s[1].s / 1000);
  // console.log(dates, salary);
  
  const x = d3.scaleBand()
    .range([ 0, width ])
    .domain(dates)
    .padding(0);
  svg.append("g")
    .style("font-size", 12)
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove();
  axis.x = x;

  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(salary)
    .padding(0);
  svg.append("g")
    .style("font-size", 12)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove();
  axis.y = y;

  const yLinear = d3.scaleLinear()
      .domain([0, 400])
      .range([ height, 0 ]);
  axis.yLinear = yLinear;

  setRect(svg, data);

  // data
  setGradeData(data);
  setCurrencyData(data);
  setFieldData(data);
  setWorkingData(data);

  // UI
  teamleadButton.addEventListener('click', setGradeFilter);
  seniorButton.addEventListener('click', setGradeFilter);
  middleButton.addEventListener('click', setGradeFilter);
  juniorButton.addEventListener('click', setGradeFilter);

  rubButton.addEventListener('click', setCurrencyFilter);
  euroButton.addEventListener('click', setCurrencyFilter);
  dramButton.addEventListener('click', setCurrencyFilter);
  cryptButton.addEventListener('click', setCurrencyFilter);

  gosButton.addEventListener('click', setFieldFilter);
  ecommButton.addEventListener('click', setFieldFilter);
  aiButton.addEventListener('click', setFieldFilter);
  datingButton.addEventListener('click', setFieldFilter);

  officeButton.addEventListener('click', setWorkingFilter);
  hybridButton.addEventListener('click', setWorkingFilter);
  remoteButton.addEventListener('click', setWorkingFilter);

}

