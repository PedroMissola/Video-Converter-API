import { alertContainer } from './domElements.js';

export const showAlert = (message, type = "info") => {
    const colors = {
        info: "bg-slate-800",
        success: "bg-green-600",
        error: "bg-red-600",
        warning: "bg-orange-500"
    };

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

    alert.querySelector("button").addEventListener("click", () => alert.remove());
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 7000);
};