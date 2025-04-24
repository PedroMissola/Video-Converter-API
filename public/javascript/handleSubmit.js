import { fileInput, resultDiv, loader } from './domElements.js';
import { showAlert } from './showAlert.js';

export const handleSubmit = async (event) => {
    event.preventDefault();
    resultDiv.innerHTML = "";
    resultDiv.classList.remove("fade-in");
    loader.style.display = "none";

    const files = fileInput.files;
    if (files.length === 0) {
        alert("Por favor, selecione ao menos um arquivo WebM.");
        return;
    }

    const formData = new FormData();
    let validFilesCount = 0;

    for (const file of files) {
        if (file.size > 50 * 1024 * 1024) {
            alert(`O arquivo "${file.name}" excede 50MB e será ignorado.`);
            continue;
        }
        formData.append("files", file);
        validFilesCount++;
    }

    if (validFilesCount === 0) {
        alert("Nenhum arquivo válido para envio.");
        return;
    }

    showAlert("Todos os arquivos foram verificados!", "info");
    loader.style.display = "block";

    try {
        const res = await fetch("http://localhost:3030/convert", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

        const data = await res.json();
        loader.style.display = "none";

        if (data.fileUrls?.length > 0) {
            const buttonsHTML = data.fileUrls.map(url =>
                `<button class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg ml-2">
                    <a href="${url}" target="_blank">Baixar ${url.split("/").pop()}</a>
                </button>`
            ).join("");

            resultDiv.innerHTML = `
                <p class="font-normal leading-relaxed mx-auto text-slate-500 lg:text-lg text-base max-w-3xl">
                    Conversão concluída:
                </p>
                <ul>
                    ${buttonsHTML}
                </ul>
            `;

            resultDiv.classList.add("fade-in");
            showAlert("Conversão finalizada com sucesso!", "success");
            const videoOverlay = document.getElementById("video-overlay");
            if (videoOverlay) {
                videoOverlay.style.display = "none";
            }
        } else {
            alert("Nenhum arquivo foi convertido.");
        }
    } catch (error) {
        loader.style.display = "none";
        alert("Ocorreu um erro durante a conversão.");
        console.error(error);
        showAlert("Erro durante a conversão. Verifique o console.", "error");
    }
};