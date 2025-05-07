// src/pdfmake.d.ts
declare module 'pdfmake/build/pdfmake' {
  const pdfMake: {
    vfs: any;
    createPdf(documentDefinition: any): {
      download(filename?: string): void;
      open(): void;
      print(): void;
    };
  };
  export = pdfMake;
}

declare module 'pdfmake/build/vfs_fonts' {
  const pdfFonts: {
    pdfMake: {
      vfs: any;
    };
  };
  export = pdfFonts;
}