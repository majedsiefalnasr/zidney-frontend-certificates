/**
 * Initializes the Quill Rich Text Editor with custom configurations and shortcodes.
 */
function initializeQuillEditor() {
  const editorContainer = document.getElementById('quillEditor');
  const quillInstance = configureQuillEditor(editorContainer);
  addDefaultContent(quillInstance);
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
 * Adds default content to the Quill editor, including text and images.
 *
 * @param {Quill} editor - The Quill editor instance.
 */
function addDefaultContent(editor) {
  const content = [
    createImageElement(
      './img/zidny.logo.png',
      'center',
      'rtl',
      'alexandria',
      '64px'
    ),
    createNewlineElement(2, 'center', 'rtl', 'alexandria'),
    createTextElement('شهادة اتمام', 'center', 'rtl', 'alexandria', 2),
    createTextElement(
      'تهانينا, [certificate-name]',
      'center',
      'rtl',
      'alexandria',
      2
    ),
    createNewlineElement(1, 'center', 'rtl', 'alexandria'),
    createTextElement(
      '[certificate-subject]',
      'center',
      'rtl',
      'alexandria',
      1
    ),
    createNewlineElement(1, 'center', 'rtl', 'alexandria'),
    createTextElement(
      'اكتملت الدورة بتاريخ [certificate-date] - [certificate-duration]',
      'center',
      'rtl',
      'alexandria'
    ),
    createNewlineElement(1, 'center', 'rtl', 'alexandria'),
    createTextElement(
      ' من خلال الاستمرار في التعلم، قمت بتوسيع منظورك، وصقل مهاراتك، وجعلت نفسك أكثر طلبًا.',
      'center',
      'rtl',
      'alexandria'
    ),
    createNewlineElement(1, 'center', 'rtl', 'alexandria'),
    createImageElement('./img/sign.png', 'center', 'rtl', 'alexandria', '70px'),
    createNewlineElement(2, 'center', 'rtl', 'alexandria'),
    createTextElement(
      'نائب الرئيس للمحتوى التعليمي في زدني',
      'center',
      'rtl',
      'alexandria'
    ),
    createNewlineElement(5, 'center', 'rtl', 'alexandria'),
    createTextElement(
      'رقم تعريف الوثيقة [certificate-id]',
      'center',
      'rtl',
      'alexandria'
    ),
  ];
  editor.setContents(content);
}

/**
 * Creates a text element object for Quill with specified attributes, adding a newline at the end.
 *
 * @param {string} text - The text content.
 * @param {string} align - Alignment of the text.
 * @param {string} direction - Text direction.
 * @param {string} font - Font family.
 * @param {number} [header] - Optional header level.
 * @returns {Object} - Quill text element with specified attributes.
 */
function createTextElement(text, align, direction, font, header) {
  const attributes = { align, direction, font };
  if (header) attributes.header = header;
  const contentWithNewline = text + '\n'; // Add newline at the end of the text
  return { insert: contentWithNewline, attributes };
}

/**
 * Creates a newline element object for Quill with specified attributes.
 *
 * @param {number} lineCount - The number of newline characters to insert.
 * @param {string} align - Alignment of the text.
 * @param {string} direction - Text direction.
 * @param {string} font - Font family.
 * @param {number} [header] - Optional header level.
 * @returns {Object} - Quill newline element with specified attributes.
 */
function createNewlineElement(lineCount, align, direction, font, header) {
  const attributes = { align, direction, font };
  if (header) attributes.header = header;
  const newlines = '\n'.repeat(lineCount);
  return { insert: newlines, attributes };
}

/**
 * Creates an image element object for Quill with specified attributes.
 *
 * @param {string} src - Image source URL.
 * @param {string} align - Alignment of the image.
 * @param {string} direction - Text direction for the image element.
 * @param {string} font - Font family.
 * @param {string} height - Height of the image.
 * @returns {Object} - Quill image element with specified attributes.
 */
function createImageElement(src, align, direction, font, height) {
  return {
    insert: { image: src },
    attributes: { align, direction, font, height },
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
