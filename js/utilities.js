/**
 * Converts a hex color and opacity percentage to a hex color with alpha transparency.
 *
 * @param {string} hexColor - The hex color code, with or without a leading '#'.
 * @param {number} opacityPercentage - The opacity percentage (0-100) to apply.
 * @returns {string} The hex color with alpha channel included.
 *
 * @example
 * // Convert a hex color with 50% opacity
 * const hexWithOpacity = getHexWithOpacity('#FF5733', 50);
 * console.log(hexWithOpacity); // Output: '#FF573380'
 */
function getHexWithOpacity(hexColor, opacityPercentage) {
  // Remove '#' if present
  const cleanHex = hexColor.replace('#', '');

  // Calculate the alpha value from opacity percentage and convert it to hex
  let alpha = Math.round((opacityPercentage / 100) * 255).toString(16);

  // Ensure alpha is two characters (e.g., '0A' instead of 'A')
  if (alpha.length === 1) {
    alpha = '0' + alpha;
  }

  // Return the hex color with the alpha channel
  return `#${cleanHex}${alpha}`;
}

/**
 * Creates a debounced version of a function that delays its execution until after a specified wait time.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay execution.
 * @returns {Function} A debounced version of the provided function.
 *
 * @example
 * // Log input text after 500ms delay when the user stops typing
 * const logInput = debounce((text) => console.log(text), 500);
 * document.querySelector('#input').addEventListener('input', (event) => {
 *   logInput(event.target.value);
 * });
 */
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Opens a save file dialog to download a file with specified data, filename, and MIME type.
 *
 * @param {string} data - The content to be saved in the file.
 * @param {string} defaultFilename - The default name to suggest for the saved file.
 * @param {string} mimeType - The MIME type of the file (e.g., 'application/json' for JSON files).
 * @returns {Promise<void>} Resolves when the file has been saved, or logs an error if unsuccessful.
 *
 * @example
 * // Usage example: Save JSON data to a file
 * const jsonData = JSON.stringify({ name: "Example", age: 30 });
 * downloadFile(jsonData, "example.json", "application/json")
 *   .then(() => console.log("File saved successfully"))
 *   .catch(error => console.error("Error saving file:", error));
 */
async function downloadFile(data, defaultFilename, mimeType) {
  try {
    // Prompt the user with a save file dialog
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: defaultFilename,
      types: [
        {
          description: 'JSON File',
          accept: { [mimeType]: ['.json'] },
        },
      ],
    });

    // Open a writable stream and write the data
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(new Blob([data], { type: mimeType }));
    await writableStream.close();
  } catch (error) {
    console.error('Error saving file:', error);
  }
}

/**
 * Converts an image file to either a base64 string or a URL based on the specified type.
 *
 * @param {HTMLInputElement} inputFile - The file input element containing the selected file.
 * @param {string} type - The desired output type: 'base64' for a base64 string, or 'URL' for a file URL.
 * @returns {Promise<string>} A promise that resolves to either a base64 string or a file URL of the image.
 * @throws {string} An error message if no file is selected or if an invalid type is specified.
 *
 * @example
 * // Usage example: Convert an image file to base64
 * const fileInput = document.getElementById('imageInput');
 * getImageData(fileInput, 'base64')
 *   .then(data => console.log("Base64 Data:", data))
 *   .catch(error => console.error(error));
 *
 * // Usage example: Convert an image file to a URL
 * getImageData(fileInput, 'URL')
 *   .then(data => console.log("Image URL:", data))
 *   .catch(error => console.error(error));
 */
function getImageData(inputFile, type) {
  return new Promise((resolve, reject) => {
    const file = inputFile.files[0]; // Get the selected file
    if (!file) {
      reject('No file selected');
      return;
    }

    if (type === 'base64') {
      // Convert the image file to a base64 string
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve(e.target.result); // Return base64 string
      };
      reader.onerror = function () {
        reject('Error reading file');
      };
      reader.readAsDataURL(file); // Read file as base64
    } else if (type === 'URL') {
      // Create a URL for the image file
      const fileURL = URL.createObjectURL(file);
      resolve(fileURL); // Return URL
    } else {
      reject('Invalid type, choose "base64" or "URL"');
    }
  });
}

/**
 * Renders HTML content from a target element onto a canvas.
 *
 * @param {HTMLElement} target - The HTML element to be rendered onto the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element where the HTML content will be rendered.
 *
 * @example
 * // Render a specific div to a canvas
 * const targetDiv = document.getElementById('certificate');
 * const canvasElement = document.getElementById('outputCanvas');
 * renderToCanvas(targetDiv, canvasElement);
 */
async function renderToCanvas(target, canvas) {
  // Ensure the target element is visible for capturing
  target.style.display = 'block';
  // Ensure the output canvas is not visible
  canvas.style.display = 'none';

  // Capture the HTML content as a canvas
  await html2canvas(target, { scale: 2 }).then((capturedCanvas) => {
    // Set the output canvas size to match the captured canvas
    canvas.width = capturedCanvas.width;
    canvas.height = capturedCanvas.height;
    const ctx = canvas.getContext('2d');

    // Draw captured content onto the output canvas
    ctx.drawImage(capturedCanvas, 0, 0);

    console.log('Rendered HTML content to canvas.');
  });

  // Hide the target element after rendering
  target.style.display = 'none';

  // Display the output canvas
  canvas.style.display = 'block';
}

/**
 * Replaces placeholders (shortcodes) within a content string with corresponding values from a replacements object.
 *
 * This function scans the content for any shortcode in the format `[shortcode]` and replaces it with the
 * corresponding value from the replacements object. If no replacement is found for a shortcode, the original
 * shortcode is retained.
 *
 * @param {string} text - The content containing shortcodes to be replaced.
 * @param {Object} replacements - An object where keys are shortcodes (without brackets) and values are their replacements.
 * @returns {string} - The content with shortcodes replaced by corresponding values.
 *
 * @example
 * // Replaces [name] and [place] in the text with values from replacements
 * const text = "Hello [name], welcome to [place]!";
 * const replacements = { name: "Alice", place: "Wonderland" };
 * const result = applyReplacements(text, replacements);
 * // result: "Hello Alice, welcome to Wonderland!"
 */
function applyReplacements(text, replacements) {
  return text.replace(/\[(.*?)\]/g, (match, shortcode) => {
    return replacements[shortcode] || match;
  });
}

/**
 * Fetches and parses JSON data from a specified file path.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {Promise<Object|null>} A promise that resolves with the parsed JSON data, or `null` if an error occurs.
 *
 * @example
 * // Fetch and log data from a JSON file
 * getDataFromJson('/data/sample.json')
 *   .then(data => console.log(data))
 *   .catch(error => console.error("Error:", error));
 */
async function getDataFromJson(filePath) {
  try {
    const response = await fetch(filePath);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      );
    }

    // Parse and return JSON data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    return null;
  }
}

export {
  getHexWithOpacity,
  debounce,
  downloadFile,
  getImageData,
  renderToCanvas,
  applyReplacements,
  getDataFromJson,
};
