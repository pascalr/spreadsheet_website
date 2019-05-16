import toRegex from 'path-to-regexp';
function matchURI(path, uri) {
  const keys = [];
  const pattern = toRegex(path, keys); // TODO: Use caching
  const match = pattern.exec(uri);
  if (!match) return null;
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] =
      match[i] !== undefined ? match[i] : undefined;
  }
  return params;
}
function resolve(routes, rawPathname) {
  const pathname = rawPathname[0] === '#' ? rawPathname.slice(1) : rawPathname
  console.log(`route: path=${pathname}`)
  for (const route of routes) {
    const params = matchURI(route.path, pathname);
    if (!params) continue;
    const result = route.action({ ...params,pathname });
    if (result) return result;
  }

  const defaultRoute = routes.filter(r => (r.default))[0]

  if (defaultRoute) {
    console.log('No route matches. Showing default route.')
    return defaultRoute.action({pathname})
  } else {
    const error = new Error('No route matches this location.');
    error.status = 404;
    throw error;
  }
}
export default { resolve };
