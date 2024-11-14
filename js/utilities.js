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
 * Converts an image file from a FilePond instance to either a base64 string or a URL based on the specified type.
 *
 * @param {FilePond} pondInstance - The FilePond instance containing the uploaded file.
 * @param {string} type - The desired output type: 'base64' for a base64 string, or 'URL' for a file URL.
 * @returns {Promise<string>} A promise that resolves to either a base64 string or a file URL of the image.
 * @throws {string} An error message if no file is available in the FilePond instance or if an invalid type is specified.
 *
 * @example
 * // Usage example: Convert an image file to base64
 * getImageData(pondInstance, 'base64')
 *   .then(data => console.log("Base64 Data:", data))
 *   .catch(error => console.error(error));
 *
 * // Usage example: Convert an image file to a URL
 * getImageData(pondInstance, 'URL')
 *   .then(data => console.log("Image URL:", data))
 *   .catch(error => console.error(error));
 */
function getFilePondImageData(pondInstance, type) {
  return new Promise((resolve, reject) => {
    // Ensure there's at least one file in the FilePond instance
    const fileItem = pondInstance.getFiles()[0];
    if (!fileItem) {
      reject('No file available in FilePond instance');
      return;
    }

    const file = fileItem.file;

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
 * Sets a base64 image string into a FilePond instance as an image file.
 *
 * @param {FilePond} pondInstance - The FilePond instance where the image will be set.
 * @param {string} base64Data - The base64 string of the image to be set.
 * @param {string} [fileName='image.png'] - Optional file name to give the image in FilePond (default is 'image.png').
 * @returns {Promise<void>} A promise that resolves when the image is successfully added to the FilePond instance.
 * @throws {string} An error message if the base64 string is invalid or cannot be processed.
 *
 * @example
 * // Usage example: Set a base64 image into FilePond
 * setImageToFilePond(pondInstance, base64Data)
 *   .then(() => console.log("Image set successfully"))
 *   .catch(error => console.error(error));
 */
function setImageToFilePond(pondInstance, base64Data, fileName = 'image.png') {
  return new Promise((resolve, reject) => {
    // Verify that base64Data is a valid string
    if (
      typeof base64Data !== 'string' ||
      !base64Data.startsWith('data:image')
    ) {
      reject('Invalid base64 image data');
      return;
    }

    // Convert the base64 data to a Blob
    const byteString = atob(base64Data.split(',')[1]); // Decode base64 string
    const mimeType = base64Data.match(/^data:(.*?);base64/)[1]; // Extract MIME type
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: mimeType });

    // Add the Blob as a file to the FilePond instance
    pondInstance
      .addFile(new File([blob], fileName, { type: mimeType }))
      .then(() => resolve())
      .catch((error) =>
        reject('Error setting image in FilePond: ' + error.message)
      );
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

  // Set the scale factor
  const scale = 4;

  // Adjust width and height based on scale
  const width = target.offsetWidth * scale;
  const height = target.offsetHeight * scale;

  // Convert the target HTML element to an image using dom-to-image with scale
  await domtoimage
    .toPng(target, {
      width: width,
      height: height,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${target.offsetWidth}px`,
        height: `${target.offsetHeight}px`,
      },
    })
    .then((dataUrl) => {
      // Create a new image element
      const img = new Image();
      img.src = dataUrl;

      // Wait for the image to load
      img.onload = () => {
        // Set canvas size to match the scaled image
        canvas.width = img.width;
        canvas.height = img.height;

        // Get the canvas context and draw the image onto the canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        console.log('Rendered HTML content to canvas.');

        // Hide the target element after rendering
        target.style.display = 'none';

        // Display the output canvas
        canvas.style.display = 'block';
      };
    })
    .catch((error) => {
      console.error('Error converting HTML to image:', error);
    });
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

/**
 * Validates a FilePond file input to ensure at least one file is selected.
 * If no files are present, it sets a custom error message, changes the status to 'error',
 * and brings the FilePond input into focus to alert the user.
 *
 * @param {FilePond} pond - The FilePond instance representing the file input.
 * @returns {boolean} Returns true if files are present; false if the input is empty.
 *
 * @example
 * // Usage example when validating before form submission
 * const isValid = validateFileInput(filePondInstance);
 * if (!isValid) {
 *   alert("Please add at least one file before submitting the form.");
 * }
 */
function validateFileInput(pond) {
  if (pond.getFiles().length === 0) {
    // Set error
    pond.element.classList.add('filepond--error');

    // Focus on the FilePond input and scroll it into view
    pond.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    pond.element.focus();
    return false; // Validation failed
  }

  // Remove error
  pond.element.classList.remove('filepond--error');
  return true; // Validation passed
}

/**
 * Converts a JSON file from a FilePond instance and returns the parsed JSON.
 *
 * @param {FilePond} pondInstance - The FilePond instance containing the uploaded file.
 * @returns {Promise<Object>} A promise that resolves to the parsed JSON data from the file.
 * @throws {string} An error message if no file is available in the FilePond instance or if the file is not a JSON file.
 *
 * @example
 * // Usage example: Parse JSON file from FilePond instance
 * getJSONData(pondInstance)
 *   .then(data => console.log("Parsed JSON Data:", data))
 *   .catch(error => console.error(error));
 */
function getPondJSONData(pondInstance) {
  return new Promise((resolve, reject) => {
    // Ensure there's at least one file in the FilePond instance
    const fileItem = pondInstance.getFiles()[0];
    if (!fileItem) {
      reject('No file available in FilePond instance');
      return;
    }

    const file = fileItem.file;

    // Ensure the file is a JSON file
    if (file.type !== 'application/json') {
      reject('The file is not a JSON file');
      return;
    }

    // Create a FileReader to read the JSON file
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const jsonData = JSON.parse(e.target.result); // Parse the JSON data
        resolve(jsonData); // Return parsed JSON data
      } catch (error) {
        reject('Error parsing JSON file');
      }
    };
    reader.onerror = function () {
      reject('Error reading file');
    };
    reader.readAsText(file); // Read the file as text (JSON)
  });
}

/**
 * Fetches JSON data from a specified file URL.
 *
 * @param {string} fileUrl - The URL of the JSON file.
 * @returns {Promise<Object>} A promise that resolves to the JSON data as an object.
 * @throws {Error} If fetching or parsing the JSON data fails.
 *
 * @example
 * getJSONData('path/to/your/file.json')
 *   .then(data => console.log(data))
 *   .catch(error => console.error('Error loading JSON:', error));
 */
async function getJSONData(fileUrl) {
  try {
    const response = await fetch(fileUrl);

    if (!response.ok) {
      throw new Error(`Failed to load JSON file: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON data:', error);
    throw error;
  }
}

/**
 * Recursively replaces shortcodes in a JSON object with values from the replacements object.
 *
 * @param {Object} JSONData - The JSON object to process.
 * @param {Object} replacements - An object where the keys are shortcodes and the values are
 *                                 the replacements for those shortcodes.
 * @returns {Object} The updated JSON object with shortcodes replaced by their corresponding values.
 */
function replaceShortcodesInJSON(JSONData, replacements) {
  // Helper function to replace shortcodes in a string
  const replaceShortcodesInString = (str) =>
    str.replace(/\[([^\]]+)\]/g, (match, key) => replacements[key] || match);

  // Recursively iterate through the JSON object
  const updatedData = JSON.parse(JSON.stringify(JSONData)); // Deep copy of JSONData
  for (const key in updatedData) {
    if (updatedData.hasOwnProperty(key)) {
      const value = updatedData[key];
      // If value is a string, replace shortcodes
      if (typeof value === 'string') {
        updatedData[key] = replaceShortcodesInString(value);
      }
      // If value is an object, recurse into it
      else if (typeof value === 'object') {
        updatedData[key] = replaceShortcodesInJSON(value, replacements);
      }
    }
  }

  return updatedData;
}

/**
 * Converts a base64 image string to a URL.
 * @param {string} base64Data - The base64 encoded image data.
 * @returns {string} The image URL.
 */
function createImageURLFromBase64(base64Data) {
  // Convert the base64 string into a Blob
  const byteCharacters = atob(base64Data.split(',')[1]); // Decode the base64 string (skip the prefix)
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset++) {
    const byte = byteCharacters.charCodeAt(offset);
    byteArrays.push(byte);
  }

  // Create a Blob from the byte array
  const blob = new Blob([new Uint8Array(byteArrays)], { type: 'image/png' });

  // Generate a URL for the Blob
  const imageURL = URL.createObjectURL(blob);

  return imageURL;
}

export {
  getHexWithOpacity,
  debounce,
  downloadFile,
  getImageData,
  getFilePondImageData,
  setImageToFilePond,
  renderToCanvas,
  applyReplacements,
  getDataFromJson,
  validateFileInput,
  getPondJSONData,
  getJSONData,
  replaceShortcodesInJSON,
  createImageURLFromBase64,
};
