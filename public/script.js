const API_URL = '/api/breeders';

// Load breeders on page load
document.addEventListener('DOMContentLoaded', () => {
    loadBreeders();
});

// Load all breeders
async function loadBreeders() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const breedersList = document.getElementById('breedersList');
    
    loading.style.display = 'block';
    error.style.display = 'none';
    breedersList.innerHTML = '';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to load breeders');
        
        const breeders = await response.json();
        loading.style.display = 'none';
        
        if (breeders.length === 0) {
            breedersList.innerHTML = `
                <div class="empty-state">
                    <h3>No breeders found</h3>
                    <p>Be the first to add a pug breeder to the directory!</p>
                </div>
            `;
            return;
        }

        displayBreeders(breeders);
    } catch (err) {
        loading.style.display = 'none';
        error.textContent = `Error: ${err.message}`;
        error.style.display = 'block';
    }
}

// Display breeders in the grid
function displayBreeders(breeders) {
    const breedersList = document.getElementById('breedersList');
    breedersList.innerHTML = breeders.map(breeder => `
        <div class="breeder-card">
            <h3>${escapeHtml(breeder.name)}</h3>
            ${breeder.location ? `
                <div class="breeder-info">
                    <strong>📍 Location:</strong>
                    <span>${escapeHtml(breeder.location)}</span>
                </div>
            ` : ''}
            ${breeder.email ? `
                <div class="breeder-info">
                    <strong>✉️ Email:</strong>
                    <span><a href="mailto:${escapeHtml(breeder.email)}">${escapeHtml(breeder.email)}</a></span>
                </div>
            ` : ''}
            ${breeder.phone ? `
                <div class="breeder-info">
                    <strong>📞 Phone:</strong>
                    <span><a href="tel:${escapeHtml(breeder.phone)}">${escapeHtml(breeder.phone)}</a></span>
                </div>
            ` : ''}
            ${breeder.website ? `
                <div class="breeder-info">
                    <strong>🌐 Website:</strong>
                    <span><a href="${escapeHtml(breeder.website)}" target="_blank" rel="noopener">Visit Website</a></span>
                </div>
            ` : ''}
            ${breeder.experience_years ? `
                <div class="breeder-info">
                    <strong>⭐ Experience:</strong>
                    <span>${breeder.experience_years} years</span>
                </div>
            ` : ''}
            ${breeder.description ? `
                <div class="breeder-description">
                    ${escapeHtml(breeder.description)}
                </div>
            ` : ''}
            <div class="breeder-actions">
                <button onclick="editBreeder(${breeder.id})" class="btn btn-edit">Edit</button>
                <button onclick="deleteBreeder(${breeder.id})" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `).join('');
}

// Search breeders
async function searchBreeders() {
    const query = document.getElementById('searchInput').value.trim();
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const breedersList = document.getElementById('breedersList');
    
    if (!query) {
        loadBreeders();
        return;
    }

    loading.style.display = 'block';
    error.style.display = 'none';
    breedersList.innerHTML = '';

    try {
        const response = await fetch(`${API_URL}/search/${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Search failed');
        
        const breeders = await response.json();
        loading.style.display = 'none';
        
        if (breeders.length === 0) {
            breedersList.innerHTML = `
                <div class="empty-state">
                    <h3>No results found</h3>
                    <p>Try a different search term.</p>
                </div>
            `;
            return;
        }

        displayBreeders(breeders);
    } catch (err) {
        loading.style.display = 'none';
        error.textContent = `Error: ${err.message}`;
        error.style.display = 'block';
    }
}

// Clear search
function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadBreeders();
}

// Show add form
function showAddForm() {
    document.getElementById('modalTitle').textContent = 'Add New Breeder';
    document.getElementById('breederForm').reset();
    document.getElementById('breederId').value = '';
    document.getElementById('breederModal').style.display = 'block';
}

// Edit breeder
async function editBreeder(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Failed to load breeder');
        
        const breeder = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Edit Breeder';
        document.getElementById('breederId').value = breeder.id;
        document.getElementById('name').value = breeder.name || '';
        document.getElementById('location').value = breeder.location || '';
        document.getElementById('email').value = breeder.email || '';
        document.getElementById('phone').value = breeder.phone || '';
        document.getElementById('website').value = breeder.website || '';
        document.getElementById('experience_years').value = breeder.experience_years || '';
        document.getElementById('description').value = breeder.description || '';
        
        document.getElementById('breederModal').style.display = 'block';
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

// Save breeder (add or update)
async function saveBreeder(event) {
    event.preventDefault();
    
    const id = document.getElementById('breederId').value;
    const breeder = {
        name: document.getElementById('name').value,
        location: document.getElementById('location').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        website: document.getElementById('website').value,
        experience_years: document.getElementById('experience_years').value ? 
            parseInt(document.getElementById('experience_years').value) : null,
        description: document.getElementById('description').value
    };

    try {
        const url = id ? `${API_URL}/${id}` : API_URL;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(breeder)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save breeder');
        }

        closeModal();
        loadBreeders();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

// Delete breeder
async function deleteBreeder(id) {
    if (!confirm('Are you sure you want to delete this breeder?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete breeder');
        }

        loadBreeders();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

// Close modal
function closeModal() {
    document.getElementById('breederModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('breederModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Allow Enter key to trigger search
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBreeders();
    }
});


