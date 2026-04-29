import { createAuditGauge, createProjectProgressChart, createSkillsChart } from './chartView.js';

const formatXp = (xp) => {
    if (xp >= 1000000) {
        return `${(xp / 1000000).toFixed(2)} MB`;
    }

    if (xp >= 1000) {
        return `${Math.round(xp / 1000)} KB`;
    }

    return `${xp} B`;
};

const getInitials = (fullName) => {
    return fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('');
};

const createMetricCard = (label, value) => {
    const card = document.createElement('div');
    card.className = 'metric-card';
    card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    return card;
};

export const renderProfile = (profile, onLogout) => {
    const app = document.getElementById('app');
    app.innerHTML = '';

    const container = document.createElement('main');
    container.className = 'dashboard';

    const header = document.createElement('section');
    header.className = 'hero';
    const metricColumn = document.createElement('div');
    metricColumn.className = 'hero-metric-column';
    metricColumn.append(
        createMetricCard('Level', profile.level),
        createMetricCard('XP', formatXp(profile.xp)),
    );

    header.innerHTML = `
        <div class="hero-main">
            <div class="hero-profile">
                <div class="avatar-shell">
                    ${profile.avatar ? `<img src="${profile.avatar}" alt="${profile.fullName} avatar" class="avatar-image">` : `<span>${getInitials(profile.fullName)}</span>`}
                </div>
                <div>
                    <p class="eyebrow">Profile</p>
                    <h1>${profile.fullName}</h1>
                    <p class="hero-meta">@${profile.login} • ${profile.campus}</p>
                    <div class="hero-details">
                        <span><strong>Username</strong>${profile.login}</span>
                        <span><strong>Full name</strong>${profile.fullName}</span>
                        <span><strong>Email</strong>${profile.email}</span>
                        <span><strong>Phone number</strong>${profile.phone}</span>
                    </div>
                </div>
            </div>
            <button class="logout-button" type="button">Logout</button>
        </div>
    `;

    header.prepend(metricColumn);

    const analyticsBlock = document.createElement('section');
    analyticsBlock.className = 'panel analytics-block';

    const auditBlock = createAuditGauge(profile.auditRatio);
    auditBlock.classList.remove('panel');
    auditBlock.classList.add('analytics-item');

    const skillsBlock = createSkillsChart(profile.skills);
    skillsBlock.classList.remove('panel');
    skillsBlock.classList.add('analytics-item');

    const contentStack = document.createElement('section');
    contentStack.className = 'content-stack';
    analyticsBlock.append(auditBlock, skillsBlock);
    contentStack.append(createProjectProgressChart(profile.projects), analyticsBlock);

    //chwiya dial zkiir
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12') {
            e.preventDefault();
        }
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
            e.preventDefault();
        }
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
        }
    });

    container.append(header, contentStack);
    app.appendChild(container);

    app.querySelector('.logout-button').addEventListener('click', onLogout);
};

export const renderProfileError = (message, onRetry) => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <section class="error-screen">
            <p class="eyebrow">Unable to load dashboard</p>
            <h1>${message}</h1>
            <button class="retry-button" type="button">Try again</button>
        </section>
    `;

    app.querySelector('.retry-button').addEventListener('click', onRetry);
};
