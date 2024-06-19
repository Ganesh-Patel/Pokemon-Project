document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filter').addEventListener('click', function() {
        const type = document.getElementById('type').value;
        filterByType(type);
    });

    document.getElementById('search').addEventListener('input', function() {
        const searchValue = document.getElementById('search').value;
        filterByName(searchValue);
    });

    fetchMaindata();

    const reset = document.getElementById('resetBtn');
    reset.addEventListener('click', function() {
        location.reload();
    });

    document.getElementById('nextBtn').addEventListener('click', function() {
        if (currentPage * ITEMS_PER_PAGE >= filteredData.length) {
            alert("You are already at the last page.");
        } else {
            currentPage++;
            displayData();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentPage <= 1) {
            alert("You are already at the first page.");
        } else {
            currentPage--;
            displayData();
        }
    });
});

const ITEMS_PER_PAGE = 12;
const TOTAL_ITEMS = 200;
const BATCH_SIZE = 12; // Number of items to fetch in each batch
let currentPage = 1;
let allData = [];
let filteredData = [];

let pokemonCardContainer = document.getElementById('pokemon-card-container');
let loadingSpinner = document.getElementById('loading-spinner');

function createPokemonCard(details) {
    console.log(details);
    let abilities = details.abilities.map(ability => ability.ability.name).join(', ');
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front" id="${details.types[0].type.name}">
                <div class="id">${details.id}</div>
                <div class="imgg"><img src='${details.sprites.front_default}'/></div>
                <div class="name">${details.name}</div>
                <div class="type">${details.types[0].type.name}</div>
            </div>
            <div class="card-back" id="${details.types[0].type.name}">
                <img src='${details.sprites.back_default}'/>
                <div class="name">${details.name}</div>
                <div class="abilities">${abilities}</div>
            </div>
        </div>
    `;
    return card;
}

function displayData() {
    pokemonCardContainer.innerHTML = ''; // Clear previous cards
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length);
    
    for (let i = start; i < end; i++) {
        let card = createPokemonCard(filteredData[i]);
        pokemonCardContainer.appendChild(card);
    }
}

function filterByType(type) {
    filteredData = allData.filter(pokemon => 
        // pokemon.types.some(t => t.type.name === type)
        pokemon.types[0].type.name.toLowerCase() === type.toLowerCase();
    );
    currentPage = 1;
    displayData();
}

function filterByName(searchValue) {
    filteredData = allData.filter(pokemon =>
        pokemon.name.toLowerCase().startsWith(searchValue.toLowerCase())
    );
    currentPage = 1;
    displayData();
}

async function fetchPokemon(i) {
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let result = await data.json();
    return result;
}

async function fetchMaindata() {
    for (let i = 1; i <= TOTAL_ITEMS; i += BATCH_SIZE) {
        const fetchPromises = [];
        for (let j = i; j < i + BATCH_SIZE && j <= TOTAL_ITEMS; j++) {
            fetchPromises.push(fetchPokemon(j));
        }
        const batchResults = await Promise.all(fetchPromises);
        allData.push(...batchResults);
        filteredData = allData;
        displayData();
    }
    loadingSpinner.style.display = 'none';
}
