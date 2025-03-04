import { initializeQuillEditor } from './QuillRichTextEditor.js';
import { exportCertificate } from './exportCertificate.js';
import {
  getPondJSONData,
  getHexWithOpacity,
  renderToCanvas,
  replaceShortcodesInJSON,
  getJSONData,
  createImageURLFromBase64,
} from './utilities.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Quill Rich Text Editor initialization
  initializeQuillEditor();

  // Initialize the certificate form
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
  );
  const dataInput = document.getElementById('generator_certificateData');
  if (dataInput) {
    FilePond.create(dataInput, {
      acceptedFileTypes: ['application/json'],
    });
  }

  document
    .getElementById('applyCertificateData')
    .addEventListener('click', async () => {
      // Certificate Container
      const certificateContainer = document.getElementById('certificate');
      // Certificate Preview Container
      const certificatePreview = document.getElementById('canvasPreview');

      const jsonData = await getPondJSONData(FilePond.find(dataInput));

      // Get the certificate orientation
      const orientation = jsonData.settings.ORIENTATION;
      certificateContainer.setAttribute('data-orientation', orientation);

      // Get the certificate theme
      const theme = jsonData.theme.NAME;
      // Apply the certificate theme settings
      certificateContainer.setAttribute('data-theme', theme);

      // Apply border if specified
      if (
        theme === 'borderWithSideImage' ||
        theme === 'borderWithoutSideImage'
      ) {
        certificateContainer.style.setProperty(
          '--border-color',
          jsonData.theme.BORDER_COLOR
        );
        certificateContainer.style.setProperty(
          '--border-accent-color',
          getHexWithOpacity(jsonData.theme.BORDER_COLOR, 60)
        );
      }

      // Apply side image if specified
      if (theme === 'borderWithSideImage' || theme === 'withSideImage') {
        const image = document.createElement('img');
        image.src = createImageURLFromBase64(jsonData.theme.SIDE_IMAGE);
        certificateContainer
          .querySelector('.content >.side')
          .appendChild(image);
        certificateContainer.style.setProperty(
          '--side-position',
          jsonData.theme.SIDE_IMAGE_POSITION === 'left' ? '0' : '1'
        );
      }

      // Apply background color if specified
      if (theme !== 'withBackgroundImage') {
        certificateContainer.style.setProperty(
          '--background-color',
          jsonData.theme.BACKGROUND_COLOR
        );
      }

      // Apply background image if specified
      if (theme === 'withBackgroundImage') {
        certificateContainer.style.setProperty(
          '--background-image',
          'url(' +
            createImageURLFromBase64(jsonData.theme.BACKGROUND_IMAGE) +
            ')'
        );
      }

      // Replace student data
      const studentData = await getJSONData('./data/student.json');

      // Set certificate content
      const quillEditor = document.getElementById('quillEditor').quill;

      // Replace shortcodes
      const newContent = replaceShortcodesInJSON(JSON.parse(jsonData.content), {
        'certificate-name': studentData.NAME,
        'certificate-subject': studentData.SUBJECT,
        'certificate-date': studentData.DATE,
        'certificate-duration': studentData.DURATION,
        'certificate-id': studentData.ID,
      });

      // Set content
      quillEditor.setContents(newContent);
      document.querySelector('#certificate > .content > .data-form').innerHTML =
        quillEditor.root.innerHTML;

      // Renders the certificate to the canvas
      await renderToCanvas(certificateContainer, certificatePreview);

      // Enable Export to save configuration
      document.querySelector('#certificateExport > button').disabled = false;
      const exportFormats = ['PDF', 'PNG', 'JPEG'];
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

      // Scroll to certificate preview
      document.querySelector('.certificate-preview').scrollIntoView({
        behavior: 'smooth',
      });
    });
});
