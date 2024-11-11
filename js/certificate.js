import { initializeQuillEditor } from './QuillRichTextEditor.js';
import { certificateForm } from './certificateForm.js';
import { certificateFromForm } from './certificateFromForm.js';
import { exportCertificate } from './exportCertificate.js';

document.addEventListener('DOMContentLoaded', (event) => {
  // Quill Rich Text Editor initialization
  initializeQuillEditor();

  // Initialize the certificate form
  certificateForm();

  // Generate certificate preview action button
  document
    .getElementById('viewCertificate')
    .addEventListener('click', async () => {
      const certificateContainer = document.getElementById('certificate');
      const certificatePreview = document.getElementById('canvasPreview');

      // Generates a certificate based on form input settings
      await certificateFromForm(certificateContainer, certificatePreview);

      // Scroll to certificate preview
      document.querySelector('.certificate-preview').scrollIntoView({
        behavior: 'smooth',
      });
    });

  // Export the certificate as a JSON data file
  document
    .querySelector('#certificateExport [export-type="JSON"]')
    .addEventListener('click', async () => {
      await exportCertificate(
        document.getElementById('certificate'),
        document.getElementById('canvasPreview'),
        'json'
      );
    });

  // Export the certificate as a PDF document
  document
    .querySelector('#certificateExport [export-type="PDF"]')
    .addEventListener('click', async () => {
      await exportCertificate(
        document.getElementById('certificate'),
        document.getElementById('canvasPreview'),
        'pdf'
      );
    });

  // Export the certificate as a PNG file
  document
    .querySelector('#certificateExport [export-type="PNG"]')
    .addEventListener('click', async () => {
      await exportCertificate(
        document.getElementById('certificate'),
        document.getElementById('canvasPreview'),
        'png'
      );
    });

  // Export the certificate as a JPEG file
  document
    .querySelector('#certificateExport [export-type="JPEG"]')
    .addEventListener('click', async () => {
      await exportCertificate(
        document.getElementById('certificate'),
        document.getElementById('canvasPreview'),
        'jpeg'
      );
    });
});
