/**
 * ALL ODISHA UPDATE - Admin Dashboard Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Authentication Guard
  const token = localStorage.getItem('odisha_update_token');
  const userData = localStorage.getItem('odisha_update_user');
  
  if (!token || !userData) {
    localStorage.removeItem('odisha_update_token');
    localStorage.removeItem('odisha_update_user');
    window.location.href = '/login.html';
    return;
  }

  // Parse User details
  const user = JSON.parse(userData);
  document.getElementById('admin-welcome').textContent = `Welcome, ${user.name}`;

  // State Management
  const state = {
    theme: 'light',
    currentPage: 1,
    limit: 10,
    categoryFilter: '',
    searchQuery: '',
    totalPages: 1,
    isEditing: false
  };

  // DOM Elements
  const logoutBtn = document.getElementById('logout-btn');
  const adminThemeBtn = document.getElementById('admin-theme-btn');
  const newsForm = document.getElementById('news-form');
  const formCardTitle = document.getElementById('form-card-title');
  const publishSubmitBtn = document.getElementById('publish-submit-btn');
  const clearFormBtn = document.getElementById('clear-form-btn');
  
  const aiUrlInput = document.getElementById('ai-url');
  const aiRawTextInput = document.getElementById('ai-raw-text');
  const aiGenerateBtn = document.getElementById('ai-generate-btn');

  const manageSearchInput = document.getElementById('manage-search-input');
  const manageCategoryFilter = document.getElementById('manage-category-filter');
  const adminNewsTableBody = document.getElementById('admin-news-table-body');
  const adminTablePageInfo = document.getElementById('admin-table-page-info');
  const adminPrevPageBtn = document.getElementById('admin-prev-page-btn');
  const adminNextPageBtn = document.getElementById('admin-next-page-btn');

  // Analytics elements
  const metricTotalPosts = document.getElementById('metric-total-posts');
  const metricTotalViews = document.getElementById('metric-total-views');
  const metricTotalJobs = document.getElementById('metric-total-jobs');
  const metricTotalAds = document.getElementById('metric-total-ads');
  const popularArticlesList = document.getElementById('popular-articles-list');
  const categoryStatsList = document.getElementById('category-stats-list');

  // Toast
  const toastEl = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  // Initialize
  initTheme();
  fetchAnalytics();
  fetchAdminTable();
  setupEventListeners();

  // Setup Event Listeners
  function setupEventListeners() {
    // Logout
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('odisha_update_token');
      localStorage.removeItem('odisha_update_user');
      window.location.href = '/login.html';
    });

    // Theme Toggle
    adminThemeBtn.addEventListener('click', toggleTheme);

    // AI Auto-populate
    aiGenerateBtn.addEventListener('click', runGeminiAI);

    // Form Reset/Cancel Edit
    clearFormBtn.addEventListener('click', resetForm);

    // News Submit (Publish/Update)
    newsForm.addEventListener('submit', handleFormSubmit);

    // Table Filters
    manageCategoryFilter.addEventListener('change', (e) => {
      state.categoryFilter = e.target.value;
      state.currentPage = 1;
      fetchAdminTable();
    });

    manageSearchInput.addEventListener('input', debounce((e) => {
      state.searchQuery = e.target.value.trim();
      state.currentPage = 1;
      fetchAdminTable();
    }, 300));

    // Table Pagination
    adminPrevPageBtn.addEventListener('click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        fetchAdminTable();
      }
    });

    adminNextPageBtn.addEventListener('click', () => {
      if (state.currentPage < state.totalPages) {
        state.currentPage++;
        fetchAdminTable();
      }
    });
  }

  // --------------------------------------------------------------------------
  // Fetch Analytics Metrics
  // --------------------------------------------------------------------------

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      const data = result.data;

      // Update counters
      metricTotalPosts.textContent = data.totalNews;
      metricTotalViews.textContent = data.totalViews;
      metricTotalJobs.textContent = data.totalJobs;
      metricTotalAds.textContent = data.totalSponsored;

      // Render Popular Articles List
      if (data.popularArticles.length === 0) {
        popularArticlesList.innerHTML = '<p style="color:var(--admin-text-light); text-align:center; font-size:0.8rem;">No articles read yet.</p>';
      } else {
        popularArticlesList.innerHTML = '';
        data.popularArticles.forEach(art => {
          const item = document.createElement('div');
          item.className = 'popular-item';
          item.innerHTML = `
            <div class="popular-title" title="${art.title}">${art.title}</div>
            <div class="popular-views"><i class="fa-solid fa-eye"></i> ${art.views}</div>
          `;
          popularArticlesList.appendChild(item);
        });
      }

      // Render Category Stats List
      if (data.categoryStats.length === 0) {
        categoryStatsList.innerHTML = '<p style="color:var(--admin-text-light); text-align:center; font-size:0.8rem;">No news categories to display.</p>';
      } else {
        categoryStatsList.innerHTML = '';
        data.categoryStats.forEach(stat => {
          const item = document.createElement('div');
          item.className = 'popular-item';
          item.innerHTML = `
            <div class="popular-title"><strong>${stat._id}</strong> (${stat.count} posts)</div>
            <div class="popular-views" style="color:var(--info);"><i class="fa-solid fa-eye"></i> ${stat.views}</div>
          `;
          categoryStatsList.appendChild(item);
        });
      }

    } catch (error) {
      console.error('Analytics Fetch Error:', error);
      showToast('Failed to load metrics data.');
    }
  }

  // --------------------------------------------------------------------------
  // Run Gemini AI Summarizer
  // --------------------------------------------------------------------------

  async function runGeminiAI() {
    const aiUrl = aiUrlInput.value.trim();
    const aiText = aiRawTextInput.value.trim();

    if (!aiUrl && !aiText) {
      showToast('Please provide a URL or paste text to summarize.');
      return;
    }

    const originalText = aiGenerateBtn.innerHTML;
    aiGenerateBtn.disabled = true;
    aiGenerateBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gemini AI processing...';

    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: aiUrl, rawText: aiText })
      });

      const result = await res.json();

      if (result.success) {
        const data = result.data;

        // Populate fields
        document.getElementById('news-title').value = data.headline || '';
        document.getElementById('news-odia-title').value = data.odiaHeadline || '';
        document.getElementById('news-summary').value = data.summary || '';
        document.getElementById('news-image').value = data.image || '';
        document.getElementById('news-tags').value = (data.tags || []).join(', ');
        
        // Auto-fill metadata if scraping occurred
        if (aiUrl) {
          document.getElementById('news-source-url').value = aiUrl;
          
          // Parse source from domain
          try {
            const domain = new URL(aiUrl).hostname.replace('www.', '');
            document.getElementById('news-source').value = domain;
          } catch (e) {
            document.getElementById('news-source').value = '';
          }
        }

        // Show feedback & clear inputs
        showToast('Gemini AI successfully auto-filled fields!');
        aiUrlInput.value = '';
        aiRawTextInput.value = '';
        
        // Scroll to form
        document.getElementById('news-form').scrollIntoView({ behavior: 'smooth' });

      } else {
        throw new Error(result.message || 'Summarization failed');
      }
    } catch (error) {
      console.error('AI Error:', error);
      alert(`AI Error: ${error.message}`);
      showToast('Failed to execute AI helper.');
    } finally {
      aiGenerateBtn.disabled = false;
      aiGenerateBtn.innerHTML = originalText;
    }
  }

  // --------------------------------------------------------------------------
  // News Form Publish & Update Operations
  // --------------------------------------------------------------------------

  async function handleFormSubmit(e) {
    e.preventDefault();

    const newsId = document.getElementById('news-id').value;
    const title = document.getElementById('news-title').value.trim();
    const odiaHeadline = document.getElementById('news-odia-title').value.trim();
    const summary = document.getElementById('news-summary').value.trim();
    const image = document.getElementById('news-image').value.trim();
    const category = document.getElementById('news-category').value;
    const source = document.getElementById('news-source').value.trim();
    const sourceUrl = document.getElementById('news-source-url').value.trim();
    const author = document.getElementById('news-author').value.trim();
    const tags = document.getElementById('news-tags').value.trim();

    const isTrending = document.getElementById('news-trending').checked;
    const isSponsored = document.getElementById('news-sponsored').checked;
    const isJob = document.getElementById('news-job').checked;

    const payload = {
      title,
      odiaHeadline,
      summary,
      category,
      source,
      sourceUrl,
      author,
      tags,
      isTrending,
      isSponsored,
      isJob
    };

    if (image) payload.image = image;

    const url = state.isEditing ? `/api/admin/news/${newsId}` : '/api/admin/news';
    const method = state.isEditing ? 'PUT' : 'POST';

    publishSubmitBtn.disabled = true;
    publishSubmitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        showToast(state.isEditing ? 'News article updated!' : 'News article published!');
        resetForm();
        fetchAnalytics();
        fetchAdminTable();
      } else {
        throw new Error(result.message || 'Error occurred while saving');
      }

    } catch (error) {
      console.error('Form Save Error:', error);
      alert(`Save Error: ${error.message}`);
    } finally {
      publishSubmitBtn.disabled = false;
      publishSubmitBtn.innerHTML = state.isEditing ? 
        '<i class="fa-solid fa-cloud-arrow-up"></i> Update Article' : 
        '<i class="fa-solid fa-cloud-arrow-up"></i> Publish Article';
    }
  }

  // Edit action
  window.editArticle = async function(id) {
    state.isEditing = true;
    clearFormBtn.classList.remove('hidden');
    formCardTitle.innerHTML = `<i class="fa-solid fa-pen-to-square text-info"></i> Edit News Card`;
    publishSubmitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Update Article`;

    showToast('Loading article data into form...');

    try {
      const res = await fetch(`/api/news/${id}`);
      const result = await res.json();

      if (result.success) {
        const news = result.data;

        document.getElementById('news-id').value = news._id;
        document.getElementById('news-title').value = news.title || '';
        document.getElementById('news-odia-title').value = news.odiaHeadline || '';
        document.getElementById('news-summary').value = news.summary || '';
        document.getElementById('news-image').value = news.image || '';
        document.getElementById('news-category').value = news.category || '';
        document.getElementById('news-source').value = news.source || '';
        document.getElementById('news-source-url').value = news.sourceUrl || '';
        document.getElementById('news-author').value = news.author || '';
        document.getElementById('news-tags').value = (news.tags || []).join(', ');
        
        document.getElementById('news-trending').checked = !!news.isTrending;
        document.getElementById('news-sponsored').checked = !!news.isSponsored;
        document.getElementById('news-job').checked = !!news.isJob;

        // Scroll to form card
        document.getElementById('news-form').scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) {
      showToast('Failed to load article details.');
    }
  };

  // Delete Action
  window.deleteArticle = async function(id) {
    if (!confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await res.json();

      if (result.success) {
        showToast('Article deleted.');
        if (document.getElementById('news-id').value === id) {
          resetForm();
        }
        fetchAnalytics();
        fetchAdminTable();
      } else {
        throw new Error(result.message);
      }
    } catch (e) {
      showToast('Failed to delete news article.');
    }
  };

  function resetForm() {
    newsForm.reset();
    document.getElementById('news-id').value = '';
    state.isEditing = false;
    clearFormBtn.classList.add('hidden');
    formCardTitle.innerHTML = `<i class="fa-solid fa-pen-nib text-red"></i> Publish News Card`;
    publishSubmitBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Publish Article`;
  }

  // --------------------------------------------------------------------------
  // Manage News Database (Table render)
  // --------------------------------------------------------------------------

  async function fetchAdminTable() {
    adminNewsTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 20px; color: var(--admin-text-light);">
          <div class="spinner" style="margin: 0 auto 10px auto;"></div> Loading articles database...
        </td>
      </tr>
    `;

    try {
      let url = `/api/news?page=${state.currentPage}&limit=${state.limit}`;
      if (state.categoryFilter) {
        url += `&category=${encodeURIComponent(state.categoryFilter)}`;
      }
      
      // If search exists, search endpoint handles it
      if (state.searchQuery) {
        url = `/api/news/search?q=${encodeURIComponent(state.searchQuery)}&page=${state.currentPage}&limit=${state.limit}`;
      }

      const res = await fetch(url);
      const result = await res.json();

      if (!result.success) throw new Error(result.message);

      const newsList = result.data;
      const pagination = result.pagination;
      state.totalPages = pagination.totalPages || 1;

      // Update Pagination UI info
      adminTablePageInfo.textContent = `Page ${pagination.page} of ${state.totalPages} (${pagination.totalNews} total)`;
      adminPrevPageBtn.disabled = pagination.page <= 1;
      adminNextPageBtn.disabled = pagination.page >= state.totalPages;

      if (newsList.length === 0) {
        adminNewsTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center; padding:20px; color:var(--admin-text-light);">No articles found matching filters.</td>
          </tr>
        `;
        return;
      }

      adminNewsTableBody.innerHTML = '';
      newsList.forEach(news => {
        const row = document.createElement('tr');

        // Flags Badge render
        const badges = [];
        if (news.isTrending) badges.push('<span class="badge badge-red">Trending</span>');
        if (news.isJob) badges.push('<span class="badge badge-warning">Job</span>');
        if (news.isSponsored) badges.push('<span class="badge badge-info">Ad</span>');
        if (badges.length === 0) badges.push('<span class="badge badge-default">Normal</span>');

        row.innerHTML = `
          <td>${new Date(news.publishedAt).toLocaleDateString()}</td>
          <td class="article-title-cell" title="${news.title}">${news.odiaHeadline || news.title}</td>
          <td><span class="badge" style="background-color:var(--admin-border); color:var(--admin-text-dark);">${news.category}</span></td>
          <td><strong>${news.views || 0}</strong></td>
          <td><div style="display:flex; gap:4px; flex-wrap:wrap;">${badges.join('')}</div></td>
          <td>
            <div class="table-actions">
              <button class="btn-icon edit" onclick="editArticle('${news._id}')" title="Edit Article"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon delete" onclick="deleteArticle('${news._id}')" title="Delete Article"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </td>
        `;

        adminNewsTableBody.appendChild(row);
      });

    } catch (error) {
      console.error('Table Fetch Error:', error);
      adminNewsTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding:20px; color:var(--danger);">Error loading database. Ensure MongoDB is running.</td>
        </tr>
      `;
    }
  }

  // --------------------------------------------------------------------------
  // Theme System
  // --------------------------------------------------------------------------

  function initTheme() {
    const savedTheme = localStorage.getItem('odisha_update_theme');
    if (savedTheme) {
      state.theme = savedTheme;
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      state.theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    if (state.theme === 'dark') {
      adminThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      adminThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('odisha_update_theme', state.theme);
    applyTheme();
  }

  // --------------------------------------------------------------------------
  // Helper Toast
  // --------------------------------------------------------------------------

  function showToast(message) {
    toastMessage.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2500);
  }

  function debounce(func, delay) {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

});
