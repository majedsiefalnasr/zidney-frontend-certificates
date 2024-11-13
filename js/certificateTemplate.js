import { getPondJSONData, setImageToFilePond } from './utilities.js';

/**
 * Applies a certificate template from a JSON file by setting
 * configuration values for various elements and triggering necessary events.
 */
async function certificateTemplate(data) {
  const templateInput = document.getElementById(
    'generator_certificateTemplate'
  );

  const jsonData =
    data || (await getPondJSONData(FilePond.find(templateInput)));

  const changeEvent = new Event('change'); // Custom event for change triggers

  // Set certificate configurations
  setSelectValue('generator_type', jsonData.settings.TYPE);
  setSelectValue('generator_language', jsonData.settings.LANGUAGE);
  setSelectValue('generator_orientation', jsonData.settings.ORIENTATION);

  // Set theme-related configurations
  applyThemeSettings(jsonData, changeEvent);

  // Set content in Quill editor if available
  jsonData.content && setQuillEditorContent('quillEditor', jsonData.content);
}

/**
 * Sets a select input's value and optionally triggers a change event.
 *
 * @param {string} elementId - The ID of the select input element.
 * @param {string} value - The value to set for the select input.
 */
function setSelectValue(elementId, value) {
  const input = document.getElementById(elementId);
  if (value) {
    input.value = value;
  }
}

/**
 * Applies theme-related settings such as background and border colors, side images,
 * and background images based on theme configuration in JSON data.
 *
 * @param {Object} jsonData - The JSON data containing theme settings.
 * @param {Event} changeEvent - The change event to dispatch for triggering listeners.
 */
async function applyThemeSettings(jsonData, changeEvent) {
  const themeInput = document.getElementById('generator_theme');
  setSelectValue('generator_theme', jsonData.theme.NAME);
  themeInput.dispatchEvent(changeEvent);

  // Background color (only if theme lacks a background image)
  if (themeInput.value !== 'withBackgroundImage') {
    setSelectValue(
      'generator_backgroundColor',
      jsonData.theme.BACKGROUND_COLOR
    );
  }

  // Border color
  if (
    ['borderWithSideImage', 'borderWithoutSideImage'].includes(themeInput.value)
  ) {
    setSelectValue('generator_borderColor', jsonData.theme.BORDER_COLOR);
  }

  // Side image and position
  if (['borderWithSideImage', 'withSideImage'].includes(themeInput.value)) {
    await setImageIfAvailable('generator_sideImage', jsonData.theme.SIDE_IMAGE);
    setSelectValue(
      'generator_sideImagePosition',
      jsonData.theme.SIDE_IMAGE_POSITION
    );
  }

  // Background image
  if (themeInput.value === 'withBackgroundImage') {
    await setImageIfAvailable(
      'generator_backgroundImage',
      jsonData.theme.BACKGROUND_IMAGE
    );
  }
}

/**
 * Sets the image file for a FilePond instance if a URL is provided.
 *
 * @param {string} inputId - The ID of the FilePond input element.
 * @param {string} imageUrl - The URL of the image to set in FilePond.
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
 * @param {string} contentJSON - The JSON string representing Quill editor content.
 */
function setQuillEditorContent(editorId, contentJSON) {
  const quillEditor = document.getElementById(editorId).quill;
  const content = JSON.parse(contentJSON);
  quillEditor.setContents(content);
}

export { certificateTemplate };
