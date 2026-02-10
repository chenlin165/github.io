// 1. 日期与农历
function updateDateTime() {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  
  const solarDate = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekdays[now.getDay()]}`;
  document.getElementById('current-date').textContent = solarDate;

  // 调用农历库
  const lunarObj = LunarCalendar.solarToLunar(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const lunarDateStr = `农历${lunarObj.lunarYear}年${lunarObj.lunarMonthName}${lunarObj.lunarDayName}`;
  document.getElementById('lunar-date').textContent = lunarDateStr;
}
updateDateTime();
setInterval(updateDateTime, 60000); // 每分钟更新

// 2. 天气功能 (需替换 YOUR_KEY)
const WEATHER_API_KEY = 'YOUR_HEWEATHER_API_KEY'; // 请前往和风天气官网申请免费Key
function getWeather() {
  if (WEATHER_API_KEY === 'YOUR_HEWEATHER_API_KEY') {
    console.warn('请先配置和风天气API Key');
    return;
  }
  
  // 这里使用IP定位获取天气，也可以改为固定城市：location='101010100'（北京）
  fetch(`https://devapi.qweather.com/v7/weather/now?location=auto_ip&key=${WEATHER_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      if (data.code === '200') {
        const now = data.now;
        document.getElementById('weather-city').textContent = '当前位置';
        document.getElementById('weather-temp').textContent = `${now.temp}°C`;
        document.getElementById('weather-desc').textContent = now.text;
      }
    });
}
getWeather();

// 3. 股票走势 (以苹果AAPL为例)
let stockChart;
function initStockChart() {
  const ctx = document.getElementById('stockChart').getContext('2d');
  
  // 使用雅虎财经API (注意：此API可能不稳定，建议用于演示)
  fetch('https://query1.finance.yahoo.com/v8/finance/chart/AAPL?range=1mo&interval=1d')
    .then(response => response.json())
    .then(data => {
      const result = data.chart.result;
      const timestamps = result.timestamp;
      const closes = result.indicators.quote.close;

      const labels = timestamps.map(ts => {
        const date = new Date(ts * 1000);
        return `${date.getMonth()+1}/${date.getDate()}`;
      });

      stockChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'AAPL 收盘价',
            data: closes,
            borderColor: 'rgba(118, 75, 162, 1)',
            backgroundColor: 'rgba(118, 75, 162, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    });
}
initStockChart();

// 4. 待办清单功能
function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('myPortfolioTodos')) || [];
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  
  todos.forEach((todo, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${todo.completed ? 'completed' : ''}" onclick="toggleTodo(${index})">${todo.text}</span>
      <button onclick="removeTodo(${index})">删除</button>
    `;
    todoList.appendChild(li);
  });
}

function addTodo() {
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (!text) return;
  
  const todos = JSON.parse(localStorage.getItem('myPortfolioTodos')) || [];
  todos.push({ text, completed: false });
  localStorage.setItem('myPortfolioTodos', JSON.stringify(todos));
  
  input.value = '';
  loadTodos();
}

function toggleTodo(index) {
  const todos = JSON.parse(localStorage.getItem('myPortfolioTodos')) || [];
  todos[index].completed = !todos[index].completed;
  localStorage.setItem('myPortfolioTodos', JSON.stringify(todos));
  loadTodos();
}

function removeTodo(index) {
  const todos = JSON.parse(localStorage.getItem('myPortfolioTodos')) || [];
  todos.splice(index, 1);
  localStorage.setItem('myPortfolioTodos', JSON.stringify(todos));
  loadTodos();
}

// 初始化待办列表
loadTodos();

// 回车添加待办
document.getElementById('todo-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    addTodo();
  }
});
