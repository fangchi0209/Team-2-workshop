// ==========================================
// ============ pop up modal ================
// ==========================================

const logInSignUp = document.getElementById("logInSignUp");
const signUpLink = document.getElementById("signUpLink");
const logInLink = document.getElementById("logInLink");
const logIn = document.getElementById("logIn");
const signUp = document.getElementById("signUp");
const signUpMessage = document.getElementById("signUpMessage");
const logInMessage = document.getElementById("logInMessage");
const logOutSuccess = document.getElementById("logOutSuccess");
const logInSuccess = document.getElementById("logInSuccess");
const inputFields = document.querySelectorAll(".form-control input");

function clearMessage(element) {
  element.classList.remove("error");
  element.classList.remove("success");
  element.textContent = "";
}

function slideIn(element) {
  element.classList.add("slide-in");
}

function hide(element) {
  element.classList.remove("slide-in");
  element.classList.remove("show");
  // clear existed input
  const allInput = element.querySelectorAll("input");
  for (let input of allInput) {
    input.value = "";
  }
}

function show(element) {
  element.classList.add("show");
  document.body.addEventListener("click", (evt) => {
    if (!evt.target.closest("li#logInSignUp") && !evt.target.closest("div.pop-up-modal")) {
      hide(element);
      clearMessage(element.querySelector("span"));
    }
  });
}

function emptyFieldReminder(inputField, message) {
  const formControl = inputField.parentElement;
  formControl.classList.add("error");
  const errorMessage = formControl.querySelector("small");
  errorMessage.textContent = message;
}

function removeEmptyFieldReminder() {
  for (let inputField of inputFields) {
    if (inputField.parentElement.classList.contains("error")) {
      inputField.parentElement.classList.remove("error");
    }
  }
}

logInSignUp.addEventListener("click", () => {
  slideIn(logIn);
  show(logIn);
});

signUpLink.addEventListener("click", () => {
  clearMessage(logInMessage);
  hide(logIn);
  removeEmptyFieldReminder();
  show(signUp);
});

logInLink.addEventListener("click", () => {
  clearMessage(signUpMessage);
  hide(signUp);
  removeEmptyFieldReminder();
  show(logIn);
});

const logInClose = document.getElementById("logInClose");
const signUpClose = document.getElementById("signUpClose");
const logInSuccessClose = document.getElementById("logInSuccessClose");
const logOutSuccessClose = document.getElementById("logOutSuccessClose");

logInClose.addEventListener("click", () => {
  hide(logIn);
});
signUpClose.addEventListener("click", () => {
  hide(signUp);
});
logInSuccessClose.addEventListener("click", () => {
  hide(logInSuccess);
});
signUpClose.addEventListener("click", () => {
  hide(logOutSuccess);
});

// ==============================================
// ============ Log In / Sign up ================
// ==============================================

// helper functions

function showMessage(error, targetElement) {
  targetElement.textContent = error;
}

// ======= log in =======
const logInForm = document.getElementById("logInForm");
logInForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const logInEmail = document.getElementById("logInEmail");
  const logInPassword = document.getElementById("logInPassword");

  const email = logInEmail.value.trim();
  const password = logInPassword.value.trim();

  if (email === "" || password === "") {
    if (email === "") {
      emptyFieldReminder(logInEmail, "?????????????????????????????????");
    }
    if (password === "") {
      emptyFieldReminder(logInPassword, "???????????????????????????");
    }
  } else {
    const requestBody = JSON.stringify({
      email: email,
      password: password,
    });

    let responseStatus;

    fetch(`${window.origin}/cowork/api/user`, {
      method: "PATCH",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: requestBody,
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          hide(logIn);
          slideIn(logInSuccess);
          show(logInSuccess);
          setTimeout(() => {
            location.reload();
          }, 2000);
        } else if (data.error && responseStatus === 400) {
          logInMessage.classList.add("error");
          error = data.message;
          showMessage(error, logInMessage);
        } else if (data.error && responseStatus === 500) {
          logInMessage.classList.add("error");
          logInMessage.textContent = "?????????????????????????????????";
        }
      })
      .catch((err) => {
        console.log(`fetch error : ${err}`);
      });
  }
});

// ======= sign up =======
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const signUpName = document.getElementById("signUpName");
  const signUpEmail = document.getElementById("signUpEmail");
  const signUpPassword = document.getElementById("signUpPassword");

  const name = signUpName.value.trim();
  const email = signUpEmail.value.trim();
  const password = signUpPassword.value.trim();

  if (name === "" || email === "" || password === "") {
    if (name === "") {
      emptyFieldReminder(signUpName, "???????????????????????????");
    }
    if (email === "") {
      emptyFieldReminder(signUpEmail, "?????????????????????????????????");
    }
    if (password === "") {
      emptyFieldReminder(signUpPassword, "???????????????????????????");
    }
  } else {
    const requestBody = JSON.stringify({
      name: name,
      email: email,
      password: password,
    });

    let responseStatus;

    fetch(`${window.origin}/cowork/api/user`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: requestBody,
    })
      .then((res) => {
        responseStatus = res.status;
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          signUpMessage.classList.add("success");
          signUpMessage.textContent = "????????????";
          const logInLink = document.getElementById("logInLink");
          logInLink.textContent = "????????????";
        } else if (data.error && responseStatus === 400) {
          error = data.message;
          signUpMessage.classList.add("error");
          showMessage(error, signUpMessage);
        } else if (data.error && responseStatus === 500) {
          signUpMessage.classList.add("error");
          signUpMessage.textContent = "?????????????????????????????????";
        }
      })
      .catch((err) => {
        console.log(`fetch error : ${err}`);
      });
  }
});

//  remove emptyFieldReminder once user is focus again
for (let inputField of inputFields) {
  inputField.addEventListener("focus", () => {
    if (inputField.parentElement.classList.contains("error")) {
      inputField.parentElement.classList.remove("error");
    }
  });
}

// =====================================
// ============ Log Out ================
// =====================================

const logOut = document.getElementById("logOut");

logOut.addEventListener("click", () => {
  fetch("/cowork/api/user", { method: "DELETE" })
    .then((res) => res.json())
    .then((data) => {
      if (data.ok) {
        slideIn(logOutSuccess);
        show(logOutSuccess);
        setTimeout(() => {
          location.reload();
        }, 2000);
      }
    });
});
