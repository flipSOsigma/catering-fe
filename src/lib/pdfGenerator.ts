import { OrderData, Portion, Section } from './d/type';
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

export const generateCateringPDF = (order: OrderData) => {
  // Helper function to safely get portions from a section
  const getPortions = (sectionName: string): Portion[] => {
    const section = order.sections.find(s => s.section_name === sectionName);
    return section?.portions || [];
  };

  // Format date as "Semarang, 1 Januari 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return `Semarang, ${date.toLocaleDateString('id-ID', options)}`;
  };

  // Format number as "Rp200.000"
  const formatCurrency = (number: number): string => {
    return `Rp${number.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
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

      {
        table: {
          widths: ['auto', 250, 'auto', '*'],
          body: [
            [
              { text: 'Undangan', fontSize:11 },
              { text: `: ${order.invitation}` || '-', fontSize: 11 },
              { text: 'Estimasi Tamu', fontSize:11 },
              { text: `: ${order.visitor}`, fontSize: 11 }
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

      // Filter sections to only include those with portions
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
        ))
    ]
  };

  try {
    pdf.createPdf(docDefinition).download(`Invoice_${order.event_name}.pdf`);
  } catch (error) {
    console.error('PDF generation failed:', error);
    throw new Error('Failed to generate PDF');
  }
};