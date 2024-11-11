import { certificateFromForm } from './certificateFromForm.js';
import { downloadFile } from './utilities.js';

/**
 * Generates a certificate JSON file from session data and downloads it.
 *
 * @param {HTMLElement} certificateContainer - The container element for the certificate form.
 * @param {string} [filename='certificate.json'] - The name of the JSON file to be downloaded.
 * @returns {Promise<void>} Resolves once the JSON file has been generated and downloaded.
 *
 * @example
 * // Generate and download a certificate JSON file
 * const certificateContainer = document.getElementById('certificateForm');
 * certificateToJSON(certificateContainer, 'certificateData');
 */
async function certificateToJSON(
  certificateContainer,
  certificatePreview,
  filename = 'certificate'
) {
  // Update certificate data from the form
  await certificateFromForm(certificateContainer, certificatePreview);

  // Construct the certificate data object
  const data = {
    settings: getCertificateSettings(),
    theme: getCertificateTheme(),
    content: sessionStorage.getItem('certificateContent'),
  };

  // Adjust data based on theme conditions
  adjustDataByTheme(data);

  // Convert data to a pretty-printed JSON string
  const jsonData = JSON.stringify(data, null, 2);

  // Generate and trigger the download of a JSON file
  downloadFile(jsonData, filename, 'application/json');
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

export { certificateToJSON };
