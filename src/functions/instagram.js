import fetch from "node-fetch"

const url =
  "https://www.instagram.com/graphql/query/?query_hash=56a7068fea504063273cc2120ffd54f3&variables={%22id%22:%2225233049542%22,%22first%22:12,%22after%22:null}"

let cache = {
  lastFetch: 0,
  posts: [],
}

async function getInstagramPosts() {
  const timeSinceLastFetch = Date.now() - cache.lastFetch
  console.log("DEBUG: last fetched: ", cache.lastFetch)
  console.log("DEBUG: time since last fetch: ", timeSinceLastFetch)

  if (timeSinceLastFetch <= 1800000) {
    return cache.posts
  } else {
    const response = await fetch(url)
    const { data } = await response.json()

    cache.lastFetch = Date.now()
    cache.posts = data

    return data
  }
}

module.exports.handler = async (event, context) => {
  const {
    user: {
      edge_owner_to_timeline_media: { edges },
    },
  } = await getInstagramPosts()

  const posts = edges.map(edge => ({
    id: edge.node.id,
    src: edge.node.thumbnail_src,
    url: `https://instagram.com/p/${edge.node.shortcode}`,
  }))

  return {
    statusCode: 200,
    body: JSON.stringify(posts),
  }
}
