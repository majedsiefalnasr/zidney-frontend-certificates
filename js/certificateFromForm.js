import { getImageData, getHexWithOpacity } from './utilities.js';
import { renderToCanvas } from './utilities.js';

/**
 * Generates a certificate based on form input settings and applies them to the certificate container.
 * Updates DOM attributes, styles, and saves configuration settings to sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The HTML container where the certificate will be generated.
 * @param {HTMLCanvasElement} canvas - The canvas element where the HTML content will be rendered.
 */
async function certificateFromForm(certificateContainer, canvas) {
  // Validate form input and apply settings to certificate container
  if (!formValidate()) return;

  setCertificateType(certificateContainer);
  setCertificateLanguage();
  setOrientation(certificateContainer);
  setTheme(certificateContainer);
  setBackgroundColor(certificateContainer);
  setBorderColor(certificateContainer);
  await setSideImage(certificateContainer);
  setSideImagePosition(certificateContainer);
  await setBackgroundImage(certificateContainer);
  setCertificateContent();

  // Renders the certificate to the canvas
  await renderToCanvas(certificateContainer, canvas);

  // Enable Export to save configuration
  document.querySelector('#certificateExport > button').disabled = false;

  // Scroll to certificate preview
  document.querySelector('.certificate-preview').scrollIntoView({
    behavior: 'smooth',
  });
}

/**
 * Validates form input based on the selected theme and checks for required image file inputs.
 *
 * @returns {boolean} Returns true if validation passes; false if any required image input is missing.
 */
function formValidate() {
  const themeInput = document.getElementById('generator_theme');

  // Validate side image if theme requires it
  if (
    themeInput.value === 'borderWithSideImage' ||
    themeInput.value === 'withSideImage'
  ) {
    const sideImageInput = document.getElementById('generator_sideImage');

    // Ensure a file is selected in the side image input
    if (!sideImageInput.files.length) {
      sideImageInput.classList.add('is-invalid'); // Highlight as invalid
      sideImageInput.focus();
      return false; // Validation failed
    } else {
      sideImageInput.classList.remove('is-invalid'); // Clear invalid style
    }
  }

  // Validate background image if theme requires it
  if (themeInput.value === 'withBackgroundImage') {
    const backgroundImageInput = document.getElementById(
      'generator_backgroundImage'
    );

    // Ensure a file is selected in the background image input
    if (!backgroundImageInput.files.length) {
      backgroundImageInput.classList.add('is-invalid'); // Highlight as invalid
      backgroundImageInput.focus();
      return false; // Validation failed
    } else {
      backgroundImageInput.classList.remove('is-invalid'); // Clear invalid style
    }
  }

  return true; // Validation passed
}

/**
 * Sets the certificate type from the form input and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setCertificateType(certificateContainer) {
  const typeInput = document.getElementById('generator_type').value;
  certificateContainer.setAttribute('data-type', typeInput);
  sessionStorage.setItem('certificateType', typeInput);
}

/**
 * Sets the certificate language from the form input and stores it in sessionStorage.
 */
function setCertificateLanguage() {
  const languageInput = document.getElementById('generator_language').value;
  sessionStorage.setItem('certificateLanguage', languageInput);
}

/**
 * Sets the certificate orientation from the form input, updates the DOM element, and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setOrientation(certificateContainer) {
  const orientationInput = document.getElementById(
    'generator_orientation'
  ).value;
  certificateContainer.setAttribute('data-orientation', orientationInput);
  sessionStorage.setItem('certificateOrientation', orientationInput);
}

/**
 * Sets the theme of the certificate based on the form input, updates the DOM element, and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setTheme(certificateContainer) {
  const themeInput = document.getElementById('generator_theme').value;
  certificateContainer.setAttribute('data-theme', themeInput);
  document
    .getElementById('customThemeSettings')
    .setAttribute('data-theme', themeInput);
  sessionStorage.setItem('certificateTheme', themeInput);
}

/**
 * Sets the background color of the certificate based on the form input, applies it to the DOM element, and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setBackgroundColor(certificateContainer) {
  const backgroundColor = document.getElementById(
    'generator_backgroundColor'
  ).value;
  certificateContainer.style.setProperty('--background-color', backgroundColor);
  sessionStorage.setItem('certificateBackgroundColor', backgroundColor);
}

/**
 * Sets the border color and accent color of the certificate, applies it to the DOM element, and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setBorderColor(certificateContainer) {
  const borderColor = document.getElementById('generator_borderColor').value;
  certificateContainer.style.setProperty('--border-color', borderColor);
  certificateContainer.style.setProperty(
    '--border-accent-color',
    getHexWithOpacity(borderColor, 60)
  );
  sessionStorage.setItem('certificateBorderColor', borderColor);
  sessionStorage.setItem('certificateBorderAccentColor', borderColor);
}

/**
 * Sets the side image of the certificate by fetching the image data from the form input.
 * Updates the DOM element and stores the image data in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
async function setSideImage(certificateContainer) {
  const sideImageInput = document.getElementById('generator_sideImage');
  try {
    const imageUrl = await getImageData(sideImageInput, 'URL');
    certificateContainer.querySelector('.content > .side img').src = imageUrl;
  } catch (error) {
    console.error(error);
  }

  try {
    const imageBase64 = await getImageData(sideImageInput, 'base64');
    sessionStorage.setItem('certificateSideImage', imageBase64);
  } catch (error) {
    sessionStorage.setItem('certificateSideImage', '');
    console.error(error);
  }
}

/**
 * Sets the side image position for the certificate, applies it to the DOM element, and stores it in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function setSideImagePosition(certificateContainer) {
  const position = document.getElementById('generator_sideImagePosition').value;
  certificateContainer.style.setProperty('--side-position', position);
  sessionStorage.setItem(
    'certificateSideImagePosition',
    position === '0' ? 'left' : 'right'
  );
}

/**
 * Sets the background image of the certificate by fetching the image data from the form input.
 * Updates the DOM element and stores the image data in sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
async function setBackgroundImage(certificateContainer) {
  const backgroundImageInput = document.getElementById(
    'generator_backgroundImage'
  );
  try {
    const imageUrl = await getImageData(backgroundImageInput, 'URL');
    certificateContainer.style.setProperty(
      '--background-image',
      `url(${imageUrl})`
    );
  } catch (error) {
    console.error(error);
  }

  try {
    const imageBase64 = await getImageData(backgroundImageInput, 'base64');
    sessionStorage.setItem('certificateBackgroundImage', imageBase64);
  } catch (error) {
    sessionStorage.setItem('certificateBackgroundImage', '');
    console.error(error);
  }
}

/**
 * Sets the certificate content from the Quill editor to the certificate container.
 */
function setCertificateContent() {
  document.querySelector('#certificate > .content > .data-form').innerHTML =
    document.getElementById('quillEditor').quill.root.innerHTML;
  sessionStorage.setItem(
    'certificateContent',
    JSON.stringify(document.getElementById('quillEditor').quill.getContents())
  );
}

export { certificateFromForm };
