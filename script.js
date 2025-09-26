// ==================== DARK MODE FUNCTIONALITY ====================
class DarkModeHandler {
    constructor() {
        this.isDarkMode = false;
        this.starElement = document.querySelector('.star-decoration');
        this.setupStarClickListener();
        this.loadDarkModePreference();
    }

    setupStarClickListener() {
        if (this.starElement) {
            this.starElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.triggerSmile(); // Senyum dulu
                setTimeout(() => {
                    this.toggleDarkMode(); // Lalu toggle dark mode
                }, 100); // Beri jeda kecil
            });
        }
    }

    triggerSmile() {
        if (this.starElement) {
            // Hapus class smiling jika masih ada
            this.starElement.classList.remove('smiling');
            
            // Force reflow untuk reset animation
            void this.starElement.offsetWidth;
            
            // Tambah class smiling
            setTimeout(() => {
                this.starElement.classList.add('smiling');
            }, 10);
            
            // Hapus setelah 2 detik
            setTimeout(() => {
                this.starElement.classList.remove('smiling');
            }, 2000);
        }
    }

    toggleDarkMode() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        this.saveDarkModePreference();
        this.animateStar();
    }

    animateStar() {
        if (this.starElement) {
            this.starElement.style.transform = 'translate(-50%, -50%) scale(1.2)';
            setTimeout(() => {
                this.starElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 300);
        }
    }

    saveDarkModePreference() {
        localStorage.setItem('darkMode', this.isDarkMode);
    }

    loadDarkModePreference() {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode !== null) {
            this.isDarkMode = savedMode === 'true';
            document.body.classList.toggle('dark-mode', this.isDarkMode);
        }
    }
}

// ==================== CONTACT FUNCTIONALITY ====================
class ContactHandler {
    initContactLinks() {
        document.querySelectorAll('.contact-link-item').forEach(item => {
            item.removeEventListener('click', this.handleContactClick);
            item.addEventListener('click', this.handleContactClick.bind(this));
        });
    }

    handleContactClick(e) {
        e.stopPropagation();
        const item = e.currentTarget;
        const type = item.dataset.type;
        const link = item.dataset.link;
        
        if (type === 'email') {
            e.preventDefault();
            this.openGmailCompose(link);
        }
    }
    
    openGmailCompose(email) {
        const subject = 'Hello Liona';
        const body = 'Hi Liona, I saw your portfolio and I would like to contact you about...';
        const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailComposeUrl, '_blank');
    }
}

// ==================== PDF FUNCTIONALITY ====================
class PDFViewer {
    openPDF(pdfFile, pdfTitle) {
        window.open(`assets/cv/${pdfFile}`, '_blank');
    }
}

// ==================== PROJECT DETAIL FUNCTIONALITY ====================
class ProjectDetailHandler {
    constructor() {
        this.setupProjectCardListeners();
    }

    setupProjectCardListeners() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const projectId = card.dataset.project;
                this.openProjectDetail(projectId);
            });
        });
    }

    openProjectDetail(projectId) {
        const detailPopup = document.getElementById(`${projectId}DetailPopup`);
        if (detailPopup) {            
            // Open detail popup
            openPopupDirectly(detailPopup);
        }
    }
}

// ==================== POPUP MANAGEMENT ====================
const buttons = document.querySelectorAll('.button');
const popupOverlay = document.getElementById('popupOverlay');
const popups = document.querySelectorAll('.popup-window');

let zIndexCounter = 1001;
let activePopups = [];
let lastOpenedPopup = null;

// Initialize handlers
const darkModeHandler = new DarkModeHandler();
const contactHandler = new ContactHandler();
const pdfViewer = new PDFViewer();
const projectDetailHandler = new ProjectDetailHandler();

// Button hover effects
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        buttons.forEach(b => {
            if(b !== btn){
                b.classList.add('dimmed');
            } else {
                b.classList.add('hovered');
            }
        });
    });

    btn.addEventListener('mouseleave', () => {
        buttons.forEach(b => {
            b.classList.remove('dimmed', 'hovered');
        });
    });
    
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const buttonId = btn.id;
        openPopup(buttonId);
    });
});

// PDF action event listeners
document.addEventListener('click', (e) => {
    if (e.target.closest('.zoom-pdf')) {
        const pdfItem = e.target.closest('.pdf-item');
        const pdfFile = pdfItem.dataset.pdf;
        const pdfTitle = pdfItem.dataset.title || 'CV';
        pdfViewer.openPDF(pdfFile, pdfTitle);
        e.stopPropagation();
    }
    
    if (e.target.closest('.pdf-item') && !e.target.closest('.zoom-pdf')) {
        const pdfItem = e.target.closest('.pdf-item');
        const pdfFile = pdfItem.dataset.pdf;
        const pdfTitle = pdfItem.dataset.title || 'CV';
        pdfViewer.openPDF(pdfFile, pdfTitle);
        e.stopPropagation();
    }
});

// ==================== POPUP FUNCTIONS ====================
function openPopup(type) {
    const popup = document.getElementById(`${type}Popup`);
    
    if (popup) {
        if (lastOpenedPopup) {
            lastOpenedPopup.classList.remove('recently-opened');
        }
        
        if (!popup.classList.contains('active')) {
            activePopups.push(popup);
            
            if (activePopups.length === 1) {
                popupOverlay.classList.add('active');
            }
            
            popup.classList.add('active');
            bringToFront(popup);
            centerPopup(popup);
            makeDraggable(popup);
            
            if (type === 'contact') {
                contactHandler.initContactLinks();
            }
            
        } else {
            bringToFront(popup);
        }
        
        popup.classList.add('recently-opened');
        lastOpenedPopup = popup;
        
        setTimeout(() => {
            if (popup.classList.contains('recently-opened')) {
                popup.classList.remove('recently-opened');
            }
        }, 2000);
    }
}

function openPopupDirectly(popup) {
    if (lastOpenedPopup) {
        lastOpenedPopup.classList.remove('recently-opened');
    }
    
    if (!popup.classList.contains('active')) {
        activePopups.push(popup);
        
        if (activePopups.length === 1) {
            popupOverlay.classList.add('active');
        }
        
        popup.classList.add('active');
        bringToFront(popup);
        centerPopup(popup);
        makeDraggable(popup);
    } else {
        bringToFront(popup);
    }
    
    popup.classList.add('recently-opened');
    lastOpenedPopup = popup;
    
    setTimeout(() => {
        if (popup.classList.contains('recently-opened')) {
            popup.classList.remove('recently-opened');
        }
    }, 2000);
}

function bringToFront(popup) {
    zIndexCounter++;
    popup.style.zIndex = zIndexCounter;
}

function closePopup(popup) {
    const index = activePopups.indexOf(popup);
    if (index > -1) {
        activePopups.splice(index, 1);
    }
    
    popup.classList.remove('active', 'recently-opened');
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.left = '50%';
    popup.style.top = '50%';
    
    if (activePopups.length === 0) {
        popupOverlay.classList.remove('active');
    }
    
    if (lastOpenedPopup === popup) {
        lastOpenedPopup = null;
    }
}

function closeAllPopups() {
    activePopups.forEach(popup => {
        popup.classList.remove('active', 'recently-opened');
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.left = '50%';
        popup.style.top = '50%';
    });
    
    activePopups = [];
    popupOverlay.classList.remove('active');
    lastOpenedPopup = null;
}

function centerPopup(popup) {
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
}

function makeDraggable(popup) {
    const header = popup.querySelector('.popup-header');
    let isDragging = false;
    let startX, startY, initialX, initialY;

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);

    function dragStart(e) {
        bringToFront(popup);
        isDragging = true;
        const rect = popup.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        startX = e.clientX;
        startY = e.clientY;
        e.preventDefault();
    }

    function dragEnd() {
        isDragging = false;
    }

    function drag(e) {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;
        popup.style.left = newX + 'px';
        popup.style.top = newY + 'px';
        popup.style.transform = 'none';
    }
}

// Close popups only when clicking close button
document.querySelectorAll('.popup-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const popup = closeBtn.closest('.popup-window');
        closePopup(popup);
    });
});

// Clicking on popup brings it to front
popups.forEach(popup => {
    popup.addEventListener('mousedown', (e) => {
        if (e.target.closest('.popup-close')) return;
        bringToFront(popup);
        
        if (lastOpenedPopup) {
            lastOpenedPopup.classList.remove('recently-opened');
        }
        popup.classList.add('recently-opened');
        lastOpenedPopup = popup;
        
        setTimeout(() => {
            popup.classList.remove('recently-opened');
        }, 2000);
    });
});

// Close with Escape key (closes all)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllPopups();
    }
});

// Overlay click does nothing
popupOverlay.addEventListener('click', (e) => {
    e.stopPropagation();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Portfolio loaded successfully!');
    
    // Test if buttons are working
    buttons.forEach(btn => {
        console.log(`Button ${btn.id} is attached`);
    });
});
