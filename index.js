function plotGraph(stocksInfo, timeFrame) {
  let TESTER = document.getElementById("graph");
  let tmFr = timeFrame;
  let timeStamp = [
    1687354200, 1687440600, 1687527000, 1687786200, 1687872600, 1687959000,
    1688045400, 1688131800, 1688391000, 1688563800, 1688650200, 1688736600,
    1688995800, 1689082200, 1689168600, 1689255000, 1689341400, 1689600600,
    1689687000, 1689773400, 1689859800, 1689963778,
  ];
  let time = timeStamp.map((res) => new Date(res * 1000));
  let stocksData = [
    183.9600067138672, 187, 186.67999267578125, 185.27000427246094,
    188.05999755859375, 189.25, 189.58999633789062, 193.97000122070312,
    192.4600067138672, 191.3300018310547, 191.80999755859375,
    190.67999267578125, 188.61000061035156, 188.0800018310547,
    189.77000427246094, 190.5399932861328, 190.69000244140625,
    193.99000549316406, 193.72999572753906, 195.10000610351562,
    193.1300048828125, 192.78990173339844,
  ];

  if (stocksInfo) {
    if (tmFr) {
    } else {
      tmFr = "1mo";
    }
    timeStamp = stocksInfo[tmFr].timeStamp;
    time = timeStamp.map((res) => new Date(res * 1000));
    stocksData = stocksInfo[tmFr].value;
  }

  Plotly.newPlot(
    TESTER,
    [
      {
        x: time,
        y: stocksData,
      },
    ],
    {
      margin: { t: 0 },
    }
  );
}

plotGraph();

const stockProfileInfo = async () => {
  try {
    const getInfo = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstocksprofiledata"
    );
    const info = await getInfo.json();
    const data = info.stocksProfileData[0];

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const list = async () => {
  try {
    const getInfo = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstockstatsdata"
    );
    const info = await getInfo.json();

    const data = info.stocksStatsData[0];

    const listDiv = document.getElementById("listDiv");

    for (let i in data) {
      let ele;
      if (i !== "_id") {
        if (data[i].profit > 0) {
          ele = `
            <div style="color:green" class="lossGain">
              ${data[i].profit}
            </div>`;
        } else if (data[i].profit <= 0) {
          ele = `  <div style="color:red" class="lossGain">
              ${data[i].profit}
            </div>`;
        }
        const element = `
          <div class="cmpName">${i}</div> 
          <div class="currentPrice"> ${data[i].bookValue}</div>
          ${ele}
         
          <br>`;

        listDiv.insertAdjacentHTML("beforeend", element);
      }
    }

    // Add event listener to each cmpName element
    const getCmp = document.querySelectorAll(".cmpName");
    getCmp.forEach((cmp) => {
      cmp.addEventListener("click", (res) => {
        changeDesc(res.target.innerText, res);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
};

list();
const changeDesc = async (companyName, cmpInfo) => {
  try {
    const name = cmpInfo.target.innerText;
    const price = cmpInfo.target.nextElementSibling.textContent;
    const lossGain =
      cmpInfo.target.nextElementSibling.nextElementSibling.textContent;
    const getNameSpan = document.getElementById("name");
    const getProfitSpan = document.getElementById("profit");
    const getPriceSpan = document.getElementById("price");
    const getPara = document.querySelector("p");

    getNameSpan.innerText = name;

    getProfitSpan.innerText = lossGain;

    getPriceSpan.innerText = price;

    const info = await stockProfileInfo();

    let data;
    for (let i in info) {
      if (i == companyName) {
        data = info[i];
        break;
      }
    }
    getPara.innerText = data.summary;
    const button = document.querySelectorAll(".timeSpan");

    button.forEach((res) => {
      res.addEventListener("click", (e) => {
        if (e.target.innerText == "1 Month") {
          fetchStocksData(companyName, "1mo");
        } else if (e.target.innerText == "3 Month") {
          fetchStocksData(companyName, "3mo");
        } else if (e.target.innerText == "1 Year") {
          fetchStocksData(companyName, "1y");
        } else if (e.target.innerText == "5 Year") {
          fetchStocksData(companyName, "5y");
        }
      });
    });
    fetchStocksData(companyName, "1mo");
  } catch (error) {
    console.log(error.message);
  }
};

const fetchStocksData = async (companyName, time) => {
  try {
    const data = await fetch(
      "https://stocks3.onrender.com/api/stocks/getstocksdata"
    );

    const jsonInfo = await data.json();
    const jsnData = jsonInfo.stocksData[0];
    let stocksData;

    for (let i in jsnData) {
      if (i == companyName) {
        stocksData = jsnData[i];
        break;
      }
    }

    plotGraph(stocksData, time);
  } catch (error) {
    console.log(error.message);
  }
};
