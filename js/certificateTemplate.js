import { getPondJSONData, setImageToFilePond } from './utilities.js';

/**
 * Applies a certificate template by configuring elements based on JSON data
 * and triggering necessary events to update the UI.
 *
 * @async
 * @param {Object} [dataJSON] - The JSON object containing template configuration.
 * If not provided, data will be fetched from FilePond.
 * @returns {Promise<void>} Resolves when the template has been applied.
 *
 * @example
 * // Example usage with a JSON template object
 * const templateData = {
 *   settings: {
 *     TYPE: 'certificateType',
 *     LANGUAGE: 'English',
 *     ORIENTATION: 'Landscape',
 *   },
 *   content: 'Congratulations on completing the course!'
 * };
 * await certificateTemplate(templateData);
 */
async function certificateTemplate(dataJSON) {
  const templateInput = document.getElementById(
    'generator_certificateTemplate'
  );
  const jsonData =
    dataJSON || (await getPondJSONData(FilePond.find(templateInput)));
  const changeEvent = new Event('change');

  // Apply certificate settings
  applyCertificateSettings(jsonData.settings);

  // Apply theme settings
  await applyThemeSettings(jsonData.theme, changeEvent);

  // Set content in the Quill editor if content data exists
  if (jsonData.content) {
    setQuillEditorContent('quillEditor', jsonData.content);
  }
}

/**
 * Configures the main settings of the certificate such as type, language, and orientation.
 *
 * @param {Object} settings - An object containing certificate settings.
 */
function applyCertificateSettings(settings) {
  setSelectValue('generator_type', settings.TYPE);
  setSelectValue('generator_language', settings.LANGUAGE);
  setSelectValue('generator_orientation', settings.ORIENTATION);
}

/**
 * Applies theme-related settings like background and border colors, side images,
 * and background images based on the theme configuration in JSON data.
 *
 * @param {Object} jsonData - The JSON data containing theme settings.
 * @param {Event} changeEvent - The change event to dispatch for triggering listeners.
 * @returns {Promise<void>} Resolves when theme settings have been applied.
 */
async function applyThemeSettings(theme, changeEvent) {
  const themeInput = document.getElementById('generator_theme');
  setSelectValue('generator_theme', theme.NAME);
  themeInput.dispatchEvent(changeEvent);

  // Background color (if theme lacks a background image)
  if (themeInput.value !== 'withBackgroundImage') {
    setSelectValue('generator_backgroundColor', theme.BACKGROUND_COLOR);
  }

  // Border color for certain themes
  if (
    ['borderWithSideImage', 'borderWithoutSideImage'].includes(themeInput.value)
  ) {
    setSelectValue('generator_borderColor', theme.BORDER_COLOR);
  }

  // Side image and position
  if (['borderWithSideImage', 'withSideImage'].includes(themeInput.value)) {
    await setImageIfAvailable('generator_sideImage', theme.SIDE_IMAGE);
    setSelectValue('generator_sideImagePosition', theme.SIDE_IMAGE_POSITION);
  }

  // Background image
  if (themeInput.value === 'withBackgroundImage') {
    await setImageIfAvailable(
      'generator_backgroundImage',
      theme.BACKGROUND_IMAGE
    );
  }
}

/**
 * Sets a select input's value and optionally triggers a change event.
 *
 * @param {string} elementId - The ID of the select input element.
 * @param {string} value - The value to set for the select input.
 */
function setSelectValue(elementId, value) {
  const input = document.getElementById(elementId);
  input.value = value || input.value;
}

/**
 * Sets an image file for a FilePond instance if a URL is provided.
 *
 * @param {string} inputId - The ID of the FilePond input element.
 * @param {string} imageUrl - The URL of the image to set in FilePond.
 * @returns {Promise<void>} Resolves once the image has been set.
 */
async function setImageIfAvailable(inputId, imageUrl) {
  if (imageUrl) {
    await setImageToFilePond(
      FilePond.find(document.getElementById(inputId)),
      imageUrl
    );
  }
}

/**
 * Sets content in a Quill editor instance.
 *
 * @param {string} editorId - The ID of the Quill editor container element.
 * @param {string} contentJSON - A JSON string representing the Quill editor content.
 */
function setQuillEditorContent(editorId, contentJSON) {
  const quillEditor = document.getElementById(editorId).quill;
  const content = JSON.parse(contentJSON);
  quillEditor.setContents(content);
}

export { certificateTemplate };
