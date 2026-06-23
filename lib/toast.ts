type ToastType = 'success' | 'error' | 'warning' | 'info'

const icons = {
  success: '✓', error: '✕', warning: '⚠', info: 'ℹ'
}

function show(type: ToastType, title: string, message?: string) {
  const container = document.getElementById('toast-container')!
  const el = document.createElement('div')
  el.className = `toast toast-${type}`
  el.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-body">
      <p class="toast-title">${title}</p>
      ${message ? `<p class="toast-msg">${message}</p>` : ''}
    </div>
    <button onclick="this.closest('.toast').remove()">✕</button>
  `
  container.appendChild(el)
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')))
  setTimeout(() => { el.classList.add('hide'); setTimeout(() => el.remove(), 400) }, 3000)
}

export const toast = {
  success: (title: string, msg?: string) => show('success', title, msg),
  error:   (title: string, msg?: string) => show('error',   title, msg),
  warning: (title: string, msg?: string) => show('warning', title, msg),
  info:    (title: string, msg?: string) => show('info',    title, msg),
}