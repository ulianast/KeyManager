'use strict';

import PDFDocument  from 'pdfkit';


export function genServiceCodePdfAndPipeToHttp(httpResp, serviceCode) {
  const doc = new PDFDocument();

  var filename = encodeURIComponent(serviceCode) + '.pdf';

  httpResp.setHeader('Content-disposition', 'inline; filename="' + filename + '"');

  httpResp.setHeader('Content-type', 'application/pdf');
  httpResp.setHeader('Access-Control-Allow-Origin', '*');

  doc.pipe(httpResp);


    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);

    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);
    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);
    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);
    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);
    // doc.fontSize(25)
    // .text('Here is some vector graphics...', 100, 50);
    doc.fontSize(25)
    .text('Here is some vector graphics...', 100, 50);

  
  doc.end();
}