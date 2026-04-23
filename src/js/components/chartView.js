const SKILL_COLORS = ['#df2d00', '#2563eb', '#4e8ef7', '#7ab0ff', '#00a37a', '#f0a202'];

const formatXp = (xp) => {
    if (xp >= 1000000) {
        return `${(xp / 1000000).toFixed(2)} MB`;
    }

    if (xp >= 1000) {
        return `${Math.round(xp / 1000)} KB`;
    }

    return `${xp} B`;
};

const toPercentage = (value, total) => {
    if (!total) {
        return 0;
    }

    return Math.round((value / total) * 100);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const createSkillsChart = (skills = []) => {
    const wrapper = document.createElement('section');
    wrapper.className = 'panel skills-panel';

    const title = document.createElement('div');
    title.className = 'panel-heading';
    title.innerHTML = '<h2>Skills Doughnut Chart</h2><p>Top validated skill progress</p>';

    const body = document.createElement('div');
    body.className = 'skills-chart-layout';

    const chart = document.createElement('div');
    chart.className = 'skills-chart';

    if (!skills.length) {
        chart.classList.add('skills-chart-empty');
        chart.innerHTML = '<span>No skill data available</span>';
        body.appendChild(chart);
        wrapper.append(title, body);
        return wrapper;
    }

    const total = skills.reduce((sum, skill) => sum + skill.amount, 0);
    let currentAngle = 0;
    const gradientStops = skills.map((skill, index) => {
        const share = (skill.amount / total) * 360;
        const start = currentAngle;
        currentAngle += share;
        const color = SKILL_COLORS[index % SKILL_COLORS.length];
        return `${color} ${start}deg ${currentAngle}deg`;
    });

    chart.style.background = `conic-gradient(${gradientStops.join(', ')})`;
    chart.innerHTML = `
        <div class="skills-chart-center">
            <strong>${skills.length}</strong>
            <span>Tracked skills</span>
        </div>
    `;

    const legend = document.createElement('div');
    legend.className = 'skills-legend';

    skills.forEach((skill, index) => {
        const item = document.createElement('div');
        item.className = 'skills-legend-item';
        item.innerHTML = `
            <span class="skills-color" style="background:${SKILL_COLORS[index % SKILL_COLORS.length]}"></span>
            <div>
                <strong>${skill.label}</strong>
                <span>${skill.amount} - ${toPercentage(skill.amount, total)}%</span>
            </div>
        `;
        legend.appendChild(item);
    });

    body.append(chart, legend);
    wrapper.append(title, body);
    return wrapper;
};

export const createProjectProgressChart = (projects = []) => {
    const section = document.createElement('section');
    section.className = 'panel';

    const heading = document.createElement('div');
    heading.className = 'panel-heading';
    heading.innerHTML = '<h2>Project Progress</h2><p>Completed projects  and XP gained</p>';

    if (!projects.length) {
        section.append(heading);
        const empty = document.createElement('p');
        empty.className = 'empty-state';
        empty.textContent = 'No project progress found yet.';
        section.appendChild(empty);
        return section;
    }

    const chartWrap = document.createElement('div');
    chartWrap.className = 'project-chart-wrap';

    const tooltip = document.createElement('div');
    tooltip.className = 'chart-tooltip';
    tooltip.hidden = true;

    const width = 760;
    const height = 360;
    const padding = { top: 36, right: 24, bottom: 42, left: 36 };
    const maxXp = Math.max(...projects.map((project) => project.xp), 1);
    const minXp = Math.min(...projects.map((project) => project.xp), 0);
    const spread = Math.max(maxXp - minXp, 1);
    const stepX = projects.length > 1 ? (width - padding.left - padding.right) / (projects.length - 1) : 0;

    const points = projects.map((project, index) => {
        const x = padding.left + stepX * index;
        const y = height - padding.bottom - ((project.xp - minXp) / spread) * (height - padding.top - padding.bottom);
        return { ...project, x, y };
    });

    const pathData = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
    const areaData = `${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`;
    const yTicks = 4;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'project-chart');
    svg.innerHTML = `
        <defs>
            <linearGradient id="project-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#004ac6" stop-opacity="0.18" />
                <stop offset="45%" stop-color="#004ac6" stop-opacity="0.72" />
                <stop offset="100%" stop-color="#2563eb" stop-opacity="1" />
            </linearGradient>
            <linearGradient id="project-area" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#2563eb" stop-opacity="0.24" />
                <stop offset="100%" stop-color="#2563eb" stop-opacity="0.02" />
            </linearGradient>
        </defs>
        ${Array.from({ length: yTicks + 1 }, (_, tickIndex) => {
        const ratio = tickIndex / yTicks;
        const y = padding.top + ratio * (height - padding.top - padding.bottom);
        return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" class="chart-grid-line"></line>`;
    }).join('')}
        <path d="${areaData}" class="chart-area"></path>
        <path d="${pathData}" class="chart-line"></path>
        ${points.map((point, index) => `
            <g class="chart-point-group" data-index="${index}">
                <circle class="chart-point-glow" cx="${point.x}" cy="${point.y}" r="14"></circle>
                <circle class="chart-point" cx="${point.x}" cy="${point.y}" r="6"></circle>
            </g>
        `).join('')}
    `;

    const showTooltip = (point, target) => {
        tooltip.hidden = false;
        tooltip.innerHTML = `
            <strong>${point.name}</strong>
            <span>${formatXp(point.xp)} earned</span>
            <span>${point.validatedAt}</span>
        `;

        const containerRect = chartWrap.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        tooltip.style.left = `${targetRect.left - containerRect.left + 14}px`;
        tooltip.style.top = `${targetRect.top - containerRect.top - 10}px`;
    };

    const hideTooltip = () => {
        tooltip.hidden = true;
    };

    svg.querySelectorAll('.chart-point-group').forEach((node) => {
        const point = points[Number(node.getAttribute('data-index'))];

        node.addEventListener('mouseenter', () => {
            showTooltip(point, node);
            node.classList.add('is-active');
        });

        node.addEventListener('mouseleave', () => {
            hideTooltip();
            node.classList.remove('is-active');
        });

        node.addEventListener('focusin', () => {
            showTooltip(point, node);
            node.classList.add('is-active');
        });

        node.addEventListener('focusout', () => {
            hideTooltip();
            node.classList.remove('is-active');
        });

        node.setAttribute('tabindex', '0');
    });

    chartWrap.append(svg, tooltip);
    section.append(heading, chartWrap);
    return section;
};

export const createAuditGauge = (ratio) => {
    const normalizedRatio = Number.isFinite(ratio) ? ratio : 0;
    const clampedRatio = Math.min(Math.max(normalizedRatio, 0), 2);
    
    // Total length of the semi-circle arch (Pi * radius)
    // Path radius is 90, so length is ~282.7
    const totalLength = 283; 
    
    // Calculate how much of that length to fill
    // If ratio is 1.0, it fills 50% of the 0-2 range, which is half the arch.
    const fillAmount = (clampedRatio / 2) * totalLength;

    let tone = 'safe';
    if (normalizedRatio > 1) tone = 'optimal';
    else if (normalizedRatio < 1) tone = 'danger';

    const section = document.createElement('section');
    section.className = 'panel audit-panel';
    section.innerHTML = `
        <div class="panel-heading">
            <h2>Audit Ratio</h2>
        </div>
        <div class="audit-gauge audit-gauge-${tone}">
            <svg class="audit-gauge-svg" viewBox="0 0 240 140">
                <path d="M 30 120 A 90 90 0 0 1 210 120" class="audit-gauge-track"></path>
                <path d="M 30 120 A 90 90 0 0 1 210 120" 
                      class="audit-gauge-progress" 
                      style="stroke-dasharray: ${fillAmount} ${totalLength};">
                </path>
            </svg>
            <div class="audit-gauge-core">
                <strong>${normalizedRatio.toFixed(1)}</strong>
                <span>${normalizedRatio == 1 ? 'Balanced' : normalizedRatio > 1 ? 'Above 1.0' : 'Below 1.0'}</span>
            </div>
        </div>
    `;

    return section;
};
