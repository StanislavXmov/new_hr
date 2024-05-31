import * as d3 from 'd3';
import { median } from 'mathjs';
import { Currency, Field, Format, Grade, Month, SalaryFinal, Working, currency, fields, format, gradeColors, grades, working } from './keys';
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
let filtered = [];
let svg;
let svg2;
let gradeFilter = null;
let currencyFilter = null;
let fieldFilter = null;
let formatFilter = null;
let workingFilter = null;

let isMaxLine = true;
let isMedianLine = true;
let isMinLine = true;
const maxLine = 'maxLine';
const medianLine = 'medianLine';
const minLine = 'minLine';

let maxMedian = 0;

const teamleadButton = document.getElementById('teamleadButton');
const teamleadInfo = document.getElementById('teamlead');
const teamleadMedian = document.getElementById('teamleadMedian');
const teamleadMedianBlock = document.getElementById('teamleadMedianBlock');
const seniorButton = document.getElementById('seniorButton');
const seniorInfo = document.getElementById('senior');
const seniorMedian = document.getElementById('seniorMedian');
const seniorMedianBlock = document.getElementById('seniorMedianBlock');
const middleButton = document.getElementById('middleButton');
const middleInfo = document.getElementById('middle');
const middleMedian = document.getElementById('middleMedian');
const middleMedianBlock = document.getElementById('middleMedianBlock');
const juniorButton = document.getElementById('juniorButton');
const juniorInfo = document.getElementById('junior');
const juniorMedian = document.getElementById('juniorMedian');
const juniorMedianBlock = document.getElementById('juniorMedianBlock');

const rubButton = document.getElementById('rubButton');
const rubInfo = document.getElementById('rub');
const rubMedian = document.getElementById('rubMedian');
const rubMedianBlock = document.getElementById('rubMedianBlock');
const euroButton = document.getElementById('euroButton');
const euroInfo = document.getElementById('euro');
const euroMedian = document.getElementById('euroMedian');
const euroMedianBlock = document.getElementById('euroMedianBlock');
const dramButton = document.getElementById('dramButton');
const dramInfo = document.getElementById('dram');
const dramMedian = document.getElementById('dramMedian');
const dramMedianBlock = document.getElementById('dramMedianBlock');
const cryptButton = document.getElementById('cryptButton');
const cryptInfo = document.getElementById('crypt');
const cryptMedian = document.getElementById('cryptMedian');
const cryptMedianBlock = document.getElementById('cryptMedianBlock');

const officeButton = document.getElementById('officeButton');
const officeInfo = document.getElementById('office');
const officeMedian = document.getElementById('officeMedian');
const officeMedianBlock = document.getElementById('officeMedianBlock');
const hybridButton = document.getElementById('hybridButton');
const hybridInfo = document.getElementById('hybrid');
const hybridMedian = document.getElementById('hybridMedian');
const hybridMedianBlock = document.getElementById('hybridMedianBlock');
const remoteButton = document.getElementById('remoteButton');
const remoteInfo = document.getElementById('remote');
const remoteMedian = document.getElementById('remoteMedian');
const remoteMedianBlock = document.getElementById('remoteMedianBlock');

const gosButton = document.getElementById('gosButton');
const gosInfo = document.getElementById('gos');
const gosMedian = document.getElementById('gosMedian');
const gosMedianBlock = document.getElementById('gosMedianBlock');
const ecommButton = document.getElementById('ecommButton');
const ecommInfo = document.getElementById('ecomm');
const ecommMedian = document.getElementById('ecommMedian');
const ecommMedianBlock = document.getElementById('ecommMedianBlock');
const aiButton = document.getElementById('aiButton');
const aiInfo = document.getElementById('ai');
const aiMedian = document.getElementById('aiMedian');
const aiMedianBlock = document.getElementById('aiMedianBlock');
const datingButton = document.getElementById('datingButton');
const datingInfo = document.getElementById('dating');
const datingMedian = document.getElementById('datingMedian');
const datingMedianBlock = document.getElementById('datingMedianBlock');

const stateButton = document.getElementById('stateButton');
const stateInfo = document.getElementById('state');
const stateMedian = document.getElementById('stateMedian');
const stateMedianBlock = document.getElementById('stateMedianBlock');
const ipButton = document.getElementById('ipButton');
const ipInfo = document.getElementById('ip');
const ipMedian = document.getElementById('ipMedian');
const ipMedianBlock = document.getElementById('ipMedianBlock');
const szButton = document.getElementById('szButton');
const szInfo = document.getElementById('sz');
const szMedian = document.getElementById('szMedian');
const szMedianBlock = document.getElementById('szMedianBlock');
const gphButton = document.getElementById('gphButton');
const gphInfo = document.getElementById('gph');
const gphMedian = document.getElementById('gphMedian');
const gphMedianBlock = document.getElementById('gphMedianBlock');

const maxLineCheckbox = document.getElementById('maxLine');
const medianLineCheckbox = document.getElementById('medianLine');
const minLineCheckbox = document.getElementById('minLine');


const margin = {top: 20, right: 25, bottom: 20, left: 40};
const width = 884 - margin.left - margin.right;
const height = 480 - margin.top - margin.bottom;

const width2 = 884 - margin.left - margin.right;
const height2 = 200 - margin.top - margin.bottom; 

const axis = {
  x: null,
  y: null,
}

const axis2 = {
  x: null,
  y: null,
}

const clearRect = () => {
  d3.selectAll(`[data-rect]`).remove();
  d3.selectAll(`[data-graph2]`).remove();
  d3.selectAll(`[data-median]`).remove();
  d3.selectAll(`[data-min]`).remove();
  d3.selectAll(`[data-max]`).remove();
}

const getMedianData = (data, key, value) => {
  let filtered = [];
  if (key === Grade) {
    filtered = data.filter(d => d[Grade] === value);
  }
  if (key === Currency) {
    filtered = data.filter(d => d[Currency] === value);
  }
  if (key === Field) {
    filtered = data.filter(d => d[Field] === value);
  }
  if (key === Format) {
    filtered = data.filter(d => d[Format] === value);
  }
  if (key === Working) {
    filtered = data.filter(d => d[Working] === value);
  }
  const s = filtered.map(d => d.salary.s / 1000);
  const m = s.length > 0 ? median(s) : 0;
  return m;
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

const getFormatData = (data, format) => {
  const filtered = data.filter(d => d[Format] === format);
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

  const teamleadMedianValue = getMedianData(data, Grade, grades.teamlead);
  const seniorMedianValue = getMedianData(data, Grade, grades.senior);
  const middleMedianValue = getMedianData(data, Grade, grades.middle);
  const juniorMedianValue = getMedianData(data, Grade, grades.junior);

  teamleadMedian.textContent = teamleadMedianValue;
  seniorMedian.textContent = seniorMedianValue;
  middleMedian.textContent = middleMedianValue;
  juniorMedian.textContent = juniorMedianValue;

  const wd = 50 / maxMedian;
  teamleadMedianBlock.style.width = `${teamleadMedianValue * wd}px`;
  seniorMedianBlock.style.width = `${seniorMedianValue * wd}px`;
  middleMedianBlock.style.width = `${middleMedianValue * wd}px`;
  juniorMedianBlock.style.width = `${juniorMedianValue * wd}px`;
}

const setCurrencyData = (data) => {
  rubInfo.textContent = getCurrencyData(data, currency.rub).length;
  euroInfo.textContent = getCurrencyData(data, currency.euro).length;
  dramInfo.textContent = getCurrencyData(data, currency.dram).length;
  cryptInfo.textContent = getCurrencyData(data, currency.crypt).length;

  const rubMedianValue = getMedianData(data, Currency, currency.rub);
  const euroMedianValue = getMedianData(data, Currency, currency.euro);
  const dramMedianValue = getMedianData(data, Currency, currency.dram);
  const cryptMedianValue = getMedianData(data, Currency, currency.crypt);

  rubMedian.textContent = rubMedianValue;
  euroMedian.textContent = euroMedianValue;
  dramMedian.textContent = dramMedianValue;
  cryptMedian.textContent = cryptMedianValue;

  const wd = 50 / maxMedian;
  rubMedianBlock.style.width = `${rubMedianValue * wd}px`;
  euroMedianBlock.style.width = `${euroMedianValue * wd}px`;
  dramMedianBlock.style.width = `${dramMedianValue * wd}px`;
  cryptMedianBlock.style.width = `${cryptMedianValue * wd}px`;
}

const setFieldData = (data) => {
  gosInfo.textContent = getFieldData(data, fields.gos).length;
  ecommInfo.textContent = getFieldData(data, fields.ecomm).length;
  aiInfo.textContent = getFieldData(data, fields.ai).length;
  datingInfo.textContent = getFieldData(data, fields.dating).length;

  const gosMedianValue = getMedianData(data, Field, fields.gos);
  const ecommMedianValue = getMedianData(data, Field, fields.ecomm);
  const aiMedianValue = getMedianData(data, Field, fields.ai);
  const datingMedianValue = getMedianData(data, Field, fields.dating);

  gosMedian.textContent = gosMedianValue;
  ecommMedian.textContent = ecommMedianValue;
  aiMedian.textContent = aiMedianValue;
  datingMedian.textContent = datingMedianValue;

  const wd = 50 / maxMedian;
  gosMedianBlock.style.width = `${gosMedianValue * wd}px`;
  ecommMedianBlock.style.width = `${ecommMedianValue * wd}px`;
  aiMedianBlock.style.width = `${aiMedianValue * wd}px`;
  datingMedianBlock.style.width = `${datingMedianValue * wd}px`;
}

const setFormatData = (data) => {
  stateInfo.textContent = getFormatData(data, format.state).length;
  ipInfo.textContent = getFormatData(data, format.ip).length;
  szInfo.textContent = getFormatData(data, format.sz).length;
  gphInfo.textContent = getFormatData(data, format.gph).length;

  const stateMedianValue = getMedianData(data, Format, format.state);
  const ipMedianValue = getMedianData(data, Format, format.ip);
  const szMedianValue = getMedianData(data, Format, format.sz);
  const gphMedianValue = getMedianData(data, Format, format.gph);

  stateMedian.textContent = stateMedianValue;
  ipMedian.textContent = ipMedianValue;
  szMedian.textContent = szMedianValue;
  gphMedian.textContent = gphMedianValue;

  const wd = 50 / maxMedian;
  stateMedianBlock.style.width = `${stateMedianValue * wd}px`;
  ipMedianBlock.style.width = `${ipMedianValue * wd}px`;
  szMedianBlock.style.width = `${szMedianValue * wd}px`;
  gphMedianBlock.style.width = `${gphMedianValue * wd}px`;
}

const setWorkingData = (data) => {
  officeInfo.textContent = getWorkingData(data, working.office).length;
  hybridInfo.textContent = getWorkingData(data, working.hybrid).length;
  remoteInfo.textContent = getWorkingData(data, working.remote).length;

  const officeMedianValue = getMedianData(data, Working, working.office);
  const hybridMedianValue = getMedianData(data, Working, working.hybrid);
  const remoteMedianValue = getMedianData(data, Working, working.remote);

  officeMedian.textContent = officeMedianValue;
  hybridMedian.textContent = hybridMedianValue;
  remoteMedian.textContent = remoteMedianValue;

  const wd = 50 / maxMedian;
  officeMedianBlock.style.width = `${officeMedianValue * wd}px`;
  hybridMedianBlock.style.width = `${hybridMedianValue * wd}px`;
  remoteMedianBlock.style.width = `${remoteMedianValue * wd}px`;
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

const setFormatFilter = (e) => {
  const format = e.target.dataset.format;
  if (formatFilter !== format) {
    formatFilter = format;
  } else {
    formatFilter = null;
  }
  const elements = document.querySelectorAll(`[data-format]`); 
  if (formatFilter) {
    elements.forEach(e => e.classList.add('notActive'));
    const activeElements = document.querySelectorAll(`[data-format=${formatFilter}]`);
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
  filtered = data;
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
  if (formatFilter) {
    filtered = getFormatData(filtered, format[formatFilter]);
  }

  setGradeData(filtered);
  setCurrencyData(filtered);
  setWorkingData(filtered);
  setFieldData(filtered);
  setFormatData(filtered);

  clearRect();
  setRect(svg, filtered);
  setGraph2(filtered);
}

const setLineFilter = (e) => {
  const line = e.target.dataset.checkbox;
  const checked = e.target.checked;
  
  if (checked) {
    if (line === maxLine) {
      isMaxLine = true;
    } else if (line === medianLine) {
      isMedianLine = true;
    } else if (line === minLine) {
      isMinLine = true;
    }
    setLines(filtered);
  } else {
    if (line === maxLine) {
      isMaxLine = false;
      d3.selectAll(`[data-max]`).remove();
    } else if (line === medianLine) {
      isMedianLine = false;
      d3.selectAll(`[data-median]`).remove();
    } else if (line === minLine) {
      isMinLine = false;
      d3.selectAll(`[data-min]`).remove();
    }
  }
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
    
  setLines(data);
}

const setLines = (data) => {
  const dataMapedObject = {};

  data.forEach(d => {
    if (dataMapedObject[d.date]) {
      dataMapedObject[d.date].value += d.salary.s;
      dataMapedObject[d.date].counter++;
      dataMapedObject[d.date].values.push(d.salary.s);
    } else {
      dataMapedObject[d.date] = {
        value: d.salary.s,
        counter: 1,
        values: [d.salary.s],
      }
    }
  });

  // median
  if (isMedianLine) {
    svg.append("path")
      .datum(Object.entries(dataMapedObject))
      .attr("data-median", true)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => axis.x(d[0]) + 34.125)
        // .y(d => axis.yLinear(d[1].value / d[1].counter / 1000))
        .y(d => axis.yLinear(median(d[1].values) / 1000) + 11)
        );
  }

  // min
  if (isMinLine) {
    svg.append("path")
      .datum(Object.entries(dataMapedObject))
      .attr("data-min", true)
      .attr("fill", "none")
      .attr("stroke", "#8a8a8a")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => axis.x(d[0]) + 34.125)
        .y(d => axis.yLinear(Math.min(...d[1].values) / 1000) + 11)
        );
  }

  // max
  if (isMaxLine) {
    svg.append("path")
      .datum(Object.entries(dataMapedObject))
      .attr("data-max", true)
      .attr("fill", "none")
      .attr("stroke", "#424242")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(d => axis.x(d[0]) + 34.125)
        .y(d => axis.yLinear(Math.max(...d[1].values) / 1000) + 11)
        );
  }
}

const setGraph2 = (data) => {
  const mappedByDates = {};
  const setCounter = (date, grade) => {
    if (grade === grades.teamlead) {
      mappedByDates[date].teamlead++;
    } else if (grade === grades.senior) {
      mappedByDates[date].senior++;
    } else if (grade === grades.middle) {
      mappedByDates[date].middle++;
    } else if (grade === grades.junior) {
      mappedByDates[date].junior++;
    }
  }
  data.forEach(d => {
    if (mappedByDates[d.date]) {
      setCounter(d.date, d[Grade]);
    } else {
      mappedByDates[d.date] = {
        // month: d.Month,
        group: d.date,
        teamlead: 0,
        senior: 0,
        middle: 0,
        junior: 0,
      };
      setCounter(d.date, d[Grade]);
    }
  });

  const mappedByDatesList = Object.values(mappedByDates);
  const subgroups = ["тимлид", "сеньор", "миддл", "джун"];
  const groups = month;

  let maxH = 0;
  mappedByDatesList.forEach(d => {
    const s = d.teamlead + d.senior + d.middle + d.junior;
    maxH = Math.max(s, maxH);
  });

  const x = d3.scaleBand()
      .domain(groups)
      .range([0, width2])
      .padding([0.0])
  svg2.append("g")
    .attr("data-graph2", true)
    .attr("transform",`translate(0,${height2})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  const y = d3.scaleLinear()
    .domain([0, maxH])
    .range([ height2, 0 ]);
  svg2.append("g")
    .attr("data-graph2", true)
    .call(d3.axisLeft(y));

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range([
      gradeColors.junior,
      gradeColors.middle,
      gradeColors.senior,
      gradeColors.teamlead,
    ]);

  const stackedData = d3.stack()
    .keys(['junior', 'middle', 'senior', 'teamlead'])(mappedByDatesList);
  
  svg2.append("g")
    .attr("data-graph2", true)
    .selectAll("g")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
        .attr("x", d => x(d.data.group))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width",x.bandwidth());

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
  filtered = data;

  // get max median
  maxMedian = Math.max(getMedianData(data, Grade, grades.teamlead), maxMedian);
  maxMedian = Math.max(getMedianData(data, Grade, grades.senior), maxMedian);
  maxMedian = Math.max(getMedianData(data, Grade, grades.middle), maxMedian);
  maxMedian = Math.max(getMedianData(data, Grade, grades.junior), maxMedian);

  svg = d3.select("#graph1")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  svg2 = d3.select("#graph2")
    .append("svg")
      .attr("width", width2 + margin.left + margin.right)
      .attr("height", height2 + margin.top + margin.bottom)
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
  setGraph2(data);

  // data
  setGradeData(data);
  setCurrencyData(data);
  setFieldData(data);
  setWorkingData(data);
  setFormatData(data);

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

  stateButton.addEventListener('click', setFormatFilter);
  ipButton.addEventListener('click', setFormatFilter);
  szButton.addEventListener('click', setFormatFilter);
  gphButton.addEventListener('click', setFormatFilter);

  officeButton.addEventListener('click', setWorkingFilter);
  hybridButton.addEventListener('click', setWorkingFilter);
  remoteButton.addEventListener('click', setWorkingFilter);

  maxLineCheckbox.addEventListener('change', setLineFilter);
  medianLineCheckbox.addEventListener('change', setLineFilter);
  minLineCheckbox.addEventListener('change', setLineFilter);

}
