import { certificateFromForm } from './certificateFromForm.js';

/**
 * Exports the certificate data in the specified format, prompting a "Save As" dialog.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element to update.
 * @param {HTMLCanvasElement} canvasOutput - The canvas element to render as PDF or image.
 * @param {string} format - The desired file format ('pdf', 'png', 'jpeg', or 'json').
 * @param {string} [defaultFilename="certificate"] - The default file name.
 */
async function exportCertificate(
  certificateContainer,
  canvasOutput,
  format = 'pdf',
  defaultFilename = 'certificate'
) {
  // Update certificate data from the form
  // await certificateFromForm(certificateContainer, canvasOutput);

  try {
    let fileHandle;
    let fileData;
    let mimeType;

    // Determine actions based on the selected format
    if (format === 'pdf') {
      const { jsPDF } = window.jspdf;
      const orientation =
        canvasOutput.width > canvasOutput.height ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'pt',
        format: 'letter',
      });

      const padding = 0;
      const pageWidth = pdf.internal.pageSize.getWidth() - 2 * padding;
      const pageHeight = pdf.internal.pageSize.getHeight() - 4 * padding;
      const imgWidth = canvasOutput.width;
      const imgHeight = canvasOutput.height;
      const scaleFactor = Math.min(
        pageWidth / imgWidth,
        pageHeight / imgHeight
      );
      const scaledWidth = imgWidth * scaleFactor;
      const scaledHeight = imgHeight * scaleFactor;
      const xOffset = (pageWidth - scaledWidth) / 2 + padding;
      const yOffset = (pageHeight - scaledHeight) / 2 + padding;

      pdf.addImage(
        canvasOutput.toDataURL('image/png'),
        'PNG',
        xOffset,
        yOffset,
        scaledWidth,
        scaledHeight
      );

      fileData = pdf.output('blob');
      mimeType = 'application/pdf';
      fileHandle = await window.showSaveFilePicker({
        suggestedName: `${defaultFilename}.pdf`,
        types: [
          { description: 'PDF file', accept: { 'application/pdf': ['.pdf'] } },
        ],
      });
    } else if (format === 'png' || format === 'jpeg') {
      mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      fileData = await (await fetch(canvasOutput.toDataURL(mimeType))).blob();
      fileHandle = await window.showSaveFilePicker({
        suggestedName: `${defaultFilename}.${format}`,
        types: [
          {
            description: `${format.toUpperCase()} file`,
            accept: { [mimeType]: [`.${format}`] },
          },
        ],
      });
    } else if (format === 'json') {
      const data = {
        settings: getCertificateSettings(),
        theme: getCertificateTheme(),
        content: sessionStorage.getItem('certificateContent'),
      };
      adjustDataByTheme(data);
      fileData = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      mimeType = 'application/json';
      fileHandle = await window.showSaveFilePicker({
        suggestedName: `${defaultFilename}.json`,
        types: [
          {
            description: 'JSON file',
            accept: { 'application/json': ['.json'] },
          },
        ],
      });
    } else {
      throw new Error(
        "Unsupported format. Please choose 'pdf', 'png', 'jpeg', or 'json'."
      );
    }

    // Create a writable stream and write the file data
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(fileData);
    await writableStream.close();

    console.log(`Certificate saved successfully as ${format.toUpperCase()}.`);
  } catch (error) {
    console.error('Error exporting certificate:', error);
  }
}

/**
 * Retrieves certificate settings from session storage.
 * @returns {Object} An object containing the certificate settings.
 */
function getCertificateSettings() {
  return {
    TYPE: sessionStorage.getItem('certificateType'),
    LANGUAGE: sessionStorage.getItem('certificateLanguage'),
    ORIENTATION: sessionStorage.getItem('certificateOrientation'),
  };
}

/**
 * Retrieves certificate theme data from session storage.
 * @returns {Object} An object containing the theme settings.
 */
function getCertificateTheme() {
  return {
    NAME: sessionStorage.getItem('certificateTheme'),
    BACKGROUND_COLOR: sessionStorage.getItem('certificateBackgroundColor'),
    BORDER_COLOR: sessionStorage.getItem('certificateBorderColor'),
    BORDER_ACCENT_COLOR: sessionStorage.getItem('certificateBorderAccentColor'),
    SIDE_IMAGE_POSITION: sessionStorage.getItem('certificateSideImagePosition'),
    SIDE_IMAGE: sessionStorage.getItem('certificateSideImage'),
    BACKGROUND_IMAGE: sessionStorage.getItem('certificateBackgroundImage'),
  };
}

/**
 * Adjusts the certificate theme data based on specific conditions.
 * @param {Object} data - The certificate data object to adjust.
 */
function adjustDataByTheme(data) {
  const theme = data.theme;
  const themeType = theme.NAME;

  if (themeType !== 'withBackgroundImage') {
    theme.BACKGROUND_IMAGE = '';
  }

  if (
    themeType === 'borderWithoutSideImage' ||
    themeType === 'withoutSideImage'
  ) {
    theme.SIDE_IMAGE_POSITION = '';
    theme.SIDE_IMAGE = '';
  }

  if (themeType === 'withSideImage' || themeType === 'withoutSideImage') {
    theme.BORDER_COLOR = '';
    theme.BORDER_ACCENT_COLOR = '';
  }

  if (themeType === 'withBackgroundImage') {
    theme.BACKGROUND_COLOR = '';
    theme.BORDER_COLOR = '';
    theme.BORDER_ACCENT_COLOR = '';
    theme.SIDE_IMAGE_POSITION = '';
    theme.SIDE_IMAGE = '';
  }
}

export { exportCertificate };
