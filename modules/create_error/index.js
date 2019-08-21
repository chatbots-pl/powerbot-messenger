function create (err) {
  let error = null
  if (err.response && /^https:\/\/graph.facebook.com\//gmi.test(err.response.config.url)) {
    const o = err.response.data.error
    error = `[GRAPH_API_ERROR][${o.type}] ${o.message}`
  } else error = new Error(err)

  return error
}

module.exports = create
