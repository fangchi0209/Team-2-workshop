// check log in status
async function logInStatus() {
  try {
    const response = await fetch(`${window.origin}/cowork/api/user`);
    const data = await response.json();
    if (!data.data) {
      return false;
    } else {
      return true;
    }
  } catch {
    (err) => {
      console.log(`fetch error : ${err}`);
    };
  }
}

// check if logged in (if not, favorite feature cannot be used)
async function checkLogInBeforeFavarite() {
  try {
    const response = await fetch(`${window.origin}/cowork/api/user`);
    const data = await response.json();
    if (!data.data) {
      document.getElementById("logIn").classList.add("slide-in");
      document.getElementById("logIn").classList.add("show");
      return false;
    } else {
      return true;
    }
  } catch {
    (err) => {
      console.log(`fetch error : ${err}`);
    };
  }
}

// get favorite collection data
async function getFavoriteData() {
  try {
    const res = await fetch("/cowork/api/favorite", {
      method: "GET",
    });
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

//add to favorite collections
async function addFavoriteData(attractionId) {
  try {
    const res = await fetch("/cowork/api/favorite", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ attractionId: attractionId }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

// remove from favorite collections
async function removeFavoriteData(attractionId) {
  try {
    const res = await fetch(`/cowork/api/favorite/${attractionId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`fetch error : ${err}`);
  }
}

// toggle Favorite (add and remove from favorite);
async function toggleFavorite(heart) {
  const logInStatus = await checkLogInBeforeFavarite();
  if (!logInStatus) {
    return;
  }
  heart.classList.add("pending");
  const attractionId = parseInt(heart.dataset.attractionId);
  if (!heart.classList.contains("selected")) {
    const data = await addFavoriteData(attractionId);
    if (data.ok) {
      heart.classList.remove("pending");
      heart.classList.add("selected");
    } else if (data.error) {
      heart.classList.remove("pending");
      alert(data.message);
    }
  } else if (heart.classList.contains("selected")) {
    const data = await removeFavoriteData(attractionId);
    if (data.ok) {
      heart.classList.remove("pending");
      heart.classList.remove("selected");
    } else if (data.error) {
      heart.classList.remove("pending");
      alert(data.message);
    }
  }
}
