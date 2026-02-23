// URL mapping, from hash to a function that responds to that URL action
window.jwt = "123";

const router = {
  "/": () => showContent("content-home"),
  "/wei_auth": () => showContent("content-home"),
  "/profile": () =>
    requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login(),
};

const getRouteFromLocation = () => {
  const hash = window.location.hash || "#/";
  const route = hash.startsWith("#") ? hash.slice(1) : hash;
  return route || "/";
};

//Declare helper functions

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "content-profile") {
    // TODO: thi is SPA, so we need to push refresh
    // https://developers.liveperson.com/web-tag-new-page-refresh.html
    console.log("show lp chat button");
    // lpTag.sdes = lpTag.sdes || {};
    // // lpTag.section = ["wat-live", "english"];
    // lpTag.section = ["auth"];
    // lpTag.sdes.push({
    //   type: "cart", //mandatory
    //   total: 11.7, // total value of the cart affter discount
    //   currency: "USD",
    //   numItems: 6,
    //   products: [
    //     {
    //       product: {
    //         name: "prod1",
    //         category: "category",
    //         sku: "sku",
    //         prive: 7.8,
    //       },
    //       quantity: 11,
    //     },
    //   ],
    // });
    // lpTag.identities.push(identityFn);
  }
};

// function identityFn(callback) {
//   console.log("identity function");
//   callback({
//     // all three are required
//     iss: "https://www.liveperson.com",
//     acr: "loa1",
//     sub: "920000",
//   });
// }

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      const token = await auth0Client.getTokenSilently();
      const claims = await auth0Client.getIdTokenClaims();
      console.log(token);
      // this returns a valid JWT, just have to figure out how to add SDEs
      console.log(claims.__raw);
      window.jwt = claims.__raw;

      document.getElementById("profile-data").innerText = JSON.stringify(
        user,
        null,
        2
      );

      document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};

window.onhashchange = () => {
  const route = getRouteFromLocation();
  if (!showContentFromUrl(route)) {
    window.location.hash = "#/";
  }
};
