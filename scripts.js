// Zakat Calculator JavaScript

// Constants for Zakat calculations
const ZAKAT_RATES = {
    penghasilan: 0.025, // 2.5%
    emas: 0.025, // 2.5%
    fitrah: 2.5 // 2.5 kg per person
};

const NISAB_VALUES = {
    emas: 85, // 85 grams of gold
    perak: 595, // 595 grams of silver
    penghasilan: 653000 // Approximate nisab based on gold price (updated periodically)
};

// Current market prices (these should be updated regularly)
const CURRENT_PRICES = {
    emas: 1100000, // Rp per gram (example price)
    beras: 12000, // Rp per kg (example price)
    gandum: 15000 // Rp per kg (example price)
};

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateNisabDisplay();
});

// Initialize the application
function initializeApp() {
    // Set default values
    document.getElementById('jumlah-jiwa').value = 1;
    document.getElementById('harga-makanan-input').value = CURRENT_PRICES.beras;
    document.getElementById('harga-emas-input').value = CURRENT_PRICES.emas;
    
    // Show first tab by default
    showTab('penghasilan');
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Input formatting for currency inputs
    const currencyInputs = document.querySelectorAll('#penghasilan-input, #harga-emas-input, #harga-makanan-input');
    currencyInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatCurrencyInput(this);
        });
    });

    // Auto-update nisab when gold price changes
    document.getElementById('harga-emas-input').addEventListener('input', function() {
        updatePenghasilanNisab();
    });

    // Auto-update food type price
    document.getElementById('jenis-makanan').addEventListener('change', function() {
        updateFoodPrice();
    });
}

// Tab switching function
function showTab(tabName) {
    // Hide all tab contents
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to selected button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// Format currency input
function formatCurrencyInput(input) {
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
}

// Format number to Indonesian Rupiah
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Update nisab display
function updateNisabDisplay() {
    const penghasilanNisab = NISAB_VALUES.emas * CURRENT_PRICES.emas;
    document.getElementById('nisab-penghasilan').textContent = formatRupiah(penghasilanNisab);
    document.getElementById('nisab-emas').textContent = NISAB_VALUES.emas + ' gram';
    document.getElementById('ukuran-fitrah').textContent = ZAKAT_RATES.fitrah + ' kg per jiwa';
}

// Update penghasilan nisab based on current gold price
function updatePenghasilanNisab() {
    const hargaEmas = parseFloat(document.getElementById('harga-emas-input').value) || CURRENT_PRICES.emas;
    const nisabPenghasilan = NISAB_VALUES.emas * hargaEmas;
    document.getElementById('nisab-penghasilan').textContent = formatRupiah(nisabPenghasilan);
}

// Update food price based on selected type
function updateFoodPrice() {
    const jenisMakanan = document.getElementById('jenis-makanan').value;
    const hargaDefault = jenisMakanan === 'beras' ? CURRENT_PRICES.beras : CURRENT_PRICES.gandum;
    document.getElementById('harga-makanan-input').value = hargaDefault;
}

// Calculate Zakat Penghasilan
function hitungZakatPenghasilan() {
    const penghasilanInput = document.getElementById('penghasilan-input');
    const penghasilan = parseFloat(penghasilanInput.value) || 0;
    
    // Validation
    if (penghasilan <= 0) {
        alert('Mohon masukkan jumlah penghasilan yang valid!');
        penghasilanInput.focus();
        return;
    }
    
    // Calculate nisab based on current gold price
    const hargaEmas = parseFloat(document.getElementById('harga-emas-input').value) || CURRENT_PRICES.emas;
    const nisabPenghasilan = NISAB_VALUES.emas * hargaEmas;
    
    // Calculate zakat
    let zakatAmount = 0;
    let status = 'tidak-wajib';
    let statusText = 'Tidak Wajib Zakat';
    
    if (penghasilan >= nisabPenghasilan) {
        zakatAmount = penghasilan * ZAKAT_RATES.penghasilan;
        status = 'wajib';
        statusText = 'Wajib Zakat';
    }
    
    // Display results
    document.getElementById('zakat-penghasilan').textContent = formatRupiah(zakatAmount);
    document.getElementById('status-penghasilan').textContent = statusText;
    document.getElementById('status-penghasilan').className = `status ${status}`;
    document.getElementById('result-penghasilan').classList.remove('hidden');
    
    // Animate result box
    animateResultBox('result-penghasilan');
}

// Calculate Zakat Emas
function hitungZakatEmas() {
    const emasInput = document.getElementById('emas-input');
    const hargaEmasInput = document.getElementById('harga-emas-input');
    const beratEmas = parseFloat(emasInput.value) || 0;
    const hargaEmas = parseFloat(hargaEmasInput.value) || 0;
    
    // Validation
    if (beratEmas <= 0) {
        alert('Mohon masukkan berat emas yang valid!');
        emasInput.focus();
        return;
    }
    
    if (hargaEmas <= 0) {
        alert('Mohon masukkan harga emas yang valid!');
        hargaEmasInput.focus();
        return;
    }
    
    // Calculate total value
    const nilaiTotalEmas = beratEmas * hargaEmas;
    
    // Calculate zakat
    let zakatAmount = 0;
    let status = 'tidak-wajib';
    let statusText = 'Tidak Wajib Zakat';
    
    if (beratEmas >= NISAB_VALUES.emas) {
        zakatAmount = nilaiTotalEmas * ZAKAT_RATES.emas;
        status = 'wajib';
        statusText = 'Wajib Zakat';
    }
    
    // Display results
    document.getElementById('nilai-emas').textContent = formatRupiah(nilaiTotalEmas);
    document.getElementById('zakat-emas').textContent = formatRupiah(zakatAmount);
    document.getElementById('status-emas').textContent = statusText;
    document.getElementById('status-emas').className = `status ${status}`;
    document.getElementById('result-emas').classList.remove('hidden');
    
    // Animate result box
    animateResultBox('result-emas');
}

// Calculate Zakat Fitrah
function hitungZakatFitrah() {
    const hargaMakananInput = document.getElementById('harga-makanan-input');
    const jumlahJiwaInput = document.getElementById('jumlah-jiwa');
    const hargaMakanan = parseFloat(hargaMakananInput.value) || 0;
    const jumlahJiwa = parseInt(jumlahJiwaInput.value) || 1;
    
    // Validation
    if (hargaMakanan <= 0) {
        alert('Mohon masukkan harga makanan yang valid!');
        hargaMakananInput.focus();
        return;
    }
    
    if (jumlahJiwa <= 0) {
        alert('Mohon masukkan jumlah jiwa yang valid!');
        jumlahJiwaInput.focus();
        return;
    }
    
    // Calculate zakat fitrah
    const totalBeratMakanan = ZAKAT_RATES.fitrah * jumlahJiwa;
    const zakatFitrahAmount = totalBeratMakanan * hargaMakanan;
    
    // Display results
    document.getElementById('total-berat').textContent = totalBeratMakanan + ' kg';
    document.getElementById('zakat-fitrah').textContent = formatRupiah(zakatFitrahAmount);
    document.getElementById('jiwa-fitrah').textContent = jumlahJiwa + ' jiwa';
    document.getElementById('result-fitrah').classList.remove('hidden');
    
    // Animate result box
    animateResultBox('result-fitrah');
}

// Animate result box appearance
function animateResultBox(elementId) {
    const resultBox = document.getElementById(elementId);
    resultBox.style.transform = 'translateX(-20px)';
    resultBox.style.opacity = '0';
    
    setTimeout(() => {
        resultBox.style.transform = 'translateX(0)';
        resultBox.style.opacity = '1';
    }, 100);
}

// Add input validation for numeric inputs
function validateNumericInput(input, min = 0) {
    const value = parseFloat(input.value);
    if (isNaN(value) || value < min) {
        input.style.borderColor = '#dc3545';
        return false;
    } else {
        input.style.borderColor = '#28a745';
        return true;
    }
}

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const numericInputs = document.querySelectorAll('input[type="number"]');
    
    numericInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateNumericInput(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling on input
            this.style.borderColor = '#e0e0e0';
        });
    });
});

// Add smooth scrolling to result sections
function scrollToResult(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
}

// Enhanced calculation functions with scroll
function hitungZakatPenghasilanEnhanced() {
    hitungZakatPenghasilan();
    setTimeout(() => scrollToResult('result-penghasilan'), 300);
}

function hitungZakatEmasEnhanced() {
    hitungZakatEmas();
    setTimeout(() => scrollToResult('result-emas'), 300);
}

function hitungZakatFitrahEnhanced() {
    hitungZakatFitrah();
    setTimeout(() => scrollToResult('result-fitrah'), 300);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt + 1, 2, 3 for tab switching
    if (e.altKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showTab('penghasilan');
                break;
            case '2':
                e.preventDefault();
                showTab('emas');
                break;
            case '3':
                e.preventDefault();
                showTab('fitrah');
                break;
        }
    }
    
    // Enter key to calculate in focused section
    if (e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            const calculateBtn = activeTab.querySelector('.calculate-btn');
            if (calculateBtn) {
                calculateBtn.click();
            }
        }
    }
});

// Add loading animation for calculations
function showLoadingAnimation(buttonId) {
    const button = document.getElementById(buttonId);
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<div class="loading"></div> Menghitung...';
        button.disabled = true;
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1000);
    }
}

// Print results function
function printResults() {
    const printWindow = window.open('', '', 'width=800,height=600');
    const activeTab = document.querySelector('.tab-content.active');
    const resultBox = activeTab.querySelector('.result-box:not(.hidden)');
    
    if (resultBox) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Hasil Perhitungan Zakat</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #667eea; }
                        .result-item { margin: 10px 0; padding: 10px; border-bottom: 1px solid #eee; }
                        .amount { color: #28a745; font-weight: bold; }
                        .status { padding: 5px 10px; border-radius: 15px; }
                        .wajib { background: #28a745; color: white; }
                        .tidak-wajib { background: #dc3545; color: white; }
                    </style>
                </head>
                <body>
                    <h1>Hasil Perhitungan Zakat</h1>
                    <p>Tanggal: ${new Date().toLocaleDateString('id-ID')}</p>
                    ${resultBox.innerHTML}
                    <br>
                    <p><em>Aplikasi ini dibuat sebagai alat bantu edukatif. Untuk keputusan akhir, dianjurkan berkonsultasi dengan lembaga zakat terpercaya.</em></p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Update prices from API (placeholder function)
async function updatePricesFromAPI() {
    try {
        // This would be replaced with actual API calls
        // const response = await fetch('https://api.example.com/prices');
        // const data = await response.json();
        
        // For now, just show a notification
        console.log('Prices updated successfully');
    } catch (error) {
        console.error('Failed to update prices:', error);
    }
}

// Initialize tooltips for better UX
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + 'px';
            tooltip.style.top = (rect.top - 30) + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
} 
