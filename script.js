const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';
const TYPE_COLORS = {
  normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
  grass: '#78C850', poison: '#A040A0', ground: '#E0C068', flying: '#A890F0',
  psychic: '#F85888', bug: '#A8B820', rock: '#B8A038', ghost: '#705898',
  dragon: '#7038F8', dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC', ice: '#98D8D8', fighting: '#C03028'
};

let currentId = 1;
let showingInfo = true;

async function fetchPokemon(id) {
  const response = await fetch(`${POKEAPI_URL}/${id}`);
  if (!response.ok) throw new Error('Pokémon not found');
  return response.json();
}

function renderPokemon(data) {
  document.getElementById('pokemon-image').src = data.sprites.front_default || '';
  document.getElementById('pokemon-image').alt = data.name;
  document.getElementById('pokemon-name').textContent = data.name;

  const typesEl = document.getElementById('pokemon-types');
  typesEl.innerHTML = '';
  data.types.forEach(({ type }) => {
    const tag = document.createElement('span');
    tag.className = 'type-tag';
    tag.textContent = type.name;
    tag.style.backgroundColor = TYPE_COLORS[type.name] || '#A8A878';
    typesEl.appendChild(tag);
  });

  const height = (data.height / 10).toFixed(1);
  const weight = (data.weight / 10).toFixed(1);
  const statsMap = {};
  data.stats.forEach(({ stat, base_stat }) => { statsMap[stat.name] = base_stat; });

  document.getElementById('info-panel').innerHTML = `
    <div class="stat-row">height: ${height}m</div>
    <div class="stat-row">weight: ${weight}kg</div>
    <div class="stat-row">hp: ${statsMap.hp}</div>
    <div class="stat-row">attack: ${statsMap.attack}</div>
    <div class="stat-row">defense: ${statsMap.defense}</div>
    <div class="stat-row">special-attack: ${statsMap['special-attack']}</div>
    <div class="stat-row">special-defense: ${statsMap['special-defense']}</div>
    <div class="stat-row">speed: ${statsMap.speed}</div>
  `;

  document.getElementById('moves-panel').innerHTML = data.moves
    .map(({ move }) => `<div class="stat-row">${move.name.replace(/-/g, ' ')}</div>`)
    .join('');
}

function showPanel(isInfo) {
  showingInfo = isInfo;
  document.getElementById('info-btn').classList.toggle('active', isInfo);
  document.getElementById('moves-btn').classList.toggle('active', !isInfo);
  document.getElementById('panel-title').textContent = isInfo ? 'Info' : 'Moves';
  document.getElementById('info-panel').classList.toggle('hidden', !isInfo);
  document.getElementById('moves-panel').classList.toggle('hidden', isInfo);
}

document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentId > 1) { currentId--; fetchPokemon(currentId).then(renderPokemon); }
});
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentId < 1025) { currentId++; fetchPokemon(currentId).then(renderPokemon); }
});
document.getElementById('info-btn').addEventListener('click', () => showPanel(true));
document.getElementById('moves-btn').addEventListener('click', () => showPanel(false));

fetchPokemon(1).then(renderPokemon);
