export const authURL = 'https://learn.zone01oujda.ma/api/auth/signin';
export const graphQlURL = 'https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql';

export const DASHBOARD_QUERY = `
query DashboardData {
  user {
    id
    login
    email
    firstName
    lastName
    auditRatio
    avatarUrl
    campus
    attrs
  }

  level: transaction(
    where: {
      _and: [
        { type: { _eq: "level" } }
        { path: { _like: "%module%" } }
      ]
    }
    order_by: { amount: desc }
    limit: 1
  ) {
    amount
    path
  }

  xpTotal: transaction_aggregate(
    where: {
      _and: [
        { type: { _eq: "xp" } }
        { event: { object: { name: { _eq: "Module" } } } }
      ]
    }
  ) {
    aggregate {
      sum {
        amount
      }
    }
  }

  projects: transaction(
    where: {
      _and: [
        { type: { _eq: "xp" } }
        { event: { object: { name: { _eq: "Module" } } } }
        { object: { type: { _eq: "project" } } }
      ]
    }
    order_by: { createdAt: asc }
  ) {
    amount
    createdAt
    path
    invalidatedAt
    invalidationReason
    object {
      name
      type
    }
  }

  skills: transaction(
    where: {
      type: { _ilike: "skill_%" }
    }
    order_by: [{ type: asc }, { amount: desc }]
  ) {
    type
    amount
    path
  }
}
`;
