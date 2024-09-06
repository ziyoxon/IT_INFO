async function getTopics() {
  let accessToken = localStorage.getItem("accessToken");
  console.log("Access token: ", accessToken);
  const accessTokenExpTime = getTokenExpiration(accessToken);
  console.log("Access token exp: ", accessTokenExpTime);

  if (accessTokenExpTime) {
    const currentTime = new Date();
    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol!");
    } else {
      console.log("Access token expires!");
      accessToken = await refreshTokenFunc();
      console.log("New access token: ", accessToken);
    }
  } else {
    console.log("Invalid access token format!");
  }

  fetch("http://localhost:3000/api/topic", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log("Request failed with status: " + response.status);
        return Promise.reject("Request failed");
      }
    })
    .then((data) => {
      console.log("Received topics:", data);
      if (Array.isArray(data)) {
        displayTopic(data);
      } else {
        console.error("Expected an array but received:", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function refreshTokenFunc() {
  const loginUrl = "/login";
  try {
    const response = await fetch("http://localhost:3000/api/author/refresh", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.error && data.error === "jwt expired") {
      console.log("Refresh token vaqti o'tib ketgan");
      window.location.replace(loginUrl);
    }
    console.log("Tokenlar Refresh token orqali muvaffaqiyatli yangilandi");
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log(error);
    window.location.replace(loginUrl);
  }
}

function getTokenExpiration(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000);
    }
  } catch (error) {
    console.error("Invalid token format");
  }
  return null;
}

function displayTopic(topics) {
  if (!Array.isArray(topics)) {
    console.error("Expected an array for topics but got:", typeof topics);
    return;
  }

  const listContainer = document.getElementById("dictionary-list");
  listContainer.innerHTML = "";
  topics.forEach((topic) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${topic.author_id} - ${topic.topic_title} - ${topic.topic_text}`;
    listContainer.appendChild(listItem);
  });
}
