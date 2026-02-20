// The Auth0 client, initialized in configureClient()
let auth0Client = null;

/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
  try {
    console.log("Logging in", targetUrl);

    const options = {
      authorizationParams: {
        redirect_uri: window.location.origin + window.location.pathname
      }
    };

    if (targetUrl) {
      options.appState = { targetUrl };
    }

    await auth0Client.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

/**
 * Executes the logout flow
 */
const logout = async () => {
  try {
    console.log("Logging out");
    await auth0Client.logout({
      logoutParams: {
        returnTo: window.location.origin + window.location.pathname
      }
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("./public/auth_config.json");

/**
 * Initializes the Auth0 client
 */
const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0Client = await auth0.createAuth0Client({
    domain: config.domain,
    clientId: config.clientId
  });
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

const normalizeRoute = (href) => {
  if (!href) return "/";
  if (href.startsWith("#")) return href.slice(1) || "/";
  return href;
};

// Will run when page finishes loading
window.onload = async () => {
  await configureClient();

  const initialRoute = getRouteFromLocation();

  if (!showContentFromUrl(initialRoute)) {
    showContentFromUrl("/");
    window.location.hash = "#/";
  }

  const bodyElement = document.getElementsByTagName("body")[0];

  bodyElement.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    const link = target ? target.closest("a.route-link") : null;
    if (link && isRouteLink(link)) {
      const url = normalizeRoute(link.getAttribute("href"));

      if (showContentFromUrl(url)) {
        e.preventDefault();
        window.location.hash = `#${url}`;
      }
    }
  });

  const isAuthenticated = await auth0Client.isAuthenticated();

  if (isAuthenticated) {
    console.log("> User is authenticated");
    updateUI();
    return;
  }

  console.log("> User not authenticated");

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    console.log("> Parsing redirect");
    let targetUrl = "/";
    try {
      const result = await auth0Client.handleRedirectCallback();

      if (result.appState && result.appState.targetUrl) {
        targetUrl = result.appState.targetUrl;
        showContentFromUrl(result.appState.targetUrl);
      }

      console.log("Logged in!");
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }

    window.location.hash = `#${targetUrl}`;
  }

  updateUI();
};
