import { OrderData, Portion} from './d/type';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Initialize pdfmake
const initializePdfMake = () => {
  const pdf = pdfMake;
  if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
    pdf.vfs = pdfFonts.pdfMake.vfs;
  } else {
    console.warn('pdfFonts not properly loaded - using empty vfs');
    pdf.vfs = {};
  }
  return pdf;
};

const pdf = initializePdfMake();

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return `Semarang, ${date.toLocaleDateString('id-ID', options)}`;
};

const formatCurrency = (number: number): string => {
  return `Rp${number.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const generateCateringPDF = (order: OrderData) => {

  const getPortions = (sectionName: string): Portion[] => {
    const section = order.sections.find(s => s.section_name === sectionName);
    return section?.portions || [];
  };

  console.log(order)

  const sectionName = ['Buffet', 'Menu Pondokan', 'Dessert', 'Akad'];

  const docDefinition = {
    content: [
      { 
        text: 'Anisa Catering\nSnack & Kue Kering', 
        fontSize: 15,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        bold: true
      },
      { 
        text: 'Jl. Cemara Raya No. 37 Banyumanik - Semarang\nTelp. (024) 76403307 & 08156693587',
        alignment: 'center',
        fontSize: 10,
        margin: [0, 0, 0, 0]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0, 
            lineWidth: 1,
            lineColor: '#000000' 
          }
        ],
        margin: [0, 10, 0, 10]
      },
      {
        table: {
          widths: ['auto', 250, 'auto', '*'],
          body: [
            [
              { text: 'Pemesan', fontSize:11 },
              { text: `: ${order.customer.customer_name}` || '-', fontSize: 11 },
              { text: 'Hari, Tgl', fontSize:11 },
              { text: `: ${formatDate(order.event.event_date)}`, fontSize: 11 }
            ],
            [
              { text: 'Alamat', fontSize:11 },
              { text: `: ${order.event.event_location}` || '-', fontSize: 11 },
              { text: 'Gedung', fontSize:11 },
              { text: `: ${order.event.event_building}` || '-', fontSize: 11 }
            ],
            [
              { text: 'No. Telp', fontSize:11 },
              { text: `: ${order.customer.customer_phone}` || '-', fontSize: 11 },
              { text: 'Jam', fontSize:11 },
              { text: `: ${order.event.event_time}` || '-', fontSize: 11 }
            ],
            [
              { text: 'Email', fontSize:11 },
              { text: `: ${order.customer.customer_email}` || '-', fontSize: 11 },
              { text: 'Acara', fontSize:11 },
              { text: `: ${order.event.event_category}` || '-', fontSize: 11 }
            ]
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 0]
      },

      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0,
            lineWidth: 1,
            lineColor: '#000000' 
          }
        ],
        margin: [0, 10, 0, 10]
      },

      ...order.event.event_category === "Wedding" ? [
        {
          table: {
            widths: ['auto', 250, 'auto', '*'],
            body: [
              [
                { text: 'Undangan', fontSize:11 },
                { text: `: ${order.invitation}`, fontSize:11 },
                { text: 'Estimasi Tamu', fontSize:11 },
                { text: `: ${order.visitor}`, fontSize:11 },
              ],
            ]
          },
          layout: 'noBorders',
          margin: [0, 0, 0, 0]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0, y1: 0,
              x2: 515, y2: 0,
              lineWidth: 1,
              lineColor: '#000000' 
            }
          ],
          margin: [0, 10, 0, 10]
        },
      ] : [],

      ...sectionName
        .filter(sectionName => {
          const section = order.sections.find(s => s.section_name === sectionName);
          return section && section.portions && section.portions.length > 0;
        })
        .flatMap((section) => (
          [
            {
              text: section,
              margin: [0, 10, 0, 10],
              fontSize: 14,
              bold: true
            },
            {
              table: {
                widths: ['auto', '*', 150, '*', '*', '*'],
                body: [
                  [
                    {text: ' ', fontSize: 11, margin: [0, 0, 0 ,10] },
                    {text: 'Nama Menu', fontSize: 11, margin: [0, 0, 0 ,10], bold: true},
                    {text: 'Catatan menu', fontSize: 11, margin: [0, 0, 0 ,10]},
                    {text: 'porsi', fontSize: 11, margin: [0, 0, 0 ,10]},
                    {text: 'harga /porsi', fontSize: 11, margin: [0, 0, 0 ,10]},
                    {text: 'harga total', fontSize: 11, margin: [0, 0, 0 ,10]},
                  ],
                  ...getPortions(section).map((portion, index) => [
                    {text: `${index+1}. `, fontSize: 11 },
                    {text: portion.portion_name, fontSize: 11 ,bold: true},
                    {text: portion.portion_note, fontSize: 11},
                    {text: `${portion.portion_count} porsi`, fontSize: 11},
                    {text: formatCurrency(portion.portion_price), fontSize: 11},
                    {text: formatCurrency(portion.portion_total_price), fontSize: 11},
                  ]),
                  [
                    {text: ''},
                    {text: ''},
                    {text: ''},
                    {text: ''},
                    {text: 'Total', fontSize: 11, bold: true},
                    {fontSize:11, text: formatCurrency(order.sections.find(s => s.section_name === section)?.section_total_price || 0)},
                  ]
                ]
              },
              layout: 'noBorders',
              margin: [20, 0, 0, 0]
            },
            {
              text: 'Catatan',
              bold: true,
              margin: [20, 15, 0, 0]
            },
            {
              text: order.sections.find(s => s.section_name === section)?.section_note || '-',
              margin: [20, 5, 0, 0]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 515, y2: 0,
                  lineWidth: 1,
                  lineColor: '#000000' 
                }
              ],
              margin: [0, 10, 0, 10]
            },
          ]
        )),
      {
        text: 'Catatan Pesanan',
        bold: true,
        margin: [20, 15, 0, 0]
      },
      {
        text: order.note || '-',
        margin: [20, 5, 0, 0]
      },
    ]
  };

  try {
    pdf.createPdf(docDefinition).download(`Invoice - ${order.event_name} - ${formatDate(order.created_at.toString())}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};


export const generateSuratJalanPDF = (order: OrderData) => {

  const getPortions = (sectionName: string): Portion[] => {
    const section = order.sections.find(s => s.section_name === sectionName);
    return section?.portions || [];
  };

  const sectionName = ['Buffet', 'Menu Pondokan', 'Dessert', 'Akad'];

  const docDefinition = {
    content: [
      { 
        text: 'Anisa Catering\nSnack & Kue Kering', 
        fontSize: 15,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        bold: true
      },
      { 
        text: 'Jl. Cemara Raya No. 37 Banyumanik - Semarang\nTelp. (024) 76403307 & 08156693587',
        alignment: 'center',
        fontSize: 10,
        margin: [0, 0, 0, 0]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0, 
            lineWidth: 1,
            lineColor: '#000000' 
          }
        ],
        margin: [0, 10, 0, 10]
      },
      {
        table: {
          widths: ['auto', 250, 'auto', '*'],
          body: [
            [
              { text: 'Pemesan', fontSize:11 },
              { text: `: ${order.customer.customer_name}` || '-', fontSize: 11 },
              { text: 'Hari, Tgl', fontSize:11 },
              { text: `: ${formatDate(order.event.event_date)}`, fontSize: 11 }
            ],
            [
              { text: 'Alamat', fontSize:11 },
              { text: `: ${order.event.event_location}` || '-', fontSize: 11 },
              { text: 'Gedung', fontSize:11 },
              { text: `: ${order.event.event_building}` || '-', fontSize: 11 }
            ],
            [
              { text: 'No. Telp', fontSize:11 },
              { text: `: ${order.customer.customer_phone}` || '-', fontSize: 11 },
              { text: 'Jam', fontSize:11 },
              { text: `: ${order.event.event_time}` || '-', fontSize: 11 }
            ],
            [
              { text: 'Email', fontSize:11 },
              { text: `: ${order.customer.customer_email}` || '-', fontSize: 11 },
              { text: 'Acara', fontSize:11 },
              { text: `: ${order.event.event_category}` || '-', fontSize: 11 }
            ]
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 0]
      },

      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 0,
            x2: 515, y2: 0,
            lineWidth: 1,
            lineColor: '#000000' 
          }
        ],
        margin: [0, 10, 0, 10]
      },

      ...sectionName
        .filter(sectionName => {
          const section = order.sections.find(s => s.section_name === sectionName);
          return section && section.portions && section.portions.length > 0;
        })
        .flatMap((section) => (
          [
            {
              text: section,
              margin: [0, 10, 0, 10],
              fontSize: 14,
              bold: true
            },
            {
              table: {
                widths: ['auto', 200, '*', '*', '*'],
                body: [
                  [
                    {text: ' ', fontSize: 11, margin: [0, 0, 0 ,10] },
                    {text: 'Nama Menu', fontSize: 11, margin: [0, 0, 0 ,10], bold: true},
                    {text: 'porsi', fontSize: 11, margin: [0, 0, 0 ,10]},
                    {text: 'harga /porsi', fontSize: 11, margin: [0, 0, 0 ,10]},
                    {text: 'harga total', fontSize: 11, margin: [0, 0, 0 ,10]},
                  ],
                  ...getPortions(section).map((portion, index) => [
                    {text: `${index+1}. `, fontSize: 11 },
                    {text: portion.portion_name, fontSize: 11 ,bold: true},
                    {text: `${portion.portion_count} porsi`, fontSize: 11},
                    {text: formatCurrency(portion.portion_price), fontSize: 11},
                    {text: formatCurrency(portion.portion_total_price), fontSize: 11},
                  ]),
                  [
                    {text: ''},
                    {text: ''},
                    {text: ''},
                    {text: 'Total', fontSize: 11, bold: true},
                    {fontSize:11, text: formatCurrency(order.sections.find(s => s.section_name === section)?.section_total_price || 0)},
                  ]
                ]
              },
              layout: 'noBorders',
              margin: [20, 0, 0, 0]
            },
            {
              text: 'Catatan',
              bold: true,
              margin: [20, 15, 0, 0]
            },
            {
              text: order.sections.find(s => s.section_name === section)?.section_note || '-',
              margin: [20, 5, 0, 0]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 515, y2: 0,
                  lineWidth: 1,
                  lineColor: '#000000' 
                }
              ],
              margin: [0, 10, 0, 10]
            },
          ]
        )),
      {
        text: 'Catatan Pesanan',
        bold: true,
        margin: [20, 15, 0, 0]
      },
      {
        text: order.note || '-',
        margin: [20, 5, 0, 0]
      },
    ]
  };

  try {
    pdf.createPdf(docDefinition).download(`Surat Jalan - ${order.event_name} - ${formatDate(order.created_at.toString())}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const generatePDFDapur = (order: OrderData) => {

  const getPortions = (sectionName: string): Portion[] => {
    const section = order.sections.find(s => s.section_name === sectionName);
    return section?.portions || [];
  };

  const sectionName = ['Buffet', 'Menu Pondokan', 'Dessert', 'Akad'];

  const docDefinition = {
    pageOrientation: 'landscape',
    content: [
      ...sectionName
        .filter(sectionName => {
          const section = order.sections.find(s => s.section_name === sectionName);
          return section && section.portions && section.portions.length > 0;
        })
        .flatMap((section) => (
          [
            {
              table: {
                widths: ['auto', 250, 'auto', '*'],
                body: [
                  [
                    { text: 'Pemesan', fontSize:11 },
                    { text: `: ${order.customer.customer_name}` || '-', fontSize: 11 },
                    { text: 'Hari, Tgl', fontSize:11 },
                    { text: `: ${formatDate(order.event.event_date)}`, fontSize: 11 }
                  ],
                  [
                    { text: 'Gedung', fontSize:11 },
                    { text: `: ${order.event.event_building}` || '-', fontSize: 11 },
                    { text: '', fontSize:11 },
                    { text: '', fontSize: 11 }
                  ],
                  [
                    { text: 'Jam', fontSize:11 },
                    { text: `: ${subtractHours(order.event.event_time, 3)}` || '-', fontSize: 11 },
                    { text: '', fontSize:11 },
                    { text: '', fontSize: 11 }
                  ],
                  [
                    { text: 'Acara', fontSize:11 },
                    { text: `: ${order.event.event_category}` || '-', fontSize: 11 },
                    { text: '', fontSize:11 },
                    { text: '', fontSize: 11 }
                  ]
                ]
              },
              layout: 'noBorders',
              margin: [0, 0, 0, 0]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 761.89, y2: 0, // Use around 800 for full-width in landscape A4
                  lineWidth: 1,
                  lineColor: '#000000'
                }
              ],
              margin: [0, 20, 0, 20]
            },
            {
              text: section,
              margin: [0, 10, 0, 10],
              fontSize: 14,
              bold: true
            },
            {
              table: {
                widths: ['auto', '*', '*'],
                body: [
                  [
                    {text: ' ', fontSize: 20, margin: [0, 0, 0 ,10] },
                    {text: 'Nama Menu', fontSize: 20, margin: [0, 0, 0 ,10], bold: true},
                    {text: 'porsi', fontSize: 20, margin: [0, 0, 0 ,10]}
                  ],
                  ...getPortions(section).map((portion, index) => [
                    {text: `${index+1}. `, fontSize: 20 },
                    {text: portion.portion_name, fontSize: 20 ,bold: true},
                    {text: `${portion.portion_count} porsi`, fontSize: 20}
                  ]),
                ]
              },
              layout: 'noBorders',
              margin: [20, 0, 0, 0]
            },
            {
              text: 'Catatan',
              bold: true,
              margin: [20, 15, 0, 0]
            },
            {
              text: order.sections.find(s => s.section_name === section)?.section_note || '-',
              fontSize: 15,
              margin: [20, 5, 0, 0]
            },
            {
              canvas: [
                {
                  type: 'line',
                  x1: 0, y1: 0,
                  x2: 515, y2: 0,
                  lineWidth: 1,
                  lineColor: '#000000' 
                }
              ],
              margin: [0, 10, 0, 10]
            },
            {
              text: '',
              pageBreak: 'after',
            }
          ]
        )),
      (order.note == "" || order.note == null) ? [
      ] : [
        {
          text: 'Catatan Pesanan',
          bold: true,
          margin: [20, 15, 0, 0]
        },
        {
          text: order.note,
          margin: [20, 5, 0, 0],
        },
      ],
    ]
  } 

  try {
    pdf.createPdf(docDefinition).download(`Surat Dapur - ${order.event_name} - ${formatDate(order.created_at.toString())}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
}

function subtractHours(timeStr: string, hoursToSubtract: number): string {
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a date with today’s date and the given time
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);

  // Subtract hours
  date.setHours(date.getHours() - hoursToSubtract);

  // Format back to HH:mm
  const newHours = String(date.getHours()).padStart(2, '0');
  const newMinutes = String(date.getMinutes()).padStart(2, '0');

  return `${newHours}:${newMinutes}`;
}
