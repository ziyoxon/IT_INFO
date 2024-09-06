async function getDictionary() {
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

  fetch("http://localhost:3000/api/dict", {
    // URL'dagi 'htttp' to'g'rilandi
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
        return Promise.reject("Request failed"); // Promise to'xtatilgan
      }
    })
    .then((dictionary) => {
      console.log("Received dictionary:", dictionary);
      if (Array.isArray(dictionary.data)) {
        // 'dictionary.data' mavjudligini tekshirish
        displayDictionary(dictionary.data);
      } else {
        console.error("Expected an array but received:", dictionary);
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
      // URL'dagi 'htttp' to'g'rilandi
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

function displayDictionary(dictionaries) {
  if (!Array.isArray(dictionaries)) {
    console.error(
      "Expected an array for dictionaries but got:",
      typeof dictionaries
    );
    return;
  }

  const listContainer = document.getElementById("dictionary-list");
  listContainer.innerHTML = "";
  dictionaries.forEach((dictionary) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${dictionary.term} - ${dictionary.letter}`;
    listContainer.appendChild(listItem);
  });
}
