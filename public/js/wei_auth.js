/**
 * authentication
 */

let token = "";

const urlParams = new URLSearchParams(window.location.search);
const mySite = urlParams.get('site');
// save site id to localstorage because callback won't have the query parm
if(mySite){
  lpTag.site = mySite;
  localStorage.setItem("lpsite", mySite);
} else {
  if(localStorage.lpsite){
    lpTag.site = localStorage.getItem("lpsite");
  } else {
    lpTag.site = 90412079;
  }
}

function identityFn(callback) {
  console.log("identity function");
  callback({
    // all three are required
    iss: "https://www.liveperson.com",
    acr: "loa1",
    sub: "920000",
  });
}
lpTag.identities.push(identityFn);

// Authentication JSMethod for LiveEngage
window.lpGetAuthenticationToken = function (callback) {
  console.log("inside lpGetAuthenticationToken!");
  /**
     * if token expires, use this curl command to get a new one, run it in terminal
     * curl --request POST \
  --url https://dev-ebsf4fc7.us.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{"client_id":"o1ooYcSdi25oaXQDZjYWdm0pNjYfw7Q0","client_secret":"sXxwFmKgG94ChJCEYvqXg34pDSUs10GFLlHLUUlo3H4jPcnO8q4QlUI25qMaGKop","audience":"https://quickstart/api","grant_type":"client_credentials"}'
     reference : https://manage.auth0.com/dashboard/us/dev-ebsf4fc7/apis/6355a59afcaa66cce5c0c8ed/test
     */
  // const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1Hd2Z0SlpHNnB1NnRmS1pPRlI2ZSJ9.eyJodHRwczovL2RvZ2Z5LmNvbS9yYW5kb21fZG9nIjoiaHR0cHM6Ly9pbWFnZXMuZG9nLmNlby9icmVlZHMvc3BhbmllbC1icml0dGFueS9uMDIxMDEzODhfMzI5NC5qcGciLCJnaXZlbl9uYW1lIjoiVGh1IiwiZmFtaWx5X25hbWUiOiJDb250YWN0cyIsIm5pY2tuYW1lIjoidGh1Y29udGFjdHMiLCJuYW1lIjoiVGh1IENvbnRhY3RzIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FMbTV3dTBReDVhSVhIYzR4LU9oU1V1VlNfY0VKazRLR0R2bzcydXdKZFRQaWc9czk2LWMiLCJsb2NhbGUiOiJlbiIsInVwZGF0ZWRfYXQiOiIyMDIyLTExLTAzVDIzOjIyOjAzLjU4NFoiLCJlbWFpbCI6InRodWNvbnRhY3RzQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi1lYnNmNGZjNy51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTAyMjM4MTUwNzI3MzI3NzYxNzgiLCJhdWQiOiJIc1RRQ0VTV2xFMHJYc05XOHJXb2pBbGtzNWtIN1NzNSIsImlhdCI6MTY2NzUxNzcyNiwiZXhwIjoxNjY3NTUzNzI2LCJzaWQiOiJzbS1NeWQ2RnJIaFFyYjRNWVRJb2dvQk1IQ21VTW5WNSIsIm5vbmNlIjoiY0RWdFRVOHRjbTVvWVRKWWFESlFhM05xTmpCdldscFNSRzB5TUhWR09XSnZaME52ZEU5MExUSkplQT09In0.Fv-BsO_huUS3AAM-7HEg35tos5ZyYAFIlv55L3_bHDBpEa71UmZ__FMFjAqP7vFRyOp5vfPdk_ztjJ-nrW6SBvJ5LB2trcvzZCHiRIDBVUBQxgbclWHor0zvUztiRiZtnLWJnl8VqJfS-dbkzRHGy0aAvLzXiyRwoiWFvQel3a_IByi4nblURt-rTsJciBOCIzPl8cyv2Qotcs4L1fhbTMbENOZ6BSxvW2O-nm7zktCh8NZMtLV45OhIg834Jzg_XNDjhm5bEmxS1_mPaNQIB0zyp9oUnYyZRnAF8ghFc-XbwtOPpB39yCyIOh43-bT2pzZwotcBt0AxajuoU2eLJA"; // paste your JWT in here
  token = window.jwt;
  if (token) {
    console.log("got token! " + token);
    console.log("calling callback with token...");
    callback(token);
  }
};

var settings = {
  async: true,
  crossDomain: true,
  url: "https://dev-ebsf4fc7.us.auth0.com/oauth/token",
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  data: '{"client_id":"o1ooYcSdi25oaXQDZjYWdm0pNjYfw7Q0","client_secret":"sXxwFmKgG94ChJCEYvqXg34pDSUs10GFLlHLUUlo3H4jPcnO8q4QlUI25qMaGKop","audience":"https://quickstart/api","grant_type":"client_credentials"}',
};

$.ajax(settings).done(function (response) {
  console.log(response);
  token = response.access_token;
});

lpTag.section = ["auth"];
console.log("push section");
