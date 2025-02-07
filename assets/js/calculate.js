// Constants and Configuration
const CONFIG = {
    API_KEY: ''
};

// API Service class
class ShippingService {
    static async getProvinces() {
        try {
            console.log('Fetching provinces...');
            const response = await fetch('https://api.rajaongkir.com/starter/province', {
                method: 'GET',
                headers: {
                    'key': CONFIG.API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            if (data.rajaongkir.status.code !== 200) {
                throw new Error(data.rajaongkir.status.description);
            }

            return data.rajaongkir.results;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            throw error;
        }
    }

    static async getCities(provinceId) {
        try {
            const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
                method: 'GET',
                headers: {
                    'key': CONFIG.API_KEY
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.rajaongkir.results;
        } catch (error) {
            console.error('Error fetching cities:', error);
            throw error;
        }
    }

    static async calculateShipping(origin, destination, weight, courier) {
        try {
            const formData = new URLSearchParams();
            formData.append('origin', origin);
            formData.append('destination', destination);
            formData.append('weight', weight);
            formData.append('courier', courier);

            const response = await fetch('https://api.rajaongkir.com/starter/cost', {
                method: 'POST',
                headers: {
                    'key': CONFIG.API_KEY,
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.rajaongkir.results[0].costs;
        } catch (error) {
            console.error('Error calculating shipping:', error);
            throw error;
        }
    }
}

// UI Handler class
class ShippingCalculatorUI {
    constructor() {
        this.elements = {
            originProvince: document.getElementById('originProvince'),
            originCity: document.getElementById('originCity'),
            destProvince: document.getElementById('destProvince'),
            destCity: document.getElementById('destCity'),
            weight: document.getElementById('weight'),
            courier: document.getElementById('courier'),
            calculateBtn: document.getElementById('calculateBtn'),
            resultDiv: document.getElementById('calculationResult'),
            loadingDiv: document.getElementById('loadingIndicator')
        };

        this.init();
    }

    async init() {
        try {
            this.validateElements();
            this.initializeEventListeners();
            await this.initializeForm();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showError(`Initialization failed: ${error.message}`);
        }
    }

    validateElements() {
        Object.entries(this.elements).forEach(([key, element]) => {
            if (!element) {
                throw new Error(`Required element "${key}" not found in the DOM`);
            }
        });
    }

    showLoading(show = true) {
        if (this.elements.loadingDiv) {
            this.elements.loadingDiv.style.display = show ? 'block' : 'none';
        }
        if (this.elements.calculateBtn) {
            this.elements.calculateBtn.disabled = show;
        }
    }

    showError(message) {
        console.error(message);
        if (this.elements.resultDiv) {
            this.elements.resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    ${message}
                </div>`;
        }
    }

    async loadCities(provinceId, targetElement) {
        if (!provinceId) {
            targetElement.innerHTML = '<option value="">Select City</option>';
            return;
        }

        try {
            this.showLoading(true);
            const cities = await ShippingService.getCities(provinceId);
            
            targetElement.innerHTML = '<option value="">Select City</option>';
            cities.forEach(city => {
                targetElement.add(new Option(city.city_name, city.city_id));
            });
        } catch (error) {
            this.showError(`Failed to load cities: ${error.message}`);
            targetElement.innerHTML = '<option value="">Error loading cities</option>';
        } finally {
            this.showLoading(false);
        }
    }

    async initializeForm() {
        console.log('Initializing form...');
        this.showLoading(true);

        try {
            const provinces = await ShippingService.getProvinces();
            console.log('Loaded provinces:', provinces);

            if (!Array.isArray(provinces)) {
                throw new Error('Invalid provinces data received');
            }

            // Reset province dropdowns
            this.elements.originProvince.innerHTML = '<option value="">Select Province</option>';
            this.elements.destProvince.innerHTML = '<option value="">Select Province</option>';

            // Add province options
            provinces.forEach(province => {
                const option = new Option(province.province, province.province_id);
                this.elements.originProvince.add(option.cloneNode(true));
                this.elements.destProvince.add(option);
            });
        } catch (error) {
            this.showError(`Failed to load provinces: ${error.message}`);
        } finally {
            this.showLoading(false);
        }
    }

    initializeEventListeners() {
        this.elements.originProvince.addEventListener('change', (e) => 
            this.loadCities(e.target.value, this.elements.originCity));

        this.elements.destProvince.addEventListener('change', (e) => 
            this.loadCities(e.target.value, this.elements.destCity));

        this.elements.calculateBtn.addEventListener('click', (e) => 
            this.handleCalculateClick(e));
    }

    async handleCalculateClick(e) {
        e.preventDefault();
        
        try {
            this.validateForm();
            this.showLoading(true);

            const costs = await ShippingService.calculateShipping(
                this.elements.originCity.value,
                this.elements.destCity.value,
                this.elements.weight.value,
                this.elements.courier.value
            );

            this.displayResults(costs);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    validateForm() {
        const requiredFields = {
            'Origin City': this.elements.originCity.value,
            'Destination City': this.elements.destCity.value,
            'Weight': this.elements.weight.value,
            'Courier': this.elements.courier.value
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([field]) => field);

        if (emptyFields.length > 0) {
            throw new Error(`Please fill in the following fields: ${emptyFields.join(', ')}`);
        }
    }

    displayResults(costs) {
        if (!costs || costs.length === 0) {
            this.elements.resultDiv.innerHTML = `
                <div class="alert alert-warning">
                    No shipping options available for the selected route.
                </div>`;
            return;
        }

        const resultsHTML = costs.map(service => `
            <div class="alert alert-info">
                <h5>${service.service} (${service.description})</h5>
                <p>Cost: Rp ${service.cost[0].value.toLocaleString()}</p>
                <p>Estimated delivery: ${service.cost[0].etd} days</p>
            </div>
        `).join('');

        this.elements.resultDiv.innerHTML = resultsHTML;
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.shippingCalculator = new ShippingCalculatorUI();
    } catch (error) {
        console.error('Failed to initialize shipping calculator:', error);
        alert('Failed to initialize the application. Please refresh the page.');
    }
});