const STORAGE_KEY = 'studyshelf-resources-v1';
const BOOKMARK_KEY = 'studyshelf-bookmarks-v1';

const sampleResources = [
  {
    id: 1,
    title: 'Data Structures Notes',
    description: 'Clear notes covering queues, stacks, trees, graphs, and algorithmic thinking with examples for B.Tech students.',
    category: 'Programming',
    course: 'B.Tech',
    subject: 'Data Structures',
    semester: 'Semester 3',
    type: 'Lecture Notes',
    tags: ['arrays', 'trees', 'algorithms'],
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'approved',
    downloads: 142,
    ratingTotal: 38,
    ratingCount: 9,
    dateAdded: '2025-09-01'
  },
  {
    id: 2,
    title: 'Python Programming Lab Manual',
    description: 'A practical Python guide with exercises, coding patterns, and sample programs for beginners and intermediate learners.',
    category: 'Computer Science',
    course: 'BCA',
    subject: 'Python Programming',
    semester: 'Semester 2',
    type: 'PDF Notes',
    tags: ['python', 'coding', 'lab'],
    url: 'https://www.africau.edu/images/default/sample.pdf',
    status: 'approved',
    downloads: 96,
    ratingTotal: 34,
    ratingCount: 8,
    dateAdded: '2025-10-11'
  },
  {
    id: 3,
    title: 'Engineering Mathematics Formula Sheet',
    description: 'Quick revision of integration, differentiation, matrices, probability, and vector formulas for engineering students.',
    category: 'Mathematics',
    course: 'B.Tech',
    subject: 'Engineering Mathematics',
    semester: 'Semester 1',
    type: 'Study Guides',
    tags: ['maths', 'revision', 'formula'],
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'approved',
    downloads: 210,
    ratingTotal: 46,
    ratingCount: 11,
    dateAdded: '2025-09-21'
  },
  {
    id: 4,
    title: 'Operating Systems Previous Year Papers',
    description: 'Collection of previous year question papers with model questions and probable exam patterns for OS.',
    category: 'Previous Year Papers',
    course: 'B.Tech',
    subject: 'Operating Systems',
    semester: 'Semester 4',
    type: 'Previous Year Question Papers',
    tags: ['exam', 'os', 'paper'],
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    status: 'approved',
    downloads: 88,
    ratingTotal: 29,
    ratingCount: 7,
    dateAdded: '2025-10-09'
  },
  {
    id: 5,
    title: 'Communication Skills Assignment Kit',
    description: 'Assignment prompts, writing structure, and presentation ideas for improving speaking, writing, and teamwork skills.',
    category: 'Assignments',
    course: 'BA',
    subject: 'Communication Skills',
    semester: 'Semester 2',
    type: 'Assignments',
    tags: ['assignment', 'writing', 'presentation'],
    url: 'https://www.example.com/communication-skills-assignment',
    status: 'approved',
    downloads: 54,
    ratingTotal: 24,
    ratingCount: 6,
    dateAdded: '2025-11-02'
  },
  {
    id: 6,
    title: 'Physics Practical Notebook',
    description: 'Experiment list, observations, and report writing tips for first-year physics practicals.',
    category: 'Physics',
    course: 'B.Sc',
    subject: 'Physics Practical',
    semester: 'Semester 1',
    type: 'Reference Materials',
    tags: ['physics', 'practical', 'lab'],
    url: 'https://www.example.com/physics-practical',
    status: 'pending',
    downloads: 0,
    ratingTotal: 0,
    ratingCount: 0,
    dateAdded: '2025-11-06'
  }
];

function loadResources() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResources));
    return [...sampleResources];
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (error) {
    console.error('Could not parse saved resources:', error);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleResources));
  return [...sampleResources];
}

function saveResources(resources) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
}

function getBookmarks() {
  const saved = localStorage.getItem(BOOKMARK_KEY);

  if (!saved) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify([]));
    return [];
  }

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Could not parse bookmarks:', error);
    return [];
  }
}

function saveBookmarks(bookmarks) {
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAverageRating(resource) {
  if (!resource || resource.ratingCount === 0) {
    return 0;
  }

  return Number((resource.ratingTotal / resource.ratingCount).toFixed(1));
}

function renderCategoryCards() {
  const approvedResources = resources.filter((resource) => resource.status === 'approved');
  const grouped = {};

  approvedResources.forEach((resource) => {
    grouped[resource.category] = (grouped[resource.category] || 0) + 1;
  });

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const categoryList = document.getElementById('categoryList');

  if (!entries.length) {
    categoryList.innerHTML = '<div class="empty-state">No categories yet.</div>';
    return;
  }

  categoryList.innerHTML = entries.map(([name, count]) => `
    <div class="category-card">
      <h3>${escapeHtml(name)}</h3>
      <p>${count} resources</p>
    </div>
  `).join('');
}

function renderStats() {
  const approvedResources = resources.filter((resource) => resource.status === 'approved');
  const totalCategories = new Set(approvedResources.map((resource) => resource.category)).size;
  const totalBookmarks = getBookmarks().length;
  const topCategory = Object.entries(
    approvedResources.reduce((grouped, resource) => {
      grouped[resource.category] = (grouped[resource.category] || 0) + 1;
      return grouped;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0];

  document.getElementById('statusResourceCount').textContent = approvedResources.length;
  document.getElementById('statusCategoryCount').textContent = totalCategories;
  document.getElementById('statusBookmarkCount').textContent = totalBookmarks;
  document.getElementById('topCategoryLabel').textContent = topCategory ? topCategory[0] : 'Programming';
}

function getVisibleResources() {
  const searchValue = document.getElementById('searchInput').value.trim().toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const courseFilter = document.getElementById('courseFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  const semesterFilter = document.getElementById('semesterFilter').value;
  const sortFilter = document.getElementById('sortFilter').value;

  const approvedResources = resources.filter((resource) => resource.status === 'approved');

  let filtered = approvedResources.filter((resource) => {
    const matchesSearch = !searchValue || [
      resource.title,
      resource.subject,
      resource.course,
      resource.category,
      resource.tags.join(' '),
      resource.description
    ].join(' ').toLowerCase().includes(searchValue);

    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesCourse = courseFilter === 'all' || resource.course === courseFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesSemester = semesterFilter === 'all' || resource.semester === semesterFilter;

    return matchesSearch && matchesCategory && matchesCourse && matchesType && matchesSemester;
  });

  if (sortFilter === 'rating') {
    filtered = filtered.sort((a, b) => getAverageRating(b) - getAverageRating(a));
  } else if (sortFilter === 'downloads') {
    filtered = filtered.sort((a, b) => b.downloads - a.downloads);
  } else {
    filtered = filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }

  return filtered;
}

function renderResourceCard(resource) {
  const isBookmarked = getBookmarks().includes(resource.id);
  const average = getAverageRating(resource);
  const starButtons = [1, 2, 3, 4, 5]
    .map((value) => `<button type="button" class="star-btn ${value <= Math.round(average) ? 'active' : ''}" data-rate="${value}" data-resource-id="${resource.id}" aria-label="Rate ${value} stars">★</button>`)
    .join('');

  const tags = (resource.tags || [])
    .slice(0, 3)
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('');

  return `
    <article class="resource-card">
      <div class="resource-meta">
        <span class="pill">${escapeHtml(resource.category)}</span>
        <span class="pill">${escapeHtml(resource.course)}</span>
      </div>

      <h3>${escapeHtml(resource.title)}</h3>

      <div class="resource-meta-inline">
        <span class="pill">${escapeHtml(resource.subject)}</span>
        <span class="pill">${escapeHtml(resource.semester)}</span>
      </div>

      <p class="resource-description">${escapeHtml(resource.description)}</p>

      <div class="tag-list">${tags}</div>

      <div class="resource-footer">
        <div class="rating-row">
          <div class="star-group">${starButtons}</div>
          <span>${average.toFixed(1)} avg</span>
        </div>

        <div class="resource-meta-inline">
          <span class="pill">📥 ${resource.downloads} downloads</span>
          <span class="pill">${escapeHtml(resource.type)}</span>
        </div>

        <div class="action-row">
          <button type="button" class="action-btn" data-open-resource="${resource.id}">Preview</button>
          <button type="button" class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-bookmark-resource="${resource.id}">
            ${isBookmarked ? 'Saved' : 'Bookmark'}
          </button>
          <a href="${escapeHtml(resource.url)}" class="small-btn" data-download-resource="${resource.id}" target="_blank" rel="noopener noreferrer">Open</a>
        </div>
      </div>
    </article>
  `;
}

function renderResources() {
  const filteredResources = getVisibleResources();
  const resultCount = document.getElementById('resultCount');
  const resourceList = document.getElementById('resourceList');

  resultCount.textContent = `${filteredResources.length} resource(s) found`;

  if (!filteredResources.length) {
    resourceList.innerHTML = '<div class="empty-state">No matching resources found. Try changing your filters or search term.</div>';
    return;
  }

  resourceList.innerHTML = filteredResources.map(renderResourceCard).join('');
}

function renderBookmarks() {
  const bookmarkIds = getBookmarks();
  const bookmarkList = document.getElementById('bookmarkList');
  const bookmarkedResources = resources.filter((resource) => bookmarkIds.includes(resource.id) && resource.status === 'approved');

  if (!bookmarkedResources.length) {
    bookmarkList.innerHTML = '<div class="empty-state">Your saved resources will appear here.</div>';
    return;
  }

  bookmarkList.innerHTML = bookmarkedResources.map(renderResourceCard).join('');
}

function renderModerationBoard() {
  const pendingResources = resources.filter((resource) => resource.status === 'pending');
  const moderationList = document.getElementById('moderationList');

  if (!pendingResources.length) {
    moderationList.innerHTML = '<div class="empty-state">No pending resources right now.</div>';
    return;
  }

  moderationList.innerHTML = pendingResources.map((resource) => `
    <article class="moderation-card">
      <div class="resource-meta-inline">
        <span class="pill">${escapeHtml(resource.category)}</span>
        <span class="pill">${escapeHtml(resource.course)}</span>
      </div>
      <h3>${escapeHtml(resource.title)}</h3>
      <p class="resource-description">${escapeHtml(resource.description)}</p>
      <div class="resource-meta-inline">
        <span class="pill">${escapeHtml(resource.subject)}</span>
        <span class="pill">${escapeHtml(resource.semester)}</span>
      </div>
      <div class="moderation-actions">
        <button type="button" class="approve-btn" data-approve-resource="${resource.id}">Approve</button>
        <button type="button" class="reject-btn" data-reject-resource="${resource.id}">Reject</button>
      </div>
    </article>
  `).join('');
}

function updateResourceById(resourceId, updater) {
  const index = resources.findIndex((resource) => resource.id === Number(resourceId));

  if (index === -1) {
    return;
  }

  updater(resources[index]);
  saveResources(resources);
  renderAll();
}

function toggleBookmark(resourceId) {
  const bookmarks = getBookmarks();
  const id = Number(resourceId);

  if (bookmarks.includes(id)) {
    const updated = bookmarks.filter((bookmarkId) => bookmarkId !== id);
    saveBookmarks(updated);
  } else {
    saveBookmarks([...bookmarks, id]);
  }

  renderAll();
}

function incrementDownloads(resourceId) {
  updateResourceById(resourceId, (resource) => {
    resource.downloads += 1;
  });
}

function rateResource(resourceId, value) {
  updateResourceById(resourceId, (resource) => {
    resource.ratingTotal += value;
    resource.ratingCount += 1;
  });

  window.alert('Thank you for rating this resource.');
}

function openPreview(resourceId) {
  const resource = resources.find((item) => item.id === Number(resourceId));

  if (!resource) {
    return;
  }

  const dialog = document.getElementById('previewDialog');
  const content = document.getElementById('previewContent');
  const isPdf = /\.pdf($|\?)/i.test(resource.url) || /pdf/i.test(resource.type);

  content.innerHTML = `
    <div class="preview-wrap">
      <div class="preview-header">
        <h3>${escapeHtml(resource.title)}</h3>
      </div>
      <div class="preview-body">
        ${isPdf ? `<iframe title="${escapeHtml(resource.title)}" src="${escapeHtml(resource.url)}"></iframe>` : `
          <p class="preview-meta">This file is not a PDF, so a browser preview is not available.</p>
          <a class="primary-btn" href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">Open resource</a>
        `}
        <div class="resource-meta-inline">
          <span class="pill">${escapeHtml(resource.category)}</span>
          <span class="pill">${escapeHtml(resource.course)}</span>
          <span class="pill">${escapeHtml(resource.semester)}</span>
        </div>
        <p class="preview-meta">${escapeHtml(resource.description)}</p>
        <p class="preview-meta">Subject: ${escapeHtml(resource.subject)} | Type: ${escapeHtml(resource.type)} | Rating: ${getAverageRating(resource).toFixed(1)}/5</p>
      </div>
    </div>
  `;

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

function handleUpload(event) {
  event.preventDefault();

  const title = document.getElementById('resourceTitle').value.trim();
  const description = document.getElementById('resourceDescription').value.trim();
  const category = document.getElementById('resourceCategory').value;
  const course = document.getElementById('resourceCourse').value;
  const subject = document.getElementById('resourceSubject').value.trim();
  const semester = document.getElementById('resourceSemester').value;
  const type = document.getElementById('resourceType').value;
  const url = document.getElementById('resourceUrl').value.trim();
  const tags = document.getElementById('resourceTags').value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (!title || !description || !category || !course || !subject || !semester || !type || !url) {
    window.alert('Please complete every required field before submitting a resource.');
    return;
  }

  const newResource = {
    id: Date.now(),
    title,
    description,
    category,
    course,
    subject,
    semester,
    type,
    tags,
    url,
    status: 'pending',
    downloads: 0,
    ratingTotal: 0,
    ratingCount: 0,
    dateAdded: new Date().toISOString()
  };

  resources.unshift(newResource);
  saveResources(resources);
  event.currentTarget.reset();
  renderAll();
  window.alert('Your resource has been submitted and is waiting for moderation.');
}

function approveResource(resourceId) {
  updateResourceById(resourceId, (resource) => {
    resource.status = 'approved';
  });
  window.alert('Resource approved and added to the public list.');
}

function rejectResource(resourceId) {
  updateResourceById(resourceId, (resource) => {
    resource.status = 'rejected';
  });
  window.alert('Resource rejected and hidden from the public listing.');
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('categoryFilter').value = 'all';
  document.getElementById('courseFilter').value = 'all';
  document.getElementById('typeFilter').value = 'all';
  document.getElementById('semesterFilter').value = 'all';
  document.getElementById('sortFilter').value = 'newest';
  renderResources();
}

function renderAll() {
  renderStats();
  renderCategoryCards();
  renderResources();
  renderBookmarks();
  renderModerationBoard();
}

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');
const courseFilter = document.getElementById('courseFilter');
const typeFilter = document.getElementById('typeFilter');
const semesterFilter = document.getElementById('semesterFilter');
const sortFilter = document.getElementById('sortFilter');
const clearFiltersButton = document.getElementById('clearFilters');
const uploadForm = document.getElementById('uploadForm');
const closePreviewButton = document.getElementById('closePreview');
const previewDialog = document.getElementById('previewDialog');

searchInput.addEventListener('input', renderResources);
searchButton.addEventListener('click', renderResources);
categoryFilter.addEventListener('change', renderResources);
courseFilter.addEventListener('change', renderResources);
typeFilter.addEventListener('change', renderResources);
semesterFilter.addEventListener('change', renderResources);
sortFilter.addEventListener('change', renderResources);
clearFiltersButton.addEventListener('click', resetFilters);
uploadForm.addEventListener('submit', handleUpload);
closePreviewButton.addEventListener('click', () => previewDialog.close());

document.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-open-resource]');
  if (openButton) {
    openPreview(openButton.dataset.openResource);
    return;
  }

  const bookmarkButton = event.target.closest('[data-bookmark-resource]');
  if (bookmarkButton) {
    toggleBookmark(bookmarkButton.dataset.bookmarkResource);
    return;
  }

  const downloadLink = event.target.closest('[data-download-resource]');
  if (downloadLink) {
    event.preventDefault();
    incrementDownloads(downloadLink.dataset.downloadResource);
    window.open(downloadLink.href, '_blank', 'noopener,noreferrer');
    return;
  }

  const starButton = event.target.closest('[data-rate]');
  if (starButton) {
    rateResource(starButton.dataset.resourceId, Number(starButton.dataset.rate));
    return;
  }

  const approveButton = event.target.closest('[data-approve-resource]');
  if (approveButton) {
    approveResource(approveButton.dataset.approveResource);
    return;
  }

  const rejectButton = event.target.closest('[data-reject-resource]');
  if (rejectButton) {
    rejectResource(rejectButton.dataset.rejectResource);
  }
});

renderAll();
