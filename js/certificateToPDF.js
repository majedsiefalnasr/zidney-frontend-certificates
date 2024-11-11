import { certificateFromForm } from './certificateFromForm.js';

/**
 * Generates a PDF from a certificate container and canvas, prompting a "Save As" dialog.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element to update.
 * @param {HTMLCanvasElement} canvasOutput - The canvas element to render as PDF.
 * @param {string} [defaultFilename="certificate"] - The default file name for the PDF.
 */
async function certificateToPDF(
  certificateContainer,
  canvasOutput,
  defaultFilename = 'certificate'
) {
  // Update certificate data from the form
  await certificateFromForm(certificateContainer, canvasOutput);

  // Get the jsPDF instance from the window object
  const { jsPDF } = window.jspdf;

  // Determine PDF orientation based on canvas dimensions
  const orientation =
    canvasOutput.width > canvasOutput.height
      ? 'landscape'
      : canvasOutput.width < canvasOutput.height
      ? 'portrait'
      : 'square';

  // Initialize jsPDF instance with settings
  const pdf = new jsPDF({
    orientation: orientation,
    unit: 'pt', // Points to match canvas dimensions
    format: 'letter', // Standard US letter paper size
  });

  // Set padding and calculate page dimensions within padding
  const padding = 0;
  const pageWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
  const pageHeight = pdf.internal.pageSize.getHeight() - 4 * padding;

  // Calculate scaling factor to fit canvas in PDF without changing aspect ratio
  const imgWidth = canvasOutput.width;
  const imgHeight = canvasOutput.height;
  const scaleFactor = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

  // Calculate scaled dimensions and offsets to center the image on the PDF page
  const scaledWidth = imgWidth * scaleFactor;
  const scaledHeight = imgHeight * scaleFactor;
  const xOffset = (pageWidth - scaledWidth) / 2 + padding;
  const yOffset = (pageHeight - scaledHeight) / 2 + padding;

  // Add the canvas as an image to the PDF with calculated position and scaling
  pdf.addImage(
    canvasOutput.toDataURL('image/png'),
    'PNG',
    xOffset,
    yOffset,
    scaledWidth,
    scaledHeight
  );

  // Generate a Blob from the PDF and prompt a "Save As" dialog
  const pdfBlob = pdf.output('blob');
  try {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${defaultFilename}.pdf`,
      types: [
        {
          description: 'PDF file',
          accept: { 'application/pdf': ['.pdf'] },
        },
      ],
    });

    const writableStream = await fileHandle.createWritable();
    await writableStream.write(pdfBlob);
    await writableStream.close();

    console.log('PDF saved successfully with custom filename.');
  } catch (error) {
    console.error('Error saving PDF:', error);
  }
}

export { certificateToPDF };
