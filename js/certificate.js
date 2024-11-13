import { initializeQuillEditor } from './QuillRichTextEditor.js';
import { certificateForm } from './certificateForm.js';
import { certificateFromForm } from './certificateFromForm.js';
import { exportCertificate } from './exportCertificate.js';
import { certificateTemplate } from './certificateTemplate.js';
import { getJSONData } from './utilities.js';

document.addEventListener('DOMContentLoaded', async (event) => {
  // Quill Rich Text Editor initialization
  initializeQuillEditor();

  // Initialize the certificate form
  certificateForm();

  const defaultData = await getJSONData('./data/default_certificate.json');

  // Initialize the certificate default settings and data
  defaultData && certificateTemplate(defaultData);

  // Apply template action button
  document
    .getElementById('applyCertificateTemplate')
    .addEventListener('click', async () => {
      certificateTemplate();
    });

  // Generate certificate preview action button
  document
    .getElementById('viewCertificate')
    .addEventListener('click', async () => {
      const certificateContainer = document.getElementById('certificate');
      const certificatePreview = document.getElementById('canvasPreview');

      // Generates a certificate based on form input settings
      await certificateFromForm(certificateContainer, certificatePreview);
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
