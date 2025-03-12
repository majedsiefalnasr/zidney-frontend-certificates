/**
 * Initializes the Quill Rich Text Editor with custom configurations and shortcodes.
 */
function initializeQuillEditor() {
  const editorContainer = document.getElementById('quillEditor');
  const quillInstance = configureQuillEditor(editorContainer);
  addCustomShortcodes(quillInstance);
}

/**
 * Configures the Quill editor with specified options, including custom fonts, toolbar settings, and image resizer.
 *
 * @param {HTMLElement} editorContainer - The container element for the Quill editor.
 * @returns {Quill} - The initialized Quill editor instance.
 */
function configureQuillEditor(editorContainer) {
  const Font = Quill.import('attributors/class/font');
  Font.whitelist = ['lato', 'alexandria', 'serif', 'monospace'];
  Quill.register(Font, true);

  const Parchment = Quill.import('parchment');
  const weightFormat = new Parchment.Attributor.Class('weight', 'ql-weight', {
    scope: Parchment.Scope.INLINE,
    whitelist: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  });
  Quill.register(weightFormat, true);
  Quill.register('modules/resize', window.QuillResizeImage);

  editorContainer.quill = new Quill(editorContainer, {
    modules: {
      toolbar: getToolbarOptions(Font.whitelist),
      resize: { locale: {} },
    },
    placeholder: 'Certificate content ...',
    theme: 'snow',
  });

  return editorContainer.quill;
}

/**
 * Returns an array of toolbar options for the Quill editor.
 *
 * @param {Array} fontWhitelist - List of allowed fonts for the font dropdown.
 * @returns {Array} - Toolbar configuration array.
 */
function getToolbarOptions(fontWhitelist) {
  return {
    container: [
      [{ header: [1, 2, false] }],
      [{ font: fontWhitelist }],
      [
        {
          weight: [
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
          ],
        },
      ],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      [{ align: [] }, 'image'],
      [{ direction: 'rtl' }],
      ['clean'],
    ],
  };
}

/**
 * Creates a text element object for Quill with specified attributes, adding a newline at the end.
 *
 * @param {string} text - The text content.
 * @param {string} [align=null] - Optional alignment of the text.
 * @param {string} [direction=null] - Optional text direction.
 * @param {string} [font=null] - Optional font family.
 * @param {string} [weight=null] - Optional font weight.
 * @param {number} [header=null] - Optional header level.
 * @returns {Object} - Quill text element with specified attributes.
 */
function createTextElement(
  text,
  align = null,
  direction = null,
  font = null,
  weight = null,
  header = null
) {
  const attributes = {};

  // Add optional attributes only if they are provided
  if (align) attributes.align = align;
  if (direction) attributes.direction = direction;
  if (font) attributes.font = font;
  if (weight) attributes.weight = weight;
  if (header) attributes.header = header;

  const contentWithNewline = text + '\n'; // Add newline at the end of the text
  return { insert: contentWithNewline, attributes };
}

/**
 * Creates a newline element object for Quill with specified attributes.
 *
 * @param {number} lineCount - The number of newline characters to insert.
 * @param {string} [align=null] - Optional alignment of the text.
 * @param {string} [direction=null] - Optional text direction.
 * @param {string} [font=null] - Optional font family.
 * @param {string} [weight=null] - Optional font weight.
 * @param {number} [header=null] - Optional header level.
 * @returns {Object} - Quill newline element with specified attributes.
 */
function createNewlineElement(
  lineCount,
  align = null,
  direction = null,
  font = null,
  weight = null,
  header = null
) {
  const attributes = {};

  // Add optional attributes only if they are provided
  if (align) attributes.align = align;
  if (direction) attributes.direction = direction;
  if (font) attributes.font = font;
  if (weight) attributes.weight = weight;
  if (header) attributes.header = header;

  const newlines = '\n'.repeat(lineCount);
  return { insert: newlines, attributes };
}

/**
 * Creates an image element object for Quill with specified attributes.
 *
 * @param {string} src - Image source URL.
 * @param {string} [height=null] - Optional height of the image.
 * @param {string} [align=null] - Optional alignment of the image.
 * @param {string} [direction=null] - Optional text direction for the image element.
 * @param {string} [font=null] - Optional font family.
 * @param {string} [weight=null] - Optional font weight.
 * @returns {Object} - Quill image element with specified attributes.
 */
function createImageElement(
  src,
  height = null,
  align = null,
  direction = null,
  font = null,
  weight = null
) {
  const attributes = {};

  // Add optional attributes only if they are provided
  if (height) attributes.height = height;
  if (align) attributes.align = align;
  if (direction) attributes.direction = direction;
  if (font) attributes.font = font;
  if (weight) attributes.weight = weight;

  return {
    insert: { image: src },
    attributes,
  };
}

/**
 * Adds custom shortcode buttons to the Quill editor for inserting specified shortcodes.
 *
 * @param {Quill} editor - The Quill editor instance.
 */
function addCustomShortcodes(editor) {
  const container = editor.addContainer('ql-custom');
  container.classList.add(
    'd-flex',
    'justify-content-center',
    'gap-2',
    'flex-wrap',
    'p-2'
  );

  const shortcodes = [
    { code: 'certificate-name', label: 'Name' },
    { code: 'certificate-subject', label: 'Subject' },
    { code: 'certificate-date', label: 'Date' },
    { code: 'certificate-duration', label: 'Duration' },
    { code: 'certificate-id', label: 'ID' },
  ];

  shortcodes.forEach(({ code, label }) =>
    addQuillShortcodeButton(editor, container, code, label)
  );
}

/**
 * Adds a custom button to the Quill editor toolbar that inserts a specified shortcode at the cursor position.
 *
 * @param {Quill} editor - The Quill editor instance.
 * @param {HTMLElement} container - The container where the custom button will be added.
 * @param {string} shortcode - The shortcode to be inserted into the editor.
 * @param {string} label - The text label displayed on the button.
 */
function addQuillShortcodeButton(editor, container, shortcode, label) {
  const button = document.createElement('button');
  button.classList.add(`ql-custom-${shortcode}`, 'btn', 'btn-light', 'btn-sm');
  button.innerText = label;
  button.type = 'button';
  container.appendChild(button);

  button.addEventListener('click', (event) => {
    event.preventDefault();
    if (!editor.hasFocus()) editor.focus();

    const cursorPosition = editor.getSelection().index;
    editor.insertText(cursorPosition, `[${shortcode}]`);
    editor.setSelection(cursorPosition + `[${shortcode}]`.length);
  });
}

export { initializeQuillEditor };
