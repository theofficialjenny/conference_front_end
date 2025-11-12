import axios from 'axios';

export const getValidToken = async () => {
  let accessToken = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  if (!accessToken) return null;

  try {
    await axios.get('http://127.0.0.1:8000/api/users/me/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return accessToken;
  } catch (err) {
    if (err.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
          refresh: refreshToken,
        });
        accessToken = res.data.access;
        localStorage.setItem('access', accessToken);
        return accessToken;
      } catch (refreshErr) {
        console.error('Refresh token failed', refreshErr);
        return null;
      }
    } else {
      return null;
    }
  }
};
