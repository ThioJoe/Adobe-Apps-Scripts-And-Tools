// ==UserScript==
// @name         Adobe Community - Newest Search Results First
// @namespace    https://community.adobe.com/
// @version      1.1.5
// @description  Filter Adobe Community forum searches by topic creation date and sort loaded results by their displayed dates, including results added while scrolling.
// @author       OpenAI
// @match        https://community.adobe.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const NAME = 'Adobe Community - Newest Search Results First';
    const DEBUG = false;
    // ------- User Options -------
    const DEFAULT_RESULT_SORT = 'original';
    const REMEMBER_RESULT_SORT = false;
    const REMEMBER_DATE_RANGE = false;
    const MONTH_COUNTS = [1, 3, 6];
    const YEAR_COUNTS = [1];
    // ----------------------------

    const STORAGE_KEY = 'adobe-community-search-date-sort-v1';
    const TOOLBAR_ID = 'adobe-community-date-sort';
    const RANGE_STORAGE_KEY = 'adobe-community-search-date-range-v1';
    const PENDING_RANGE_KEY = `${RANGE_STORAGE_KEY}-pending`;
    const RANGE_TOOLBAR_ID = 'adobe-community-date-range';
    const RESULTS_SELECTOR = '#search-results-container';
    const MODULE_SELECTOR = '[data-preact="destination/modules/Search/Features/FullPageSearch/InstantSearch"]';
    const SEARCH_WIDGET_SELECTOR = '[data-preact="destination/modules/Search/Features/SearchWidget/SearchForm"]';
    const MODES = new Set(['newest', 'oldest', 'original']);
    const MONTH_PRESETS = new Map(MONTH_COUNTS
        .filter(months => Number.isInteger(months) && months > 0)
        .map(months => [months === 1 ? 'month' : `months-${months}`, months]));
    const YEAR_PRESETS = new Map(YEAR_COUNTS
        .filter(years => Number.isInteger(years) && years > 0)
        .map(years => [years === 1 ? 'year' : `years-${years}`, years]));
    const OBSERVER_OPTIONS = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['href', 'datetime', 'title', 'data-timestamp', 'data-created-at']
    };
    const debug = (...args) => {
        if (DEBUG) console.debug(`[${NAME}]`, ...args);
    };
    const error = (message, cause) => console.error(`[${NAME}] Error: ${message}`, cause);

    let mode = DEFAULT_RESULT_SORT;
    let lastSearchQuery = new URLSearchParams(location.search).get('q') || '';
    if (REMEMBER_RESULT_SORT) {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (MODES.has(saved)) mode = saved;
            debug('Loaded sort preference:', mode);
        } catch (cause) {
            error('Could not read the saved sort preference; using the default sort.', cause);
        }
    }

    let toolbar;
    let status;
    let rangeToolbar;
    let rangeToolbarHost;
    let rangeLayoutTargets = [];
    const rangeLayoutObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
        debug('Search banner or date controls resized; updating their spacing.');
        scheduleRefresh();
    }) : null;
    let rangeStatus;
    let dateRange = { preset: 'all', from: '', to: '' };
    let dateRangePage = location.pathname;
    let dateRangeQuery = new URLSearchParams(location.search).get('q') || '';
    let scheduled = false;
    const listStates = new WeakMap();

    function localDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
        const date = new Date(`${value}T00:00:00`);
        const [year, month, day] = value.split('-').map(Number);
        return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
    }

    function validDateRange(value) {
        return value && (['all', 'week', 'custom'].includes(value.preset) || MONTH_PRESETS.has(value.preset) || YEAR_PRESETS.has(value.preset))
            && (value.preset !== 'custom' || (localDate(value.from) && localDate(value.to) && value.from <= value.to));
    }

    function isSearchPage() {
        return /^\/search\/?$/.test(location.pathname);
    }

    function saveCurrentSearchRange() {
        if (REMEMBER_DATE_RANGE || !isSearchPage()) return;
        history.replaceState({ ...history.state, [RANGE_STORAGE_KEY]: {
            query: new URLSearchParams(location.search).get('q') || '', range: dateRange
        } }, '');
        debug('Kept the date range with this search history entry:', dateRange);
    }

    function loadDateRange() {
        dateRange = { preset: 'all', from: '', to: '' };
        try {
            if (REMEMBER_DATE_RANGE) {
                const saved = JSON.parse(localStorage.getItem(RANGE_STORAGE_KEY) || 'null');
                if (validDateRange(saved)) dateRange = saved;
            } else {
                const pending = JSON.parse(sessionStorage.getItem(PENDING_RANGE_KEY) || 'null');
                sessionStorage.removeItem(PENDING_RANGE_KEY);
                if (isSearchPage()) {
                    const saved = history.state?.[RANGE_STORAGE_KEY];
                    if (pending?.query === dateRangeQuery && validDateRange(pending.range)) dateRange = pending.range;
                    else if (saved?.query === dateRangeQuery && validDateRange(saved.range)) dateRange = saved.range;
                    saveCurrentSearchRange();
                }
            }
            debug('Loaded date range:', dateRange, 'remember:', REMEMBER_DATE_RANGE);
        } catch (cause) {
            error('Could not read the date range; using all time.', cause);
        }
    }

    function syncDateRange() {
        const query = new URLSearchParams(location.search).get('q') || '';
        if (dateRangePage === location.pathname && dateRangeQuery === query) return;
        dateRangePage = location.pathname;
        dateRangeQuery = query;
        loadDateRange();
        if (rangeToolbar) {
            rangeToolbar.querySelector('select').value = dateRange.preset;
            for (const key of ['from', 'to']) rangeToolbar.querySelector(`#${RANGE_TOOLBAR_ID}-${key}`).value = dateRange[key] || '';
            rangeToolbar.querySelector('input').parentElement.parentElement.style.display = dateRange.preset === 'custom' ? 'inline-flex' : 'none';
        }
        debug('Updated the date range for a different page or search.');
    }

    function carryDateRange(event) {
        if (REMEMBER_DATE_RANGE || isSearchPage()) return;
        const target = event.target instanceof Element ? event.target : null;
        const widget = target?.closest(SEARCH_WIDGET_SELECTOR) || target?.closest('form')?.querySelector(SEARCH_WIDGET_SELECTOR);
        if (!widget) return;
        const link = target.closest('a[href]');
        const searchLink = link && new URL(link.href, location.href);
        if (event.type === 'keydown' && event.key !== 'Enter') return;
        if (event.type === 'click' && !(target.closest('button[type="submit"]') || (searchLink?.origin === location.origin && /^\/search(?:\/index)?\/?$/.test(searchLink.pathname)))) return;
        const query = searchLink?.searchParams.get('q') || widget.querySelector('input[type="search"], input[name="q"]')?.value || '';
        try {
            sessionStorage.setItem(PENDING_RANGE_KEY, JSON.stringify({ query: query.trim(), range: dateRange }));
            debug('Carrying the selected date range into the submitted search:', dateRange);
        } catch (cause) {
            error('Could not carry the date range into the next search.', cause);
        }
    }

    loadDateRange();
    for (const event of ['submit', 'keydown', 'click']) document.addEventListener(event, carryDateRange, true);

    function dateFilters() {
        if (dateRange.preset === 'all') return [];
        if (dateRange.preset !== 'custom') {
            const days = dateRange.preset === 'week' ? 7
                : MONTH_PRESETS.has(dateRange.preset) ? MONTH_PRESETS.get(dateRange.preset) * 30
                : YEAR_PRESETS.get(dateRange.preset) * 365;
            return [`date_added>=${Math.floor((Date.now() - days * 86400000) / 1000)}`];
        }
        const end = localDate(dateRange.to);
        end.setDate(end.getDate() + 1);
        return [
            `date_added>=${Math.floor(localDate(dateRange.from).getTime() / 1000)}`,
            `date_added<${Math.floor(end.getTime() / 1000)}`
        ];
    }

    function isSearchRequest(value) {
        try {
            const url = new URL(value, location.href);
            return /(^|\.)algolia(?:\.net|net\.com)$/.test(url.hostname)
                && /^\/1\/indexes\/(?:\*\/queries|[^/]+\/query)$/.test(url.pathname);
        } catch (cause) {
            debug('Skipped an unrecognized request URL:', value, cause);
            return false;
        }
    }

    function filterRequestBody(body, url) {
        syncDateRange();
        if (typeof body !== 'string' || dateRange.preset === 'all' || !isSearchRequest(url)) return body;
        try {
            const data = JSON.parse(body);
            const index = decodeURIComponent(new URL(url, location.href).pathname.split('/')[3]);
            let changed = false;
            for (const request of Array.isArray(data.requests) ? data.requests : [data]) {
                if (!/^adobedme-[\w-]+-unified$/.test(request.indexName || index)) continue;
                const encoded = typeof request.params === 'string';
                const params = encoded ? new URLSearchParams(request.params) : (request.params || request);
                const query = encoded ? params.get('query') : params.query;
                if (!query || !String(query).trim()) continue;
                if (!REMEMBER_DATE_RANGE && isSearchPage() && String(query).trim() !== dateRangeQuery.trim()) continue;
                let existing = encoded ? params.get('numericFilters') : params.numericFilters;
                if (typeof existing === 'string') {
                    try { existing = JSON.parse(existing); } catch { existing = [existing]; }
                }
                const filters = [...(Array.isArray(existing) ? existing : existing ? [existing] : []), ...dateFilters()];
                if (encoded) {
                    params.set('numericFilters', JSON.stringify(filters));
                    request.params = params.toString();
                } else {
                    params.numericFilters = filters;
                }
                changed = true;
                debug('Applied topic-date filters to a search request:', filters);
            }
            return changed ? JSON.stringify(data) : body;
        } catch (cause) {
            error('Could not apply the date filter to a search request.', cause);
            if (rangeStatus) rangeStatus.textContent = 'Date filtering failed. See the browser console for details.';
            return body;
        }
    }

    const requestUrls = new WeakMap();
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
        requestUrls.set(this, String(url));
        return originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
        return originalSend.call(this, filterRequestBody(body, requestUrls.get(this)));
    };
    if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function (input, init) {
            const url = input instanceof Request ? input.url : String(input);
            syncDateRange();
            if (dateRange.preset === 'all' || !isSearchRequest(url)) return originalFetch.apply(this, arguments);
            if (typeof init?.body === 'string') {
                return originalFetch.call(this, input, { ...init, body: filterRequestBody(init.body, url) });
            }
            if (input instanceof Request && !init?.body && (init?.method || input.method).toUpperCase() === 'POST') {
                try {
                    return input.clone().text().then(body => ({ ...init, body: filterRequestBody(body, url) }), cause => {
                        error('Could not read a search request for date filtering.', cause);
                        return init;
                    }).then(options => originalFetch.call(this, input, options));
                } catch (cause) {
                    error('Could not copy a search request for date filtering.', cause);
                }
            }
            return originalFetch.apply(this, arguments);
        };
    }
    debug('Installed date-filter request handlers.');

    function applyDateRange(value) {
        if (!validDateRange(value)) {
            rangeStatus.textContent = 'Choose a valid start and end date, with the start on or before the end.';
            return;
        }
        try {
            if (REMEMBER_DATE_RANGE) localStorage.setItem(RANGE_STORAGE_KEY, JSON.stringify(value));
            dateRange = value;
            if (isSearchPage()) {
                saveCurrentSearchRange();
                debug('Applied date range; reloading the current search:', value);
                location.reload();
            } else {
                debug('Selected date range for the next search:', value);
                rangeStatus.textContent = 'Date range selected for your next search.';
            }
        } catch (cause) {
            error('Could not save the date range.', cause);
            rangeStatus.textContent = 'Could not save the date range. Check browser storage permissions.';
        }
    }

    function mountDateToolbar() {
        syncDateRange();
        const module = document.querySelector(MODULE_SELECTOR);
        const search = module?.querySelector('.instant-search-input-wrapper') || document.querySelector(SEARCH_WIDGET_SELECTOR);
        if (!search) {
            rangeToolbar?.remove();
            rangeToolbarHost?.remove();
            rangeLayoutObserver?.disconnect();
            rangeLayoutTargets = [];
            return;
        }
        if (!rangeToolbar) {
            rangeToolbar = document.createElement('div');
            rangeToolbar.id = RANGE_TOOLBAR_ID;
            Object.assign(rangeToolbar.style, {
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
                margin: '10px 0', fontSize: '14px'
            });
            const label = document.createElement('label');
            label.htmlFor = `${RANGE_TOOLBAR_ID}-select`;
            label.textContent = 'Topic date:';
            const select = document.createElement('select');
            select.id = label.htmlFor;
            Object.assign(select.style, { font: 'inherit', padding: '5px 8px', borderRadius: '4px' });
            for (const [value, title] of [
                ['all', 'All time'], ['week', 'Past week'],
                ...[...MONTH_PRESETS].map(([preset, months]) => [preset, months === 1 ? 'Past Month' : `Past ${months} Months`]),
                ...[...YEAR_PRESETS].map(([preset, years]) => [preset, years === 1 ? 'Past Year' : `Past ${years} Years`]),
                ['custom', 'Custom date range']
            ]) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = title;
                select.append(option);
            }
            select.value = dateRange.preset;
            const custom = document.createElement('span');
            Object.assign(custom.style, { display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' });
            const inputs = {};
            for (const [key, title] of [['from', 'From'], ['to', 'Through']]) {
                const dateLabel = document.createElement('label');
                dateLabel.textContent = `${title}: `;
                const input = document.createElement('input');
                input.type = 'date';
                input.id = `${RANGE_TOOLBAR_ID}-${key}`;
                input.value = dateRange[key] || '';
                Object.assign(input.style, { font: 'inherit', padding: '4px 6px', borderRadius: '4px' });
                dateLabel.append(input);
                custom.append(dateLabel);
                inputs[key] = input;
            }
            const apply = document.createElement('button');
            apply.type = 'button';
            apply.textContent = 'Apply';
            Object.assign(apply.style, { font: 'inherit', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' });
            apply.addEventListener('click', () => applyDateRange({ preset: 'custom', from: inputs.from.value, to: inputs.to.value }));
            custom.append(apply);
            custom.style.display = dateRange.preset === 'custom' ? 'inline-flex' : 'none';
            rangeStatus = document.createElement('span');
            rangeStatus.setAttribute('role', 'status');
            rangeStatus.setAttribute('aria-live', 'polite');
            Object.assign(rangeStatus.style, { flexBasis: '100%', fontSize: '12px', opacity: '0.8' });
            rangeStatus.textContent = 'Filters topic creation dates across the full search. Custom dates use your local time; both dates are included.';
            select.addEventListener('change', () => {
                const isCustom = select.value === 'custom';
                custom.style.display = isCustom ? 'inline-flex' : 'none';
                debug('Date range selection changed:', select.value);
                if (isCustom) inputs.from.focus();
                else applyDateRange({ preset: select.value, from: '', to: '' });
            });
            rangeToolbar.append(label, select, custom, rangeStatus);
            debug('Created the date-range controls.');
        }
        const hero = search.closest('.forum-featured-image') || search.closest('.brand-hero');
        if (hero) {
            if (!rangeToolbarHost) {
                rangeToolbarHost = document.createElement('div');
                rangeToolbarHost.id = `${RANGE_TOOLBAR_ID}-host`;
                rangeToolbarHost.className = 'sitewidth';
                rangeToolbarHost.style.display = 'flow-root';
                rangeToolbarHost.append(document.createElement('div'));
                const style = document.createElement('style');
                // Let the site's search suggestions appear above our controls when open.
                style.textContent = `.generic_hero:has(.search-box--open) #${RANGE_TOOLBAR_ID}-host { z-index: auto !important; }`;
                document.head.append(style);
            }
            // The app banner overlaps this space and otherwise intercepts clicks.
            rangeToolbarHost.style.zIndex = getComputedStyle(hero).zIndex;
            const column = rangeToolbarHost.firstElementChild;
            column.className = search.closest('.col')?.className || 'col';
            if (rangeToolbar.parentNode !== column) column.append(rangeToolbar);
            if (rangeToolbarHost.parentNode !== hero.parentNode || rangeToolbarHost.previousElementSibling !== hero) {
                hero.after(rangeToolbarHost);
                debug('Mounted the date-range controls below the banner, outside its fixed-height layout.');
            }
            const communityHome = /^\/community\/?$/.test(location.pathname);
            const anchor = search.querySelector('input[type="search"]') || search;
            if (communityHome) {
                const searchBox = anchor.getBoundingClientRect();
                const banner = hero.getBoundingClientRect();
                const offset = searchBox.width > 0 ? searchBox.bottom - banner.bottom : 0;
                // Use the banner's empty space without changing its heading or search layout.
                rangeToolbarHost.style.marginTop = `${offset}px`;
                rangeToolbarHost.style.minHeight = `${Math.max(0, -offset)}px`;
                rangeToolbarHost.style.position = 'relative';
                rangeToolbarHost.style.padding = '0';
                column.className = '';
                column.style.display = 'flow-root';
                column.style.width = searchBox.width > 0 ? `${searchBox.width}px` : '';
                column.style.marginLeft = searchBox.width > 0 ? `${searchBox.left - rangeToolbarHost.getBoundingClientRect().left}px` : '';
                debug('Aligned the community date controls directly below the search field.');
            } else {
                const gap = hero.getBoundingClientRect().bottom - anchor.getBoundingClientRect().bottom;
                rangeToolbarHost.style.marginTop = `${-Math.min(16, Math.max(0, gap))}px`;
                rangeToolbarHost.style.minHeight = '';
                rangeToolbarHost.style.position = 'relative';
                rangeToolbarHost.style.padding = '';
                column.style.display = '';
                column.style.width = '';
                column.style.marginLeft = '';
            }
            const targets = communityHome ? [hero, hero.firstElementChild, anchor, rangeToolbar].filter(Boolean) : [];
            if (targets.length !== rangeLayoutTargets.length || targets.some((target, i) => target !== rangeLayoutTargets[i])) {
                rangeLayoutObserver?.disconnect();
                targets.forEach(target => rangeLayoutObserver?.observe(target));
                rangeLayoutTargets = targets;
            }
        } else {
            if (rangeToolbar.parentNode !== search.parentNode || rangeToolbar.previousElementSibling !== search) {
                search.after(rangeToolbar);
                debug('Mounted the date-range controls below the search bar.');
            }
            rangeToolbarHost?.remove();
            rangeLayoutObserver?.disconnect();
            rangeLayoutTargets = [];
        }
    }

    function parseDate(value, now) {
        const text = String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();
        if (!text) return null;
        if (/^\d{10}(?:\d{3})?$/.test(text)) {
            return Number(text) * (text.length === 10 ? 1000 : 1);
        }
        if (/^(just now|a moment ago|moments ago|now|today)$/.test(text)) return now;
        if (text === 'yesterday') return now - 86400000;

        const relative = text.match(/^(?:(?:about|over|almost|less than)\s+)?(\d+(?:\.\d+)?|a|an|one)\s+(second|minute|hour|day|week|month|year)s?\s+ago$/);
        if (relative) {
            const count = /^(a|an|one)$/.test(relative[1]) ? 1 : Number(relative[1]);
            const seconds = {
                second: 1,
                minute: 60,
                hour: 3600,
                day: 86400,
                week: 604800,
                month: 2629800,
                year: 31557600
            };
            return now - count * seconds[relative[2]] * 1000;
        }

        if (/^\d{4}-\d{2}-\d{2}(?:t|$)/.test(text) || /^(?:\d{1,2} [a-z]+ \d{4}|[a-z]+ \d{1,2},? \d{4})(?:\s|$)/.test(text)) {
            const timestamp = Date.parse(text);
            if (Number.isFinite(timestamp)) return timestamp;
        }
        return null;
    }

    function readDate(article, now) {
        const meta = article.querySelector('.search-result-meta');
        const dateItem = meta?.lastElementChild;
        const candidates = [
            article.querySelector('time[datetime]'),
            dateItem?.querySelector('a, time, span[title]'),
            dateItem
        ].filter(Boolean);

        for (const element of candidates) {
            for (const attribute of ['datetime', 'data-created-at', 'data-timestamp', 'title']) {
                const timestamp = parseDate(element.getAttribute(attribute), now);
                if (timestamp !== null) {
                    debug('Read a date attribute:', attribute, element.getAttribute(attribute));
                    return timestamp;
                }
            }
        }
        const timestamp = parseDate(dateItem?.textContent, now);
        debug('Read a displayed date:', dateItem?.textContent?.trim(), timestamp);
        return timestamp;
    }

    function mountToolbar(results) {
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = TOOLBAR_ID;
            Object.assign(toolbar.style, {
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px',
                margin: '12px 0', padding: '12px', border: '1px solid #999',
                borderRadius: '6px', fontSize: '14px'
            });

            const label = document.createElement('label');
            label.htmlFor = `${TOOLBAR_ID}-select`;
            label.textContent = 'Sort loaded results:';

            const select = document.createElement('select');
            select.id = label.htmlFor;
            select.value = mode;
            Object.assign(select.style, { font: 'inherit', padding: '5px 8px', borderRadius: '4px' });
            for (const [value, title] of [
                ['newest', 'Newest first'],
                ['oldest', 'Oldest first'],
                ['original', 'Site order']
            ].sort((a, b) => Number(b[0] === DEFAULT_RESULT_SORT) - Number(a[0] === DEFAULT_RESULT_SORT))) {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = title;
                select.append(option);
            }
            select.value = mode;
            select.addEventListener('change', () => {
                mode = select.value;
                debug('Sort mode changed:', mode);
                if (REMEMBER_RESULT_SORT) {
                    try {
                        localStorage.setItem(STORAGE_KEY, mode);
                    } catch (cause) {
                        error('Could not save the sort preference.', cause);
                    }
                }
                scheduleRefresh();
            });

            status = document.createElement('span');
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            Object.assign(status.style, { flexBasis: '100%', fontSize: '12px', opacity: '0.8' });
            toolbar.append(label, select, status);
            debug('Created the sorting controls.');
        }
        if (toolbar.parentNode !== results.parentNode || toolbar.nextElementSibling !== results) {
            results.before(toolbar);
            debug('Mounted the sorting controls above the results.');
        }
    }

    function sortList(parent, articles, now) {
        let state = listStates.get(parent);
        const query = location.search;
        if (!state || state.query !== query || articles.some(article => {
            const saved = state.rows.get(article);
            return saved && saved.href !== article.querySelector('a.search-result')?.getAttribute('href');
        })) {
            state = { query, nextRank: 0, rows: new WeakMap() };
            listStates.set(parent, state);
            debug('Captured a new result list or search query.');
        }

        const entries = articles.map(article => {
            if (!state.rows.has(article)) {
                state.rows.set(article, {
                    rank: state.nextRank++,
                    href: article.querySelector('a.search-result')?.getAttribute('href')
                });
            }
            return { article, rank: state.rows.get(article).rank, date: readDate(article, now) };
        });
        const unknown = entries.filter(entry => entry.date === null).length;
        entries.sort((a, b) => {
            if (mode === 'original') return a.rank - b.rank;
            if (a.date === null && b.date !== null) return 1;
            if (b.date === null && a.date !== null) return -1;
            if (a.date !== null && b.date !== null && a.date !== b.date) {
                return mode === 'newest' ? b.date - a.date : a.date - b.date;
            }
            return a.rank - b.rank;
        });

        if (entries.some((entry, index) => entry.article !== articles[index])) {
            // Reuse the site's nodes so their links and event listeners survive.
            const slots = articles.map(article => {
                const slot = document.createComment('adobe-search-sort-slot');
                parent.insertBefore(slot, article);
                return slot;
            });
            entries.forEach((entry, index) => slots[index].replaceWith(entry.article));
            debug('Reordered results:', entries.length, 'mode:', mode);
        } else {
            debug('Results are already in the selected order:', entries.length);
        }
        return unknown;
    }

    function refresh() {
        scheduled = false;
        observer.disconnect();
        try {
            mountDateToolbar();
            if (!/^\/search\/?$/.test(location.pathname)) {
                toolbar?.remove();
                return;
            }
            const query = new URLSearchParams(location.search).get('q') || '';
            if (query !== lastSearchQuery) {
                lastSearchQuery = query;
                if (!REMEMBER_RESULT_SORT) {
                    mode = DEFAULT_RESULT_SORT;
                    const select = toolbar?.querySelector('select');
                    if (select) select.value = mode;
                    debug('Reset the result sort for a new search:', mode);
                }
            }
            const results = document.querySelector(RESULTS_SELECTOR);
            if (!results) {
                toolbar?.remove();
                debug('Waiting for the search results container.');
                return;
            }
            mountToolbar(results);
            const lists = new Map();
            for (const article of results.querySelectorAll('article')) {
                if (!article.querySelector('a.search-result')) continue;
                const parent = article.parentElement;
                if (!lists.has(parent)) lists.set(parent, []);
                lists.get(parent).push(article);
            }
            const now = Date.now();
            let count = 0;
            let unknown = 0;
            for (const [parent, articles] of lists) {
                count += articles.length;
                unknown += sortList(parent, articles, now);
            }
            const message = `${count} loaded results. Scroll to load more; new results are sorted automatically. Dates are rounded; ties keep site order.`
                + (unknown && mode !== 'original' ? ` ${unknown} results with unrecognized dates are placed last (English dates are supported).` : '');
            if (status.textContent !== message) status.textContent = message;
            debug('Refresh complete:', { count, unknown, mode });
        } catch (cause) {
            error('Could not sort the search results.', cause);
            if (status) status.textContent = 'Sorting failed. See the browser console for details.';
        } finally {
            observer.observe(document.body, OBSERVER_OPTIONS);
        }
    }

    function scheduleRefresh() {
        if (scheduled) return;
        scheduled = true;
        debug('Scheduled a result refresh.');
        requestAnimationFrame(refresh);
    }

    const observer = new MutationObserver(records => {
        const relevant = records.some(record => {
            const element = record.target.nodeType === 1 ? record.target : record.target.parentElement;
            if (element?.closest(`#${TOOLBAR_ID}, #${RANGE_TOOLBAR_ID}`)) return false;
            if (element?.closest(`${MODULE_SELECTOR}, ${SEARCH_WIDGET_SELECTOR}, ${RESULTS_SELECTOR}`)) return true;
            return [...record.addedNodes, ...record.removedNodes].some(node =>
                node.nodeType === 1 && (node.matches(`${MODULE_SELECTOR}, ${SEARCH_WIDGET_SELECTOR}, ${RESULTS_SELECTOR}`) || node.querySelector(`${MODULE_SELECTOR}, ${SEARCH_WIDGET_SELECTOR}, ${RESULTS_SELECTOR}`))
            );
        });
        if (relevant) {
            debug('Detected a search page update:', records.length, 'mutations.');
            scheduleRefresh();
        }
    });

    for (const method of ['pushState', 'replaceState']) {
        const original = history[method];
        history[method] = function () {
            const result = original.apply(this, arguments);
            scheduleRefresh();
            return result;
        };
    }
    window.addEventListener('popstate', scheduleRefresh);
    window.addEventListener('pageshow', scheduleRefresh);
    window.addEventListener('resize', scheduleRefresh);
    window.addEventListener('pagehide', () => {
        try {
            syncDateRange();
            saveCurrentSearchRange();
        } catch (cause) {
            error('Could not keep the current search date range for a reload.', cause);
        }
    });
    debug('Starting; debug logging can be toggled with the DEBUG constant.');
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
    else refresh();
})();
