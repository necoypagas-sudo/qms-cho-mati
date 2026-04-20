// src/utils/printTicket.js
// Thermal-style 58mm print ticket

export function printTicket({ fullTicketNumber, patientName, visitPurpose, stationName, issuedAt, isPriority, organizationName, organizationLocation }) {
  const w = window.open("", "_blank", "width=320,height=560");
  const time = issuedAt
    ? (issuedAt.toDate ? issuedAt.toDate() : new Date(issuedAt))
    : new Date();

  w.document.write(`
    <html>
    <head>
      <title>Queue Ticket</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Share Tech Mono', 'Courier New', monospace;
          width: 58mm;
          padding: 4mm 3mm;
          font-size: 11px;
          color: #000;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .num { font-size: 52px; font-weight: 900; letter-spacing: 3px; line-height: 1; }
        hr { border: none; border-top: 1px dashed #000; margin: 5px 0; }
        .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .priority-badge {
          background: #000; color: #fff;
          padding: 2px 6px; font-size: 10px; font-weight: bold;
          display: inline-block; margin-bottom: 4px; letter-spacing: 1px;
        }
      </style>
    </head>
    <body>
      <div class="center">
        <div class="bold" style="font-size:13px;">${organizationName || 'CITY HEALTH OFFICE'}</div>
        <div>${organizationLocation || 'Mati, Davao Oriental'}</div>
        <div style="font-size:9px;">Quezon St., Brgy. Central, City of Mati</div>
      </div>
      <hr/>
      <div class="center">
        ${isPriority ? '<div class="priority-badge">★ PRIORITY</div>' : ''}
        <div style="font-size:10px;letter-spacing:3px;margin-bottom:4px;">QUEUE NUMBER</div>
        <div class="num">${fullTicketNumber}</div>
        <div class="bold" style="margin-top:6px;font-size:12px;">${visitPurpose || ''}</div>
        <div style="font-size:10px;">${stationName || 'Triage Desk'}</div>
      </div>
      <hr/>
      ${patientName && patientName !== 'Patient' ? `<div class="row"><span>Name:</span><span>${patientName}</span></div>` : ''}
      <div class="row">
        <span>Date:</span>
        <span>${time.toLocaleDateString('en-PH')}</span>
      </div>
      <div class="row">
        <span>Time:</span>
        <span>${time.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <hr/>
      <div class="center" style="font-size:9px;line-height:1.7;">
        Palihug pamati sa pagbuot<br/>
        sa imong numero.<br/>
        Ayaw mobiya sa waiting area.<br/>
        ─────────────────────<br/>
        Salamat sa imong pagbisita!<br/>
        cho.mati@gmail.com<br/>
        (087) 811 4331
      </div>
    </body>
    </html>
  `);
  w.document.close();
  setTimeout(() => { w.print(); w.close(); }, 500);
}
