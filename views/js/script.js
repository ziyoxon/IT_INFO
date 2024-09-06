async function getAuthors() {
  let accessToken = localStorage.getItem("accessToken");

  console.log("accessToken", accessToken);

  const accessTokenExpTime = getTokenExpiration(accessToken);

  console.log("accessTokenExpTime", accessTokenExpTime);

  if (accessToken && accessTokenExpTime) {
    const currentTime = new Date();

    if (currentTime < accessTokenExpTime) {
      console.log("Access token faol");
    } else {
      console.log("Access tokeni vaqti chiqib ketdi");
      accessToken = await refreshTokenFunc();
      console.log("New Access Token", accessToken);

      if (!accessToken) {
        console.error("Access tokeni vaqti chiqib ketdi");
        return;
      }
    }

    fetch("http://localhost:3000/api/author", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      mode: "cors", //keyin koramiz
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.log("Request failed with status " + response.status);
        }
      })
      .then((author) => {
        if (author && author.data) {
          console.log(author.data);
          displayAuthors(author.data);
        } else {
          console.error("No author data returned");
        }
      })
      .catch((error) => {
        console.error("Error", error);
      });
  } else {
    console.log("Invalid access token or format");
  }
}

async function refreshTokenFunc() {
  const loginUrl = "/login";
  try {
    const responce = await fetch("http://localhost:3000/api/authors/refresh", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const data = await responce.json();
    if (data.error && data.error === "jwt expired") {
      console.log("Refresh token vaqti chiqib ketdi");
      return window.location.replace(loginUrl);
    }
    console.log("Tokenlar Refresh token orqali muvaffaqiyatli yangilandi");
    localStorage.setItem("accessToken", data.accessToken);
    return data.accessToken;
  } catch (error) {
    console.log(error);
    return window.location.replace(loginUrl);
  }
}

function getTokenExpiration(token) {
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Tokenning payload qismi olinadi
    if (decodedToken.exp) {
      return new Date(decodedToken.exp * 1000); // exp qiymatini millisekundga o‘girish
    }
  } catch (error) {
    console.error("Invalid token or parsing error:", error);
  }
  return null;
}

function displayAuthors(authors) {
  const listContainer = document.getElementById("author-list");

  listContainer.innerHTML = "";

  authors.forEach((author) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${author.first_name} ${author.last_name} - ${author.email}`;
    listContainer.appendChild(listItem);
  });
}
