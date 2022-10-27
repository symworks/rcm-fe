import axios from "axios";

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const createAxios = (baseURL) => {
  const newInstance = axios.create({ baseURL  });

  newInstance.interceptors.request.use(
  (config) => {
    // config.headers.Cookie = `laravel_session=${getCookie('laravel_session')}`;
    return config
  },
  (error) => {
    // if (error && error.response.status === 401) {
    //   signOut();
    // }
    return Promise.reject(error);
  });

  return newInstance;
}

export default createAxios;
