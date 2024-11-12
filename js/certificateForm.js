function certificateForm() {
  // Check selected theme
  const themeInput = document.getElementById('generator_theme');
  themeInput.addEventListener('change', (event) => {
    // Update theme settings in the DOM element
    document
      .getElementById('customThemeSettings')
      .setAttribute('data-theme', event.target.value);
  });

  // Check selected side image
  const sideImageInput = document.getElementById('generator_sideImage');
  // Update side image preview
  const previewSideImageContainer = document.getElementById(
    'generator_sideImagePreview'
  );
  // Clear the file input when the button is clicked
  previewSideImageContainer
    .querySelector('.btn-close')
    .addEventListener('click', function () {
      // Reset the preview image
      previewSideImageContainer.classList.remove('active');
      if (previewSideImageContainer.querySelector('img')) {
        previewSideImageContainer.querySelector('img').remove();
      }
      // Clear the file input
      sideImageInput.value = '';
    });
  sideImageInput.addEventListener('change', (event) => {
    // Reset the preview image
    previewSideImageContainer.classList.remove('active');
    if (previewSideImageContainer.querySelector('img')) {
      previewSideImageContainer.querySelector('img').remove();
    }

    // Display the selected image
    if (event.target.files[0]) {
      const previewImage = document.createElement('img');
      previewSideImageContainer.classList.add('active');
      previewImage.src = URL.createObjectURL(event.target.files[0]);
      previewSideImageContainer.appendChild(previewImage);
    }
  });

  // Check selected background image
  const backgroundImageInput = document.getElementById(
    'generator_backgroundImage'
  );
  // Update side image preview
  const previewBackgroundImageContainer = document.getElementById(
    'generator_backgroundImagePreview'
  );
  // Clear the file input when the button is clicked
  previewBackgroundImageContainer
    .querySelector('.btn-close')
    .addEventListener('click', function () {
      // Reset the preview image
      previewBackgroundImageContainer.classList.remove('active');
      if (previewBackgroundImageContainer.querySelector('img')) {
        previewBackgroundImageContainer.querySelector('img').remove();
      }
      // Clear the file input
      backgroundImageInput.value = '';
    });
  backgroundImageInput.addEventListener('change', (event) => {
    // Reset the preview image
    previewBackgroundImageContainer.classList.remove('active');
    if (previewBackgroundImageContainer.querySelector('img')) {
      previewBackgroundImageContainer.querySelector('img').remove();
    }

    // Display the selected image
    if (event.target.files[0]) {
      const previewImage = document.createElement('img');
      previewBackgroundImageContainer.classList.add('active');
      previewImage.src = URL.createObjectURL(event.target.files[0]);
      previewBackgroundImageContainer.appendChild(previewImage);
    }
  });
}

export { certificateForm };
