export const setDurationButtonsDisabled = (isDisabled) => {
  const durationButtons = document.querySelectorAll(
    '.share-field-wrapper input[type="radio"]'
  );

  durationButtons.forEach((btn) => {
    btn.disabled = isDisabled;
  });
};
