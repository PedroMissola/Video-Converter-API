import { fileInput, videoPreview, videoPreviewContainer, loader } from './domElements.js';

export const showVideoPreview = () => {
    const files = fileInput.files;
    if (files.length === 0) {
        alert("Por favor, selecione um arquivo de vídeo.");
        return;
    }

    const videoFile = files[0];
    const videoURL = URL.createObjectURL(videoFile);

    videoPreview.src = videoURL;
    videoPreviewContainer.style.display = "block";
    videoPreview.load();
    videoPreview.play();
    loader.style.display = "block";
};