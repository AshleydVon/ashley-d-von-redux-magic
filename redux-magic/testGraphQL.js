import fetch from 'node-fetch';

async function testGraphQL() {
  const response = await fetch('http://localhost:3001/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        query {
          products {
            _id
            name
            description
          }
        }
      `,
    }),
  });

  const data = await response.json();
  console.log(data);
}

testGraphQL();
