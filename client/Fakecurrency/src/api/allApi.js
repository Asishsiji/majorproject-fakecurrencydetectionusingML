import axios from "axios";

export const AddControlRoom = (data) => {
  return axios.post("https://fake-currency-api-855732860347.us-central1.run.app/control-room/reg/", data);
};

export const GetControlRoom = () => {
  return axios.get("https://fake-currency-api-855732860347.us-central1.run.app/control-room/reg/");
};

export const UpdateControlRoom = (data, id) => {
  return axios.put(`https://fake-currency-api-855732860347.us-central1.run.app/control-room/reg/${id}/`, data);
};

export const DeleteControlRoom = (id) => {
  return axios.delete(`https://fake-currency-api-855732860347.us-central1.run.app/user/${id}/`);
};

export const PostLocation = (data) => {
  return axios.post("https://fake-currency-api-855732860347.us-central1.run.app/location/", data);
};

export const GetLocation = () => {
  return axios.get("https://fake-currency-api-855732860347.us-central1.run.app/location/");
};

export const GetUser = () => {
  return axios.get("https://fake-currency-api-855732860347.us-central1.run.app/user/");
};

export const GetUserList = () => {
  return axios.get("https://fake-currency-api-855732860347.us-central1.run.app/userlist/");
};

export const TokenLogin = async (data) => {
  return axios.post("https://fake-currency-api-855732860347.us-central1.run.app/token/", data);
};

export const GetFeedback = () => {
  return axios.get("https://fake-currency-api-855732860347.us-central1.run.app/admin_feedback/");
};



export const sendOtp = async (data) => {
  return axios.post("https://fake-currency-api-855732860347.us-central1.run.app/email/otp", data);
};

export const registerUser = async (data) => {
  return axios.post("https://fake-currency-api-855732860347.us-central1.run.app/user/", data);
};

export const resetPassword = (data) => {
  return axios.put("https://fake-currency-api-855732860347.us-central1.run.app/reset-password", data);
};

export const getMessages = (token, id) => {
  return axios.get(`https://fake-currency-api-855732860347.us-central1.run.app/chat/${id}/`, {
    headers: { Authorization: `Token ${token}` },
  });
};

export const addFeedbackUrl = async (data) => {
  const token = sessionStorage.getItem("token");

  return await axios.post(`https://fake-currency-api-855732860347.us-central1.run.app/feedback/`, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: ` Token ${token}`,
    },
  });
};


export const addfakeCurrency = async (data) => {
  const token = sessionStorage.getItem("token");

  return await axios.post(`https://fake-currency-api-855732860347.us-central1.run.app/result/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: ` Token ${token}`,
    },
  });
};


export const viewfakeCurrency = async (data) => {
  const token = sessionStorage.getItem("token");
  return await axios.get(`https://fake-currency-api-855732860347.us-central1.run.app/result/`, {
    headers: {
      Authorization: ` Token ${token}`,
    },
  });
};

export const ViewUserResult = async (id) => {
  const token = sessionStorage.getItem("token");
  return await axios.get(`https://fake-currency-api-855732860347.us-central1.run.app/user/result/${id}/`, {
    headers: {
      Authorization: ` Token ${token}`,
    },
  });
};

export const sendMessage = (token, id, message) => {
  return axios.post(
    `https://fake-currency-api-855732860347.us-central1.run.app/chat/${id}/`,
    { message },
    {
      headers: { Authorization: `Token ${token}` },
    }
  );
};

export const getUnreadMessages = (token) => {
  return axios.get(`https://fake-currency-api-855732860347.us-central1.run.app/chat/unread/`, {
    headers: { Authorization: `Token ${token}` },
  });
};
