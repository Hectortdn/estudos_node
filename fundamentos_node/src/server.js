import http from "node:http";
import { routes } from "./routes.js";
import { json } from "./middlewares/json.js";
import { extractQueryParams } from "./utils/extractQueryParams.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find(
    (route) => route.method == method && route.path.test(url)
  );

  if (route) {
    const params = req.url.match(route.path);
    const { query, ...routeParams } = params.groups;

    req.params = routeParams;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end("Route not found");
});

server.listen(3333);
