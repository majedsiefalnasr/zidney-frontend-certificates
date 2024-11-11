function certificateForm() {
  // Check selected theme
  const themeInput = document.getElementById('generator_theme');
  themeInput.addEventListener('change', (event) => {
    // Update theme settings in the DOM element
    document
      .getElementById('customThemeSettings')
      .setAttribute('data-theme', event.target.value);
  });
}

export { certificateForm };
