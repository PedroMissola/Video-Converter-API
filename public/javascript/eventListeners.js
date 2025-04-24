import { form, convertButton } from './domElements.js';
import { handleSubmit } from './handleSubmit.js';
import { showVideoPreview } from './showVideoPreview.js';

// Configurar eventos
form.addEventListener("submit", handleSubmit);
convertButton.addEventListener("click", showVideoPreview);