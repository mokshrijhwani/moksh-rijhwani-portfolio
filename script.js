/* =========================================================
   INITIAL PAGE POSITION
   ========================================================= */

(function () {

  if (
    window.location.hash &&
    window.location.hash !== "#home"
  ) {

    history.replaceState(
      null,
      document.title,
      window.location.pathname +
      window.location.search
    );

  }

  window.scrollTo(0, 0);

})();


/* =========================================================
   LOADER
   ========================================================= */

const loader =
  document.getElementById("loader");

const percent =
  document.getElementById("loaderPercent");

const status =
  document.getElementById("loaderStatus");


window.addEventListener("load", () => {

  const start = performance.now();

  const duration = 3300;

  const statuses = [
    "INITIALIZING",
    "LOADING PROFILE",
    "LOADING EXPERIENCE",
    "LOADING SKILLS",
    "LOADING PROJECTS",
    "FINALIZING SYSTEM"
  ];


  function tick(now) {

    const progress =
      Math.min(
        (now - start) / duration,
        1
      );

    const value =
      Math.round(progress * 100);


    if (percent) {

      percent.textContent =
        String(value).padStart(2, "0") +
        "%";

    }


    if (status) {

      const index =
        Math.min(
          Math.floor(
            progress * statuses.length
          ),
          statuses.length - 1
        );

      status.textContent =
        statuses[index];

    }


    if (progress < 1) {

      requestAnimationFrame(tick);

    }

  }


  requestAnimationFrame(tick);


  setTimeout(() => {

    history.replaceState(
      null,
      document.title,
      window.location.pathname +
      window.location.search +
      "#home"
    );


    window.scrollTo({
      top:0,
      left:0,
      behavior:"instant"
    });


    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;


    loader?.classList.add("done");

    document.body.classList.add(
      "site-ready"
    );

  }, duration + 100);

});


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menu =
  document.querySelector(".menu");

const nav =
  document.querySelector("nav");


menu?.addEventListener(
  "click",
  () => {

    nav?.classList.toggle("open");

  }
);


document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {

        nav?.classList.remove("open");

      }
    );

  });


/* =========================================================
   HOME NAVIGATION
   ========================================================= */

document
  .querySelectorAll('a[href="#home"]')
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();

        nav?.classList.remove("open");


        history.pushState(
          null,
          document.title,
          "#home"
        );


        window.scrollTo({
          top:0,
          left:0,
          behavior:"smooth"
        });

      }
    );

  });


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

const io =
  new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "show"
          );

        }

      });

    },
    {
      threshold:0.12
    }
  );


document
  .querySelectorAll(".reveal")
  .forEach(element => {

    io.observe(element);

  });


/* =========================================================
   BACK TO TOP
   ========================================================= */

document
  .querySelectorAll('a[href="#top"]')
  .forEach(link => {

    link.addEventListener(
      "click",
      event => {

        event.preventDefault();


        history.pushState(
          null,
          document.title,
          "#home"
        );


        window.scrollTo({
          top:0,
          left:0,
          behavior:"smooth"
        });

      }
    );

  });


/* =========================================================
   LOGO ERROR PROTECTION
   ========================================================= */

document
  .querySelectorAll(
    ".skills img, .logo img"
  )
  .forEach(img => {

    img.addEventListener(
      "error",
      () => {

        img.style.display = "none";


        const fallback =
          document.createElement("span");


        fallback.className =
          "logoFallback";


        fallback.textContent =
          img.alt || "LOGO";


        img.parentElement
          ?.appendChild(fallback);

      }
    );

  });


/* =========================================================
   LIVE BTCUSDT CHART
   Binance public market data: 1-minute candles + live kline stream
   ========================================================= */

(function () {
  const canvas = document.getElementById("btcChart");
  const priceEl = document.getElementById("btcPrice");
  const changeEl = document.getElementById("btcChange");
  const scaleEl = document.getElementById("marketScale");
  const statusEl = document.getElementById("btcStatus");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let candles = [];
  let liveCandle = null;
  let previousClose = null;
  let socket = null;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawChart();
  }

  function formatPrice(value) {
    return value >= 1000
      ? value.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : value.toFixed(2);
  }

  function setStatus(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function drawChart() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height || !candles.length) return;

    ctx.clearRect(0, 0, width, height);

    const visible = candles.slice(-60);
    if (liveCandle) {
      if (!visible.length || visible[visible.length - 1].time !== liveCandle.time) {
        visible.push(liveCandle);
      } else {
        visible[visible.length - 1] = liveCandle;
      }
    }

    const highs = visible.map(c => c.high);
    const lows = visible.map(c => c.low);
    const max = Math.max(...highs);
    const min = Math.min(...lows);
    const range = Math.max(max - min, 1);
    const padTop = 18;
    const padBottom = 18;
    const chartHeight = height - padTop - padBottom;
    const step = width / Math.max(visible.length, 1);
    const candleWidth = Math.max(3, Math.min(8, step * 0.58));

    function y(value) {
      return padTop + ((max - value) / range) * chartHeight;
    }

    visible.forEach((c, i) => {
      const x = i * step + step / 2;
      const openY = y(c.open);
      const closeY = y(c.close);
      const highY = y(c.high);
      const lowY = y(c.low);
      const up = c.close >= c.open;

      ctx.strokeStyle = up ? "#54c48a" : "#d85d42";
      ctx.fillStyle = up ? "#54c48a" : "#d85d42";
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 1.5);
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    const last = visible[visible.length - 1];
    const lastY = y(last.close);
    ctx.strokeStyle = "#ff6a00";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(0, lastY);
    ctx.lineTo(width, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (scaleEl) {
      const mid = min + range / 2;
      scaleEl.innerHTML =
        formatPrice(max) + "<br><br>" +
        formatPrice(mid) + "<br><br>" +
        formatPrice(min);
    }
  }

  async function loadHistory() {
    setStatus("LOADING");
    const response = await fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=60",
      { cache: "no-store" }
    );

    if (!response.ok) throw new Error("Unable to load BTC data");

    const rows = await response.json();
    candles = rows.map(row => ({
      time: row[0],
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4])
    }));

    if (candles.length) {
      previousClose = candles.length > 1
        ? candles[candles.length - 2].close
        : candles[candles.length - 1].open;

      const last = candles[candles.length - 1];
      priceEl.textContent = "$" + formatPrice(last.close);
      drawChart();
    }

    setStatus("LIVE");
  }

  function connectStream() {
    if (socket) socket.close();

    socket = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
    );

    socket.onopen = () => setStatus("LIVE");

    socket.onmessage = event => {
      const payload = JSON.parse(event.data);
      const k = payload.k;

      liveCandle = {
        time: k.t,
        open: Number(k.o),
        high: Number(k.h),
        low: Number(k.l),
        close: Number(k.c)
      };

      const change = previousClose
        ? ((liveCandle.close - previousClose) / previousClose) * 100
        : 0;

      if (priceEl) priceEl.textContent = "$" + formatPrice(liveCandle.close);
      if (changeEl) {
        changeEl.textContent = (change >= 0 ? "+" : "") + change.toFixed(2) + "%";
      }

      drawChart();

      if (k.x) {
        candles.push(liveCandle);
        candles = candles.slice(-60);
        previousClose = liveCandle.close;
        liveCandle = null;
      }
    };

    socket.onerror = () => setStatus("RECONNECTING");

    socket.onclose = () => {
      setStatus("RECONNECTING");
      setTimeout(connectStream, 3000);
    };
  }

  loadHistory()
    .then(connectStream)
    .catch(() => setStatus("OFFLINE"));

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
})();
