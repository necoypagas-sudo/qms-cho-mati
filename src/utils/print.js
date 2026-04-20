export function printTicket({ number, service, time, queue, phone }) {
  const w = window.open("", "_blank", "width=300,height=520");
  w.document.write(`
    <html><head><title>Queue Ticket</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Share Tech Mono',monospace; width:58mm; padding:4mm; font-size:11px; }
      .center { text-align:center; }
      .num { font-size:52px; font-weight:900; letter-spacing:4px; }
      hr { border:none; border-top:1px dashed #000; margin:5px 0; }
      .row { display:flex; justify-content:space-between; margin-bottom:2px; }
    </style></head>
    <body>
      <div class="center">
        <div style="font-size:13px;font-weight:bold;">CITY HEALTH OFFICE</div>
        <div style="font-size:10px;">Mati, Davao Oriental</div>
      </div>
      <hr/>
      <div class="center">
        <div style="font-size:10px;letter-spacing:2px;margin-bottom:4px;">QUEUE NUMBER</div>
        <div class="num">${number}</div>
        <div style="font-size:13px;font-weight:bold;margin-top:4px;">${service.label.toUpperCase()}</div>
        <div style="font-size:10px;">Window ${service.window}</div>
      </div>
      <hr/>
      <div class="row"><span>Date:</span><span>${new Date(time).toLocaleDateString("en-PH")}</span></div>
      <div class="row"><span>Time:</span><span>${new Date(time).toLocaleTimeString("en-PH")}</span></div>
      <div class="row"><span>Ahead:</span><span>${queue} patient(s)</span></div>
      ${phone ? `<div class="row"><span>SMS:</span><span>${phone}</span></div>` : ""}
      <hr/>
      <div class="center" style="font-size:9px;margin-top:3px;line-height:1.6;">
        Please listen for your number.<br/>
        Do not leave the waiting area.<br/>
        ─────────────────────<br/>
        Salamat sa imong pagbisita!
      </div>
    </body></html>
  `);
  w.document.close();
  setTimeout(() => { w.print(); w.close(); }, 400);
}
