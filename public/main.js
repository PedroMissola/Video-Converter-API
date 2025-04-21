class VideoConverter {
    constructor() {
        this.form = document.getElementById("form");
        this.fileInput = document.getElementById("file");
        this.resultDiv = document.getElementById("result");
        this.loader = document.getElementById("loader");
        this.videoPreviewContainer = document.getElementById("video-container");
        this.videoPreview = document.getElementById("video-preview");
        this.convertButton = document.getElementById("convert-button"); // Botão de conversão

        this.init();
    }

    init() {
        this.addEventListeners();
    }

    addEventListeners() {
        this.fileInput.addEventListener("change", (event) => this.handleFileChange(event));
        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.convertButton.addEventListener("click", () => this.showVideoPreview()); // Exibe o vídeo quando o botão for clicado
    }

    handleFileChange(event) {
        // Não exibe nada até o clique no botão de conversão
    }

    // Exibe o vídeo e a div de preview quando o botão de conversão for clicado
    showVideoPreview() {
        const files = this.fileInput.files;
        if (files.length === 0) {
            alert("Por favor, selecione um arquivo de vídeo.");
            return;
        }

        const videoFile = files[0];
        const videoURL = URL.createObjectURL(videoFile);

        // Define o vídeo selecionado e exibe a pré-visualização
        this.videoPreview.src = videoURL;
        this.videoPreviewContainer.style.display = "block"; // Exibe o container de vídeo
        this.videoPreview.load(); // Carrega o vídeo
        this.videoPreview.play(); // Reproduz a pré-visualização automaticamente

        // Mostra a tela de carregamento enquanto o vídeo está sendo processado
        this.loader.style.display = "block";
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.resultDiv.innerHTML = "";
        this.resultDiv.classList.remove("fade-in");

        // Esconde o loader antes de começar
        this.loader.style.display = "none";

        const files = this.fileInput.files;

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

        this.showAlert("Todos os arquivos foram verificados!", "info");

        // Exibe o loader quando a conversão começa
        this.loader.style.display = "block";

        try {
            const res = await fetch("http://localhost:3000/convert", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }

            const data = await res.json();

            // Esconde o loader após a resposta
            this.loader.style.display = "none";

            if (data.fileUrls && data.fileUrls.length > 0) {
                this.resultDiv.innerHTML = `<p class="font-normal leading-relaxed mx-auto text-slate-500 lg:text-lg text-base max-w-3xl">Conversão concluída:</p><ul>` +
                    data.fileUrls.map(url => `<button data-ripple-light="true" class="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"><a href="${url}" target="_blank">Baixar ${url.split("/").pop()}</a></button>`).join("") +
                    `</ul>`;
                this.resultDiv.classList.add("fade-in");

                this.showAlert("Conversão finalizada com sucesso!", "success");

                // Esconde o overlay de vídeo
                const videoOverlay = document.getElementById("video-overlay");
                if (videoOverlay) {
                    videoOverlay.style.display = "none";
                }

            } else {
                alert("Nenhum arquivo foi convertido.");
            }
        } catch (error) {
            // Esconde o loader em caso de erro
            this.loader.style.display = "none";
            alert("Ocorreu um erro durante a conversão.");
            console.error(error);

            this.showAlert("Erro durante a conversão. Verifique o console.", "error");
        }
    }

    showAlert(message, type = "info") {
        const colors = {
            info: "bg-slate-800",
            success: "bg-green-600",
            error: "bg-red-600",
            warning: "bg-orange-500"
        };

        const alertContainer = document.getElementById("alert-container");

        const alert = document.createElement("div");
        alert.setAttribute("role", "alert");
        alert.className = `relative flex flex-col w-full p-3 text-sm text-white ${colors[type]} rounded-md`;

        alert.innerHTML = `
        <p class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
          </svg>
          ${message}
        </p>
  
        <button class="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5" type="button">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      `;

        // Fechar alerta manualmente
        alert.querySelector("button").addEventListener("click", () => alert.remove());

        // Adiciona e remove após 7s
        alertContainer.appendChild(alert);
        setTimeout(() => alert.remove(), 7000);
    }
}

// Iniciar o gerenciador de conversão de vídeo
const videoConverter = new VideoConverter();
