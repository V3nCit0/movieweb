const storageKey = 'movieweb-movies';

const defaults = [
  {
    title: 'Nightfall Protocol',
    category: 'Action',
    year: 2024,
    rating: 'PG-13',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/5PSNL1qE6VY',
    description: 'Encrypted agents go rogue when a mission unravels at midnight.'
  },
  {
    title: 'Solar Tides',
    category: 'Sci-Fi',
    year: 2023,
    rating: 'PG',
    poster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/uqJ9u7GSaYM',
    description: 'A lone engineer fights to restart a dying sun before it collapses.'
  },
  {
    title: 'Velvet Echoes',
    category: 'Drama',
    year: 2022,
    rating: 'R',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/6ZfuNTqbHE8',
    description: 'An avant-garde musician unravels family secrets on the eve of her debut.'
  },
  {
    title: 'Phantom Circuit',
    category: 'Thriller',
    year: 2024,
    rating: 'PG-13',
    poster: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/xbhCPt6PZIU',
    description: 'A hacker finds a ghost in the machine while chasing the ultimate exploit.'
  },
  {
    title: 'Azure Skies',
    category: 'Romance',
    year: 2021,
    rating: 'PG',
    poster: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/1roy4o4tqQM',
    description: 'Chance encounters at an airport spark a love story above the clouds.'
  },
  {
    title: 'Echo Ridge',
    category: 'Mystery',
    year: 2020,
    rating: 'PG-13',
    poster: 'https://images.unsplash.com/photo-1421809313281-48f03fa45e9f?auto=format&fit=crop&w=900&q=80',
    embed: 'https://www.youtube.com/embed/LXb3EKWsInQ',
    description: 'A detective returns home to solve the echo of an unsolved disappearance.'
  }
];

const state = {
  movies: [],
};

const homeRowsEl = document.getElementById('home-rows');
const libraryGridEl = document.getElementById('library-grid');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const modal = document.getElementById('player-modal');
const playerFrame = document.getElementById('player-frame');

function loadMovies() {
  try {
    const stored = localStorage.getItem(storageKey);
    state.movies = stored ? JSON.parse(stored) : defaults;
  } catch (e) {
    state.movies = defaults;
  }
}

function saveMovies() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state.movies));
  } catch (e) {
    // noop
  }
}

function groupByCategory(movies) {
  return movies.reduce((acc, movie) => {
    acc[movie.category] = acc[movie.category] || [];
    acc[movie.category].push(movie);
    return acc;
  }, {});
}

function createCard(movie) {
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="card__thumb">
      <img src="${movie.poster}" alt="${movie.title} poster" loading="lazy" />
      <div class="card__overlay"><span>Play trailer</span></div>
    </div>
    <div class="card__body">
      <h3 class="card__title">${movie.title}</h3>
      <div class="card__meta">
        <span>${movie.year}</span>
        <span>•</span>
        <span>${movie.category}</span>
        ${movie.rating ? `<span>•</span><span>${movie.rating}</span>` : ''}
      </div>
    </div>
  `;
  card.addEventListener('click', () => openPlayer(movie.embed));
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPlayer(movie.embed);
    }
  });
  return card;
}

function renderHomeRows() {
  homeRowsEl.innerHTML = '';
  const grouped = groupByCategory(state.movies);
  Object.entries(grouped).forEach(([category, movies]) => {
    const row = document.createElement('section');
    row.className = 'row';

    const header = document.createElement('div');
    header.className = 'row__header';
    header.innerHTML = `<h3 class="row__title">${category}</h3><span class="eyebrow">${movies.length} title${movies.length === 1 ? '' : 's'}</span>`;

    const scroll = document.createElement('div');
    scroll.className = 'row__scroll';
    movies.forEach((movie) => scroll.appendChild(createCard(movie)));

    row.appendChild(header);
    row.appendChild(scroll);
    homeRowsEl.appendChild(row);
  });
}

function renderFilters() {
  const categories = ['All', ...new Set(state.movies.map((m) => m.category))];
  categoryFilter.innerHTML = categories.map((cat) => `<option value="${cat}">${cat}</option>`).join('');
}

function renderLibrary() {
  libraryGridEl.innerHTML = '';
  const selectedCategory = categoryFilter.value;
  const sortBy = sortFilter.value;
  let movies = [...state.movies];

  if (selectedCategory && selectedCategory !== 'All') {
    movies = movies.filter((m) => m.category === selectedCategory);
  }

  movies.sort((a, b) => {
    if (sortBy === 'year') return b.year - a.year;
    return a.title.localeCompare(b.title);
  });

  movies.forEach((movie) => libraryGridEl.appendChild(createCard(movie)));
}

function openPlayer(src) {
  playerFrame.src = src;
  modal.hidden = false;
}

function closePlayer() {
  playerFrame.src = '';
  modal.hidden = true;
}

function bindTabs() {
  const buttons = document.querySelectorAll('.tab-button');
  const panels = document.querySelectorAll('.tab-panel');

  function activate(target) {
    buttons.forEach((btn) => {
      const isActive = btn.dataset.target === target;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    panels.forEach((panel) => {
      panel.classList.toggle('is-active', panel.id === target);
    });
  }

  buttons.forEach((btn) =>
    btn.addEventListener('click', () => activate(btn.dataset.target))
  );

  document.querySelectorAll('button[data-target], .ghost[data-target]').forEach((btn) => {
    btn.addEventListener('click', () => activate(btn.dataset.target));
  });
}

function bindFilters() {
  categoryFilter.addEventListener('change', renderLibrary);
  sortFilter.addEventListener('change', renderLibrary);
}

function bindAdminForm() {
  const form = document.getElementById('movie-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const movie = {
      title: data.get('title')?.trim() || 'Untitled',
      category: data.get('category')?.trim() || 'Uncategorized',
      year: Number(data.get('year')) || new Date().getFullYear(),
      rating: data.get('rating')?.trim(),
      poster: data.get('poster')?.trim(),
      embed: data.get('embed')?.trim(),
      description: data.get('description')?.trim(),
    };

    state.movies = [movie, ...state.movies];
    saveMovies();
    renderHomeRows();
    renderFilters();
    renderLibrary();
    form.reset();
  });
}

function bindModal() {
  modal.addEventListener('click', (event) => {
    const shouldClose = event.target.dataset.close === 'modal' || event.target === modal;
    if (shouldClose) closePlayer();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closePlayer();
  });
}

function init() {
  loadMovies();
  renderHomeRows();
  renderFilters();
  renderLibrary();
  bindTabs();
  bindFilters();
  bindAdminForm();
  bindModal();
}

init();
