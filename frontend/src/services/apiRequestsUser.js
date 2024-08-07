import apiClient from "services/axiosConfig";
import {
  API_PASSWORD_RESET_URL,
  API_ACTIVATE_USER_URL,
  API_REGISTER_USER_URL,
  API_LOGIN_USER_URL,
  API_LOGOUT_USER_URL,
} from "config";
import { getToken, removeToken, setToken } from "utils/cookies";
import { apiErrorHandler } from "./apiErrorHandler";

export async function postData(endpoint, data) {
  try {
    const response = await apiClient.post(endpoint, data, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function postLogin(username, password, recaptcha) {
  try {
    const authString = `${username}:${password}`;
    const encodedAuthString = btoa(authString);

    const response = await apiClient.post(
      API_LOGIN_USER_URL,
      { recaptcha: recaptcha },
      {
        headers: {
          ...apiClient.defaults.headers,
          Authorization: `Basic ${encodedAuthString}`,
        },
      }
    );
    if (response.status === 200) {
      const token = response.data.token;
      const expire = new Date(response.data.expiry);
      setToken(token, expire);
    }
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function registerUser(username, email, password, password_confirm, recaptcha) {
  try {
    const response = await apiClient.post(
      API_REGISTER_USER_URL,
      {
        username,
        email,
        password,
        password_confirm,
        recaptcha,
      },
      {
        headers: {
          ...apiClient.defaults.headers,
        },
      }
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getData(endpoint) {
  try {
    const response = await apiClient.get(endpoint);
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function getDataUsingUserToken(endpoint, token) {
  try {
    const response = await apiClient.get(endpoint, {
      headers: {
        ...apiClient.defaults.headers,
        Authorization: `Token ${token}`,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function activateUser(token) {
  try {
    const response = await apiClient.post(`${API_ACTIVATE_USER_URL}${token}/`, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function validatePasswordResetToken(token) {
  try {
    const response = await apiClient.get(`${API_PASSWORD_RESET_URL}${token}/`, {
      headers: {
        ...apiClient.defaults.headers,
      },
    });
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function postPasswordReset(token, password, password_confirm, recaptcha) {
  try {
    const response = await apiClient.post(
      `${API_PASSWORD_RESET_URL}${token}/`,
      {
        password,
        password_confirm,
        recaptcha,
      },
      {
        headers: {
          ...apiClient.defaults.headers,
        },
      }
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function postPasswordRecovery(email, recaptcha) {
  try {
    const response = await apiClient.post(
      `${API_PASSWORD_RESET_URL}`,
      {
        email,
        recaptcha,
      },
      {
        headers: {
          ...apiClient.defaults.headers,
        },
      }
    );
    return response;
  } catch (error) {
    apiErrorHandler(error);
  }
}

export async function logoutUser() {
  const token = getToken();
  try {
    if (token) {
       await apiClient.post(
        API_LOGOUT_USER_URL,
        {},
        {
          headers: {
            ...apiClient.defaults.headers,
            Authorization: `Token ${token}`,
          },
        }
      );
      
      console.log("Bye");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized: Already logged out or token invalid.");
      return;
    }
    apiErrorHandler(error);
  }
  finally {
    removeToken();
  }
}


