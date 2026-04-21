import { DASHBOARD_QUERY, graphQlURL } from '../configs/config.js';

const parseJsonSafely = (value) => {
    if (!value) {
        return {};
    }

    if (typeof value === 'object') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return {};
    }
};

const getPhoneNumber = (attrs) => {
    return (
        attrs.phone ??
        attrs.Phone ??
        attrs.tel ??
        attrs.mobile ??
        attrs.phoneNumber ??
        'Not available'
    );
};

const getAvatar = (user, attrs) => {
    return (
        user.avatarUrl ??
        attrs.avatar ??
        attrs.avatarUrl ??
        attrs.profile ??
        ''
    );
};

const normalizeSkills = (skills = []) => {
    const bestSkills = new Map();

    skills.forEach((skill) => {
        const currentAmount = Number(skill.amount ?? 0);
        const previousAmount = bestSkills.get(skill.type) ?? -Infinity;

        if (currentAmount > previousAmount) {
            bestSkills.set(skill.type, currentAmount);
        }
    });

    return [...bestSkills.entries()]
        .map(([type, amount]) => ({
            type,
            label: type.replace(/^skill_/, '').replace(/_/g, ' '),
            amount,
        }))
        .sort((left, right) => right.amount - left.amount)
        .slice(0, 6);
};

const normalizeProjects = (projects = []) => {
    return projects.map((project) => ({
        name: project.object?.name ?? project.path?.split('/').pop() ?? 'Unnamed project',
        xp: Number(project.amount ?? 0),
    }));
};

const normalizeProfile = (data) => {
    const user = data.user?.[0];

    if (!user) {
        throw new Error('No user profile returned by the GraphQL API.');
    }

    const attrs = parseJsonSafely(user.attrs);
    const firstName = user.firstName ?? attrs.firstName ?? '';
    const lastName = user.lastName ?? attrs.lastName ?? '';
    const fullName = `${firstName} ${lastName}`.trim() || user.login;
    const projects = normalizeProjects(data.projects);

    return {
        id: user.id,
        login: user.login ?? 'Unknown',
        firstName,
        lastName,
        fullName,
        email: user.email ?? attrs.email ?? 'Not available',
        phone: getPhoneNumber(attrs),
        campus: user.campus ?? attrs.campus ?? 'Unknown',
        level: Number(data.level?.[0]?.amount ?? 0),
        xp: Number(data.xpTotal?.aggregate?.sum?.amount ?? 0),
        auditRatio: Number(user.auditRatio ?? 0),
        avatar: getAvatar(user, attrs),
        skills: normalizeSkills(data.skills),
        projects,
    };
};

export const fetchDashboardData = async (token) => {
    const response = await fetch(graphQlURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: DASHBOARD_QUERY,
        }),
    });

    if (!response.ok) {
        throw new Error('Unable to load profile data.');
    }

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0].message || 'GraphQL query failed.');
    }

    return normalizeProfile(result.data);
};
