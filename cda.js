import axios from "axios";
import FormData from "form-data";
import fs from "fs";
async function login(email, password) {
  try {
    const response = await axios.post("https://www.cda.pl/login", {
      email: email,
      password: password,
    });
    if (response.data.success) {
      console.log("Zalogowano pomyślnie!");
      return response.headers["set-cookie"]; // Zwróć ciasteczka sesyjne
    } else {
      throw new Error("Błąd logowania: " + response.data.message);
    }
  } catch (error) {
    console.error("Błąd logowania:", error);
  }
}

async function uploadVideo(cookies, videoPath, title, description) {
  const form = new FormData();
  form.append("file", fs.createReadStream(videoPath));
  form.append("title", title);
  form.append("description", description);

  try {
    const response = await axios.post("https://www.cda.pl/uploader", form, {
      headers: {
        ...form.getHeaders(),
        Cookie: cookies.join("; "),
      },
    });
    if (response.data.success) {
      console.log("Wideo zostało przesłane pomyślnie!");
    } else {
      throw new Error("Błąd przesyłania wideo: " + response.data.message);
    }
  } catch (error) {
    console.error("Błąd przesyłania wideo:", error);
  }
}

export { login, uploadVideo };
