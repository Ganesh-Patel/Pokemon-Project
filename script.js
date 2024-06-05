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
});

let pokemonCardContainer = document.getElementById('pokemon-card-container');

function createPokemonCard(details) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <div class="id">${details.id}</div>
                <img src='${details.sprites.front_default}'/>
                <div class="name">${details.name}</div>
                <div class="type">${details.types[0].type.name}</div>
            </div>
            <div class="card-back">
                <img src='${details.sprites.back_default}'/>
                <div class="name">${details.name}</div>
                <div class="ability">${details.abilities[0].ability.name}</div>
            </div>
        </div>
    `;
    return card;
}

function filterByType(type) {
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card) {
        let pokemonType = card.querySelector('.card-front .type').innerText;
        if (pokemonType === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterByName(searchValue) {
    let allCards = document.querySelectorAll('.card');
    allCards.forEach(function(card) {
        let pokemonName = card.querySelector('.card-front .name').innerText.toLowerCase();
        if (pokemonName.startsWith(searchValue.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

async function fetchPokemon(i) {
    let data = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let result = await data.json();
    return result;
}

async function fetchMaindata() {
    for (let i = 1; i <= 200; i++) {
        let pokemon = await fetchPokemon(i);
        let card = createPokemonCard(pokemon);
        pokemonCardContainer.appendChild(card);
    }
}


