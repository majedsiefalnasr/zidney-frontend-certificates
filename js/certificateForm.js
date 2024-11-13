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

  // Check selected side image
  const sideImageInput = document.getElementById('generator_sideImage');
  // Create a FilePond instance
  const sideImageInputPond = FilePond.create(sideImageInput, {
    // Only accept images
    acceptedFileTypes: ['image/*'],
  });

  // Check selected side image
  const backgroundImageInput = document.getElementById(
    'generator_backgroundImage'
  );
  // Create a FilePond instance
  const backgroundImageInputPond = FilePond.create(backgroundImageInput, {
    // Only accept images
    acceptedFileTypes: ['image/*'],
  });
}

export { certificateForm };
