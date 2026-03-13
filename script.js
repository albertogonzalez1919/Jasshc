document.addEventListener('DOMContentLoaded', () => {
    const headerElement = document.getElementById('main-header');
    
    // Detectamos estado de sesión y página
    const isLoginPage = window.location.pathname.includes('login.html') || !sessionStorage.getItem('session_active');

    // 1. Inyección de HTML
    const headerHTML = `
    <div class="header-container">
        <div class="brand">
            <a href="${isLoginPage ? '#' : 'index.html'}" class="brand-link">
                <span class="brand-bar"></span>
                <span class="brand-name">Jass HC</span>
            </a>
        </div>

        ${!isLoginPage ? `
        <button type="button" class="menu-mobile-toggle">
            <i class="fas fa-bars"></i>
            <span>Menú Principal</span>
        </button>
        <nav class="nav">
            <ul class="nav-list">
                <li class="nav-item dropdown">
                    <button type="button" class="nav-link dropdown-toggle">
                        <i class="fas fa-wallet"></i>
                        <span>Finanzas</span>
                        <i class="fas fa-chevron-down arrow"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="ingresos.html"><i class="fas fa-arrow-up"></i> Ingresos</a></li>
                        <li><a href="egresos.html"><i class="fas fa-arrow-down"></i> Egresos</a></li>
                        <li><a href="cuentaxpagar.html"><i class="fas fa-clock"></i> Cuentas x Pagar</a></li>
                        <li><a href="cajaybanco.html"><i class="fas fa-university"></i> Caja y Banco</a></li>
                        <li><a href="reportes.html"><i class="fas fa-chart-bar"></i> Reportes</a></li>
                        <li><a href="registro.html"><i class="fas fa-list-alt"></i> Registro</a></li>
                    </ul>
                </li>
                <li class="nav-item dropdown">
                    <button type="button" class="nav-link dropdown-toggle">
                        <i class="fas fa-box"></i>
                        <span>Recursos</span>
                        <i class="fas fa-chevron-down arrow"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="calcularprecios.html"><i class="fas fa-calculator"></i> Calculadora Precios</a></li>
                    </ul>
                </li>
                <li class="nav-item dropdown">
                    <button type="button" class="nav-link dropdown-toggle">
                        <i class="fas fa-cog"></i>
                        <span>Configuración</span>
                        <i class="fas fa-chevron-down arrow"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a href="configuracion.html"><i class="fas fa-sliders-h"></i> Panel General</a></li>
                        <li class="divider"></li>
                        <li><a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a></li>
                    </ul>
                </li>
            </ul>
        </nav>
        <div class="nav-indicator">
            <span class="nav-dot active"></span>
            <span class="nav-dot"></span>
            <span class="nav-dot"></span>
        </div>
        ` : ''}

        <div class="header-info">
            <span id="currentDate" class="date-display"></span>
            <div id="currentTime" class="time-display">00:00</div>
            <div class="divider-vertical"></div>
            <button type="button" id="themeToggle" class="btn-theme">
                <i class="fas fa-moon"></i>
            </button>
        </div>
    </div>`;

    if (headerElement) {
        headerElement.innerHTML = headerHTML;
        startHeaderFunctions(isLoginPage);
    }

    function startHeaderFunctions(isLogin) {
        // --- RELOJ Y FECHA ---
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
            const dateStr = now.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '');
            
            const timeEl = document.getElementById('currentTime');
            const dateEl = document.getElementById('currentDate');
            
            if (timeEl) timeEl.textContent = timeStr;
            if (dateEl) dateEl.textContent = dateStr;
        };
        setInterval(updateClock, 1000);
        updateClock();

        if (!isLogin) {
            const dropdowns = document.querySelectorAll('.dropdown');
            const mobileToggle = document.querySelector('.menu-mobile-toggle');
            const mainNavList = document.querySelector('.nav-list');

            // --- LÓGICA DROPDOWNS ---
            dropdowns.forEach(dropdown => {
                const btn = dropdown.querySelector('.dropdown-toggle');
                if (!btn) return;

                btn.onclick = (e) => {
                    e.stopPropagation();
                    const isActive = dropdown.classList.contains('active');
                    
                    // Cerrar otros dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                            const arrow = d.querySelector('.arrow');
                            if(arrow) arrow.style.transform = 'rotate(0deg)';
                        }
                    });

                    // Alternar el actual
                    dropdown.classList.toggle('active');
                    const arrow = dropdown.querySelector('.arrow');
                    if(arrow) {
                        arrow.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                    }
                };
            });

            // --- LÓGICA MENÚ MÓVIL ---
            if (mobileToggle && mainNavList) {
                mobileToggle.onclick = (e) => {
                    e.stopPropagation();
                    mainNavList.classList.toggle('mobile-active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) {
                        icon.className = mainNavList.classList.contains('mobile-active') ? 'fas fa-times' : 'fas fa-bars';
                    }
                };
            }

            // --- CERRAR AL CLICAR FUERA ---
            document.addEventListener('click', (e) => {
                // Cerrar dropdowns
                dropdowns.forEach(d => {
                    if (!d.contains(e.target)) {
                        d.classList.remove('active');
                        const arrow = d.querySelector('.arrow');
                        if(arrow) arrow.style.transform = 'rotate(0deg)';
                    }
                });

                // Cerrar menú móvil si se clica fuera de él y del botón toggle
                if (mainNavList && !mainNavList.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mainNavList.classList.remove('mobile-active');
                    const icon = mobileToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
            });

            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    sessionStorage.removeItem('session_active');
                    window.location.href = 'login.html';
                };
            }
        }

        // --- MODO CLARO/OSCURO ---
        const themeBtn = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Cargar tema inicial
        const currentTheme = localStorage.getItem('theme') || 'dark';
        html.setAttribute('data-theme', currentTheme);
        
        if (themeBtn) {
            themeBtn.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            themeBtn.onclick = () => {
                const theme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
                themeBtn.innerHTML = theme === 'dark' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            };
        }
    }
});
