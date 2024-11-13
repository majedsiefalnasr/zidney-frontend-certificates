function certificateForm() {
  // Check selected theme
  const themeInput = document.getElementById('generator_theme');
  themeInput.addEventListener('change', (event) => {
    // Update theme settings in the DOM element
    document
      .getElementById('customThemeSettings')
      .setAttribute('data-theme', event.target.value);
  });

  // Register the FilePond plugins
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginFileValidateSize
  );

  // Create a FilePond input for template data
  const templateInput = document.getElementById(
    'generator_certificateTemplate'
  );
  // Create a FilePond instance
  FilePond.create(templateInput, {
    // Only accept images
    acceptedFileTypes: ['application/json'],
  });

  // Create a FilePond input for side image
  const sideImageInput = document.getElementById('generator_sideImage');
  // Create a FilePond instance
  FilePond.create(sideImageInput, {
    // Only accept images
    acceptedFileTypes: ['image/*'],
  });

  // Create a FilePond input for background image
  const backgroundImageInput = document.getElementById(
    'generator_backgroundImage'
  );
  // Create a FilePond instance
  FilePond.create(backgroundImageInput, {
    // Only accept images
    acceptedFileTypes: ['image/*'],
  });
}

export { certificateForm };
