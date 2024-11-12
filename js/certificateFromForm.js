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

  // Clear any previous certificate settings
  clearCertificateType(certificateContainer);
  clearCertificateLanguage();
  clearOrientation(certificateContainer);
  clearTheme(certificateContainer);
  clearBorderColor(certificateContainer);
  clearSideImage(certificateContainer);
  clearSideImagePosition(certificateContainer);
  clearBackgroundColor(certificateContainer);
  clearBackgroundImage(certificateContainer);
  clearCertificateContent();

  setCertificateType(certificateContainer);
  setCertificateLanguage();
  setOrientation(certificateContainer);
  setTheme(certificateContainer);

  const themeInput = document.getElementById('generator_theme');
  // Apply border if specified
  if (
    themeInput.value === 'borderWithSideImage' ||
    themeInput.value === 'borderWithoutSideImage'
  ) {
    setBorderColor(certificateContainer);
  }

  // Apply side image if specified
  if (
    themeInput.value === 'borderWithSideImage' ||
    themeInput.value === 'withSideImage'
  ) {
    await setSideImage(certificateContainer);
    setSideImagePosition(certificateContainer);
  }

  // Apply background color if specified
  if (themeInput.value !== 'withBackgroundImage') {
    setBackgroundColor(certificateContainer);
  }

  // Apply background image if specified
  if (themeInput.value === 'withBackgroundImage') {
    await setBackgroundImage(certificateContainer);
  }

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
 * Clears the certificate type from the DOM element and sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearCertificateType(certificateContainer) {
  certificateContainer.removeAttribute('data-type');
  sessionStorage.removeItem('certificateType');
}

/**
 * Sets the certificate language from the form input and stores it in sessionStorage.
 */
function setCertificateLanguage() {
  const languageInput = document.getElementById('generator_language').value;
  sessionStorage.setItem('certificateLanguage', languageInput);
}

/**
 * Clears the certificate language from sessionStorage.
 */
function clearCertificateLanguage() {
  sessionStorage.removeItem('certificateLanguage');
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
 * Clears the certificate orientation from the DOM element and sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearOrientation(certificateContainer) {
  certificateContainer.removeAttribute('data-orientation');
  sessionStorage.removeItem('certificateOrientation');
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
 * Clears the certificate theme from the DOM element and sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearTheme(certificateContainer) {
  certificateContainer.removeAttribute('data-theme');
  const customThemeSettings = document.getElementById('customThemeSettings');
  if (customThemeSettings) {
    customThemeSettings.removeAttribute('data-theme');
  }
  sessionStorage.removeItem('certificateTheme');
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
 * Clears the background color of the certificate from the DOM element and sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearBackgroundColor(certificateContainer) {
  certificateContainer.style.removeProperty('--background-color');
  sessionStorage.removeItem('certificateBackgroundColor');
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
 * Clears the border color and accent color of the certificate, removes them from the DOM element, and clears them from sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearBorderColor(certificateContainer) {
  // Remove custom border color properties from the certificate container
  certificateContainer.style.removeProperty('--border-color');
  certificateContainer.style.removeProperty('--border-accent-color');

  // Remove stored border color values from sessionStorage
  sessionStorage.removeItem('certificateBorderColor');
  sessionStorage.removeItem('certificateBorderAccentColor');
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
    const image = document.createElement('img');
    image.src = imageUrl;
    certificateContainer.querySelector('.content >.side').appendChild(image);
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
 * Clears the side image of the certificate from the DOM element and removes the image data from sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearSideImage(certificateContainer) {
  // Remove the image element from the certificate container
  const sideImageContainer =
    certificateContainer.querySelector('.content > .side');
  if (sideImageContainer) {
    const image = sideImageContainer.querySelector('img');
    if (image) {
      sideImageContainer.removeChild(image);
    }
  }

  // Remove the stored side image data from sessionStorage
  sessionStorage.removeItem('certificateSideImage');
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
 * Clears the side image position for the certificate, removes it from the DOM element, and clears it from sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearSideImagePosition(certificateContainer) {
  // Remove custom side position property from the certificate container
  certificateContainer.style.removeProperty('--side-position');

  // Remove stored side image position from sessionStorage
  sessionStorage.removeItem('certificateSideImagePosition');
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
 * Clears the background image of the certificate from the DOM element and sessionStorage.
 *
 * @param {HTMLElement} certificateContainer - The certificate container element.
 */
function clearBackgroundImage(certificateContainer) {
  // Remove the background image property from the certificate container
  certificateContainer.style.removeProperty('--background-image');

  // Remove the stored background image data from sessionStorage
  sessionStorage.removeItem('certificateBackgroundImage');
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

/**
 * Clears the certificate content from the certificate container and sessionStorage.
 */
function clearCertificateContent() {
  // Clear the certificate content in the DOM element
  document.querySelector('#certificate > .content > .data-form').innerHTML = '';

  // Clear the stored certificate content from sessionStorage
  sessionStorage.removeItem('certificateContent');
}

export { certificateFromForm };
