import { initializeQuillEditor } from './QuillRichTextEditor.js';
import { certificateForm } from './certificateForm.js';
import { certificateTemplate } from './certificateTemplate.js';
import { getJSONData } from './utilities.js';

document.addEventListener('DOMContentLoaded', async (event) => {
  // Quill Rich Text Editor initialization
  initializeQuillEditor();

  // Initialize the certificate form
  certificateForm();

  const defaultData = await getJSONData('./data/certificate_default.json');

  // Initialize the certificate default settings and data
  defaultData && certificateTemplate(defaultData);
});
