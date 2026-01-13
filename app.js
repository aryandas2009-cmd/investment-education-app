const investmentData={
stocks:{icon:"📈",title:"Stocks",description:"Ownership shares in a company with potential growth and dividends.",pros:["High long-term return potential","Liquid and widely accessible","Dividend income potential","Diversification across sectors"],cons:["High volatility","Risk of loss","Requires research and monitoring","Emotional stress in downturns"],considerations:["Understand business model and financials","Diversify across sectors","Match risk to timeline","Be aware of fees","Consider dollar-cost averaging"]},
bonds:{icon:"💼",title:"Bonds",description:"Debt securities that pay interest and return principal at maturity.",pros:["Predictable income","Lower risk than stocks","Portfolio diversification","Government bonds are safer"],cons:["Lower returns than stocks","Interest rate and inflation risk","Credit risk of issuer","Less liquidity for some bonds"],considerations:["Check credit ratings","Know maturity and yield","Watch interest rate trends","Diversify issuers and types"]},
"mutual-funds":{icon:"📊",title:"Mutual Funds",description:"Pooled investments managed by professionals for diversification.",pros:["Professional management","Instant diversification","Accessible for small amounts","Regulated and transparent"],cons:["Management fees","Less control over holdings","Taxable distributions","Performance depends on manager"],considerations:["Review expense ratio","Check strategy and track record","Consider index funds for low fees","Match risk level to goals"]},
etf:{icon:"📉",title:"ETFs",description:"Index-tracking funds that trade like stocks with low fees.",pros:["Low expense ratios","Intra-day trading","Diversification","Transparent holdings"],cons:["Bid-ask spreads","Potential tracking error","Low liquidity for niche ETFs","May tempt frequent trading"],considerations:["Check expense ratio and liquidity","Understand index tracked","Review holdings and rebalancing","Compare similar ETFs"]},
"real-estate":{icon:"🏠",title:"Real Estate",description:"Property investments for rental income and appreciation.",pros:["Steady rental income","Potential appreciation","Tangible asset","Tax benefits"],cons:["High upfront cost","Illiquid","Maintenance and management","Location risk"],considerations:["Research local market","Factor full costs","Plan property management","Consider REITs for easier entry"]},
crypto:{icon:"₿",title:"Cryptocurrency",description:"Digital assets on decentralized networks with high volatility.",pros:["Very high return potential","24/7 markets","Borderless and decentralized","Portfolio diversification"],cons:["Extreme volatility","Regulatory uncertainty","Security risks","No backing or insurance"],considerations:["Invest only what you can lose","Use reputable exchanges","Enable strong security","Understand tax implications"]},
"savings-accounts":{icon:"💰",title:"Savings Accounts",description:"Insured bank deposits earning interest for safety and liquidity.",pros:["Very safe","Easy access","No principal loss","Predictable interest"],cons:["Very low returns","Rates can change","Limited growth","Interest is taxable"],considerations:["Compare rates","Check minimums and fees","Know insurance limits","Use for emergency funds"]},
"retirement-accounts":{icon:"🎯",title:"Retirement Accounts",description:"Tax-advantaged long-term savings vehicles like 401k and IRA.",pros:["Tax advantages","Employer match","Automatic contributions","Compound growth"],cons:["Early withdrawal penalties","Contribution limits","Limited options in plans","RMDs for some accounts"],considerations:["Contribute to get match","Start early","Know Roth vs Traditional","Rebalance periodically"]}
};
let resultsPanel=document.getElementById("resultsPanel");
let chartsPanel=document.getElementById("chartsPanel");
let stockSymbolInput=document.getElementById("stockSymbolInput");
let searchStockButton=document.getElementById("searchStockButton");
let stockChart=null;
let chatMessages=null;
let chatInput=null;
let sendButton=null;
let roiCalcButton=null;
let ciCalcButton=null;
function addResults(html){const d=document.createElement("div");d.innerHTML=html;resultsPanel.innerHTML="";resultsPanel.appendChild(d.firstElementChild);resultsPanel.scrollTop=0}
function addCharts(html){const d=document.createElement("div");d.innerHTML=html;chartsPanel.innerHTML="";chartsPanel.appendChild(d.firstElementChild);chartsPanel.scrollTop=0}
function displayInvestment(key){const inv=investmentData[key];if(!inv)return;addResults(`<div class="card"><div class="card-header"><div class="card-title">${inv.icon} ${inv.title}</div></div><div class="description">${inv.description}</div><div class="grid"><div class="list good"><div class="list-title">Pros</div><ul>${inv.pros.map(p=>`<li>${p}</li>`).join("")}</ul></div><div class="list bad"><div class="list-title">Cons</div><ul>${inv.cons.map(c=>`<li>${c}</li>`).join("")}</ul></div></div><div class="list"><div class="list-title">Things to consider</div><ul>${inv.considerations.map(c=>`<li>${c}</li>`).join("")}</ul></div></div>`)}
function displayInvestment(key){
  const inv=investmentData[key];if(!inv)return;
  const html=`<div class="card">
    <div class="card-header"><div class="card-title">${inv.icon} ${inv.title}</div></div>
    <div class="description">${inv.description}</div>
    <div class="grid">
      <div class="list good"><div class="list-title">Pros</div><ul>${inv.pros.map(p=>`<li>${p}</li>`).join("")}</ul></div>
      <div class="list bad"><div class="list-title">Cons</div><ul>${inv.cons.map(c=>`<li>${c}</li>`).join("")}</ul></div>
    </div>
    <div class="list"><div class="list-title">Things to consider</div><ul>${inv.considerations.map(c=>`<li>${c}</li>`).join("")}</ul></div>
  </div>`;
  addResults(html);
  renderFeedback(resultsPanel, 'investment', key, 'Was this helpful?');
}
function formatLabels(dates){return dates.map(x=>new Date(x).toLocaleDateString("en-US",{month:"short",year:"numeric"}))}
function renderChart(symbol,labels,closes,stats){
  const color=stats.totalReturn>=0?"#10b981":"#ef4444";
  const icon=stats.totalReturn>=0?"📈":"📉";
  const html=
    `<div class="card">
      <div class="card-header">
        <div class="card-title">${symbol} Trend</div>
      </div>
      <div class="stats">
        <div class="stat">
          <div class="stat-label">5-Year Return</div>
          <div class="stat-value" style="color:${color}">${icon} ${stats.totalReturn.toFixed(2)}%</div>
        </div>
        <div class="stat">
          <div class="stat-label">Highest Price</div>
          <div class="stat-value">$${stats.highest.toFixed(2)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Lowest Price</div>
          <div class="stat-value">$${stats.lowest.toFixed(2)}</div>
        </div>
        <div class="stat">
          <div class="stat-label">Avg Volume</div>
          <div class="stat-value">${stats.avgVolume.toLocaleString()}</div>
        </div>
      </div>
      <div class="chart">
        <canvas id="stockChart"></canvas>
      </div>
    </div>`;
  addResults(html);
  if(stockChart)stockChart.destroy();
  const chartHTML=`<div class="card"><div class="card-header"><div class="card-title">${symbol} Chart</div></div><div class="chart"><canvas id="chartsCanvas"></canvas></div></div>`;
  addCharts(chartHTML);
  const ctx=document.getElementById("chartsCanvas").getContext("2d");
  stockChart=new Chart(ctx,{
    type:"line",
    data:{
      labels,
      datasets:[{
        label:`${symbol} Close`,
        data:closes,
        borderColor:"#667eea",
        backgroundColor:"rgba(102,126,234,.1)",
        borderWidth:2,
        fill:true,
        tension:.1
      }]
    },
    options:{
      responsive:true,
      plugins:{
        legend:{display:true},
        title:{display:true,text:`${symbol} • 5-Year History`}
      },
      scales:{
        y:{beginAtZero:false,title:{display:true,text:"Price (USD)"}},
        x:{ticks:{maxTicksLimit:12}}
      }
    }
  });
  renderFeedback(resultsPanel, 'stock', symbol, 'Was this trend helpful?');
  renderFeedback(chartsPanel, 'stock', symbol, 'Was this trend helpful?');
}
async function fetchStockData(symbol){try{const raw=symbol.trim().toLowerCase();const candidates=[`${raw}.us`,raw];let text=null;let used=null;for(const s of candidates){const url=`https://stooq.com/q/d/l/?s=${encodeURIComponent(s)}&i=d`;const r=await fetch(url);if(r.ok){const t=await r.text();if(t&&t.toLowerCase().includes("date")&&t.includes("\n")){text=t;used=s;break}}}if(!text)return generateDummy(raw);const lines=text.trim().split("\n");const h=lines[0].split(",");const idx={Date:h.indexOf("Date"),Open:h.indexOf("Open"),High:h.indexOf("High"),Low:h.indexOf("Low"),Close:h.indexOf("Close"),Volume:h.indexOf("Volume")};const five=new Date();five.setFullYear(five.getFullYear()-5);const rows=[];for(let i=1;i<lines.length;i++){const cols=lines[i].split(",");const d=new Date(cols[idx.Date]);if(isNaN(d))continue;if(d<five)continue;rows.push({date:cols[idx.Date],open:parseFloat(cols[idx.Open]),high:parseFloat(cols[idx.High]),low:parseFloat(cols[idx.Low]),close:parseFloat(cols[idx.Close]),volume:parseInt(cols[idx.Volume]||"0",10)})}rows.sort((a,b)=>new Date(a.date)-new Date(b.date));if(rows.length===0)return generateDummy(raw);const dates=rows.map(r=>r.date);const opens=rows.map(r=>r.open);const highs=rows.map(r=>r.high);const lows=rows.map(r=>r.low);const closes=rows.map(r=>r.close);const volumes=rows.map(r=>r.volume);const latest=closes[closes.length-1];const oldest=closes[0];const totalReturn=((latest-oldest)/oldest)*100;const highest=Math.max(...highs);const lowest=Math.min(...lows);const avgVolume=Math.round(volumes.reduce((a,b)=>a+b,0)/Math.max(volumes.length,1));return{symbol:raw.toUpperCase(),dates,opens,highs,lows,closes,volumes,stats:{latest,oldest,totalReturn,highest,lowest,avgVolume},meta:{source:"stooq.com",symbolUsed:used}}}catch(e){return generateDummy(symbol)}}
function generateDummy(symbol){const points=60;const now=new Date();const start=new Date();start.setFullYear(now.getFullYear()-5);start.setMonth(start.getMonth(),1);let price=100+Math.random()*50;const dates=[];const opens=[];const highs=[];const lows=[];const closes=[];const volumes=[];for(let i=0;i<points;i++){const d=new Date(start);d.setMonth(start.getMonth()+i,1);const drift=.002;const vol=.05;const u1=Math.random()||1e-6;const u2=Math.random()||1e-6;const z=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);const r=drift+vol*z;const next=Math.max(1,price*Math.exp(r));const open=price;const close=next;const spread=Math.max(.5,Math.abs(next-price)*(.6+Math.random()*.8));const high=Math.max(open,close)+spread*.5;const low=Math.min(open,close)-spread*.5;const volume=Math.round(1e7*(.8+Math.random()*.6));dates.push(d.toISOString().slice(0,10));opens.push(+open.toFixed(2));highs.push(+high.toFixed(2));lows.push(+low.toFixed(2));closes.push(+close.toFixed(2));volumes.push(volume);price=next}const latest=closes[closes.length-1];const oldest=closes[0];const totalReturn=((latest-oldest)/oldest)*100;const highest=Math.max(...highs);const lowest=Math.min(...lows);const avgVolume=Math.round(volumes.reduce((a,b)=>a+b,0)/Math.max(volumes.length,1));return{symbol:symbol.trim().toUpperCase(),dates,opens,highs,lows,closes,volumes,stats:{latest,oldest,totalReturn,highest,lowest,avgVolume},meta:{source:"simulated"}}}
function displayStock(stock){const labels=formatLabels(stock.dates);renderChart(stock.symbol,labels,stock.closes,stock.stats)}
async function searchStock(){const symbol=stockSymbolInput.value.trim();if(!symbol){resultsContent.innerHTML=`<div class="loading">Enter a stock symbol</div>`;return}resultsContent.innerHTML=`<div class="loading">Fetching ${symbol.toUpperCase()} data...</div>`;const data=await fetchStockData(symbol);displayStock(data)}
function initUI(){
  resultsPanel=document.getElementById("resultsPanel");
  chartsPanel=document.getElementById("chartsPanel");
  stockSymbolInput=document.getElementById("stockSymbolInput");
  searchStockButton=document.getElementById("searchStockButton");
  chatMessages=document.getElementById("chatMessages");
  chatInput=document.getElementById("chatInput");
  sendButton=document.getElementById("sendButton");
  roiCalcButton=document.getElementById("roiCalcButton");
  ciCalcButton=document.getElementById("ciCalcButton");
  document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>displayInvestment(b.getAttribute("data-topic"))));
  document.querySelectorAll(".topic-tag").forEach(t=>t.addEventListener("click",()=>{const topic=t.getAttribute("data-topic");const q=investmentData[topic]?investmentData[topic].title.toLowerCase():topic;if(chatInput){chatInput.value=`Tell me about ${q}`;} if(sendButton){sendButton.click();}}));
  if(searchStockButton)searchStockButton.addEventListener("click",searchStock);
  if(stockSymbolInput)stockSymbolInput.addEventListener("keypress",e=>{if(e.key==="Enter")searchStock()});
  if(sendButton)sendButton.addEventListener("click",()=>{const q=(chatInput?.value||"").trim();if(!q)return;addMessage(q,true);if(chatInput)chatInput.value="";setTimeout(()=>{const resp=processQuery(q);addMessage(resp,false)},400)});
  if(chatInput)chatInput.addEventListener("keypress",e=>{if(e.key==="Enter")sendButton?.click()});
  if(roiCalcButton)roiCalcButton.addEventListener("click",()=>displayCalculator('roi'));
  if(ciCalcButton)ciCalcButton.addEventListener("click",()=>displayCalculator('compound'));
  displayInvestment("stocks");
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",initUI)}else{initUI()}

function addMessage(text,isUser=false){/* No-op: left pane should not scroll or accumulate messages */ return}

function processQuery(query){
  const q=query.toLowerCase();
  const map={
    "stocks":["stock","stocks","equity","share","shares","stock market"],
    "bonds":["bond","bonds","treasury","government bond","corporate bond"],
    "mutual-funds":["mutual fund","mutual funds","fund"],
    "etf":["etf","exchange-traded fund","exchange traded fund"],
    "real-estate":["real estate","property","reit","rental property","real estate investment"],
    "crypto":["crypto","cryptocurrency","bitcoin","ethereum","blockchain","digital currency"],
    "savings-accounts":["savings account","savings","bank account","high yield savings"],
    "retirement-accounts":["retirement","401k","ira","roth","retirement account","pension"]
  };
  for(const [key,keywords] of Object.entries(map)){
    if(keywords.some(k=>q.includes(k))){displayInvestment(key);return `Here's information about ${investmentData[key].title.toLowerCase()}. See the right pane for details.`}
  }
  if(q.includes("type")&&(q.includes("investment")||q.includes("invest"))){
    const types=Object.values(investmentData).map(v=>v.title).join(", ");
    return `Common investment types include: ${types}. Choose any to learn more.`;
  }
  return `I can explain various investment types and show a stock’s 5-year trend. Try asking about a specific type like “Tell me about bonds”.`;
}

async function attachFeedback(item_type,item_key,container){
  const up=container.querySelector('#fb-up');
  const down=container.querySelector('#fb-down');
  const score=container.querySelector('#fb-score');
  function getKey(t,k){return `feedback:${t}:${k}`;}
  function read(t,k){try{return JSON.parse(localStorage.getItem(getKey(t,k))||'{}');}catch{return {}}}
  function write(t,k,obj){localStorage.setItem(getKey(t,k),JSON.stringify(obj))}
  function refresh(){
    const data=read(item_type,item_key);
    const h=data.helpful||0;
    const nh=data.notHelpful||0;
    const total=h+nh;
    if(total===0){score.textContent='No feedback yet';}
    else{
      const pct=Math.round((h/total)*100);
      score.textContent=`${pct}% helpful (${h} 👍 / ${nh} 👎)`;
    }
  }
  function send(helpful){
    const data=read(item_type,item_key);
    if(helpful){data.helpful=(data.helpful||0)+1;} else {data.notHelpful=(data.notHelpful||0)+1;}
    write(item_type,item_key,data);
    refresh();
  }
  if(up)up.addEventListener('click',()=>send(true));
  if(down)down.addEventListener('click',()=>send(false));
  refresh();
}

function displayCalculator(type){
  if(type==='roi'){
    const html=`<div class="card">
      <div class="card-header"><div class="card-title">ROI Calculator</div></div>
      <div class="form">
        <div><div class="stat-label">Initial Investment</div><input id="roiCost" type="number" placeholder="1000"></div>
        <div><div class="stat-label">Final Value</div><input id="roiValue" type="number" placeholder="1500"></div>
        <div><div class="stat-label">Years</div><input id="roiYears" type="number" placeholder="1"></div>
        <div><button id="roiRun" class="run-btn">Compute</button></div>
      </div>
      <div class="chart"><canvas id="stockChart"></canvas></div>
    </div>`;
    addCard(html);
    const btn=document.getElementById('roiRun');
    if(btn)btn.addEventListener('click',()=>{
      const cost=parseFloat(document.getElementById('roiCost').value||'0');
      const value=parseFloat(document.getElementById('roiValue').value||'0');
      const years=parseFloat(document.getElementById('roiYears').value||'1');
      const roi=cost>0?((value-cost)/cost)*100:0;
      const annual=years>0?(((value/cost)**(1/years))-1)*100:0;
      const labels=['Cost','Value'];
      const data=[cost,value];
      if(stockChart)stockChart.destroy();
      const ctx=document.getElementById('stockChart').getContext('2d');
      stockChart=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Amount',data,borderColor:'#667eea',backgroundColor:'rgba(102,126,234,.3)'}]},options:{plugins:{title:{display:true,text:`ROI: ${roi.toFixed(2)}% • Annualized: ${annual.toFixed(2)}%`}}}});
    });
    return;
  }
  const html=`<div class="card">
    <div class="card-header"><div class="card-title">Compound Interest</div></div>
    <div class="form">
      <div><div class="stat-label">Principal</div><input id="ciPrincipal" type="number" placeholder="1000"></div>
      <div><div class="stat-label">Annual Rate (%)</div><input id="ciRate" type="number" placeholder="8"></div>
      <div><div class="stat-label">Years</div><input id="ciYears" type="number" placeholder="10"></div>
      <div><div class="stat-label">Monthly Contribution</div><input id="ciMonthly" type="number" placeholder="100"></div>
      <div><button id="ciRun" class="run-btn">Compute</button></div>
    </div>
    <div class="chart"><canvas id="stockChart"></canvas></div>
  </div>`;
  addCard(html);
  const btn=document.getElementById('ciRun');
  if(btn)btn.addEventListener('click',()=>{
    const P=parseFloat(document.getElementById('ciPrincipal').value||'0');
    const r=parseFloat(document.getElementById('ciRate').value||'0')/100;
    const years=parseFloat(document.getElementById('ciYears').value||'0');
    const m=parseFloat(document.getElementById('ciMonthly').value||'0');
    const n=12;
    const months=Math.round(years*n);
    let balance=P;
    const labels=[];
    const series=[];
    for(let i=0;i<=months;i++){
      labels.push(`M${i}`);
      series.push(+balance.toFixed(2));
      const monthlyRate=r/n;
      balance=balance*(1+monthlyRate)+m;
    }
    if(stockChart)stockChart.destroy();
    const ctx=document.getElementById('stockChart').getContext('2d');
    const finalText='Final balance: $'+series[series.length-1].toLocaleString();
    stockChart=new Chart(ctx,{
      type:'line',
      data:{
        labels:labels,
        datasets:[{
          label:'Balance',
          data:series,
          borderColor:'#10b981',
          backgroundColor:'rgba(16,185,129,.15)',
          fill:true,
          tension:0.1
        }]
      },
      options:{
        plugins:{title:{display:true,text:finalText}},
        scales:{x:{ticks:{maxTicksLimit:12}}}
      }
    });
  });
}

function renderFeedback(container,item_type,item_key,title){
  const node=document.createElement('div');
  node.innerHTML=`<div class="feedback">
    <div class="feedback-header"><div><div class="list-title">${title}</div><div class="feedback-score" id="fb-score">Fetching...</div></div></div>
    <div class="feedback-actions">
      <button class="feedback-btn up" id="fb-up">👍 Helpful</button>
      <button class="feedback-btn down" id="fb-down">👎 Needs work</button>
    </div>
  </div>`;
  const el=node.firstElementChild;
  container.appendChild(el);
  attachFeedback(item_type,item_key,el);
}
