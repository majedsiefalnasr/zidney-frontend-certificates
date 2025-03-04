import { certificateFromForm } from './certificateFromForm.js';
import { exportCertificate } from './exportCertificate.js';
import { certificateTemplate } from './certificateTemplate.js';

/**
 * Initializes the certificate form, registers FilePond plugins, sets up
 * FilePond inputs, and attaches event listeners for certificate actions.
 */
function certificateForm() {
  setupThemeChangeListener();
  initializeFilePondInputs();
  setupTemplateApplyButton();
  setupCertificatePreviewButton();
  setupExportButtons();
}

/**
 * Sets up a change event listener for the theme input to update theme settings dynamically.
 */
function setupThemeChangeListener() {
  const themeInput = document.getElementById('generator_theme');
  themeInput.addEventListener('change', (event) => {
    document
      .getElementById('customThemeSettings')
      .setAttribute('data-theme', event.target.value);
  });
}

/**
 * Initializes FilePond plugins and sets up FilePond instances for the template, side image, and background image inputs.
 */
function initializeFilePondInputs() {
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
  );

  createFilePondInstance('generator_certificateTemplate', ['application/json']);
  createFilePondInstance('generator_sideImage', ['image/*']);
  createFilePondInstance('generator_backgroundImage', ['image/*']);
}

/**
 * Creates a FilePond instance for a specified input element with accepted file types.
 *
 * @param {string} inputId - The ID of the input element to convert to a FilePond instance.
 * @param {Array<string>} acceptedFileTypes - An array of accepted MIME types for the FilePond instance.
 */
function createFilePondInstance(inputId, acceptedFileTypes) {
  const inputElement = document.getElementById(inputId);
  if (inputElement) {
    FilePond.create(inputElement, {
      acceptedFileTypes: acceptedFileTypes,
    });
  }
}

/**
 * Sets up the event listener for the "Apply Template" button to apply the certificate template.
 */
function setupTemplateApplyButton() {
  document
    .getElementById('applyCertificateTemplate')
    .addEventListener('click', async () => {
      await certificateTemplate();
    });
}

/**
 * Sets up the event listener for the "View Certificate" button to generate a certificate preview.
 */
function setupCertificatePreviewButton() {
  document
    .getElementById('viewCertificate')
    .addEventListener('click', async () => {
      const certificateContainer = document.getElementById('certificate');
      const certificatePreview = document.getElementById('canvasPreview');
      await certificateFromForm(certificateContainer, certificatePreview);
    });
}

/**
 * Sets up export buttons with different formats by attaching event listeners.
 */
function setupExportButtons() {
  const exportFormats = ['JSON', 'PDF', 'PNG', 'JPEG'];
  exportFormats.forEach((format) => {
    document
      .querySelector(`#certificateExport [export-type="${format}"]`)
      .addEventListener('click', async () => {
        await exportCertificate(
          document.getElementById('canvasPreview'),
          format.toLowerCase()
        );
      });
  });
}

export { certificateForm };
