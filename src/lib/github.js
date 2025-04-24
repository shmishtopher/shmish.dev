"use server";

import { GraphQLClient, gql } from "graphql-request";

// Define a query for fetching the latest 4 repositories
// by most recent commit. Pull the total number of commits
// in each repository.
const repoQuery = gql`
  {
    viewer {
      repositories(
        first: 4
        visibility: PUBLIC
        orderBy: { field: PUSHED_AT, direction: DESC }
        ownerAffiliations: OWNER
      ) {
        nodes {
          name
          description
          url
          primaryLanguage {
            name
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Define a GraphQL client on GitHub's GQL endpoint. The
// Auth token needs to be in our environment.
const client = new GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
  },
});

// Grab the most recently updated repos from the GitHub
// GraphQL API.
export async function fetchRepos() {
  const response = await client.request(repoQuery);
  const repos = response.viewer.repositories.nodes;

  // Extract the basic repo data into more digestable
  // objects
  return repos.map(repo => {
    return {
      name: repo.name,
      desc: repo.description,
      lang: repo.primaryLanguage.name,
      url: repo.url,
      count: repo.defaultBranchRef.target.history.totalCount,
    };
  });
}
