// ==========================================
// ============ pop up modal ================
// ==========================================

const logInSignUp = document.getElementById('logInSignUp');
const signUpLink = document.getElementById('signUpLink');
const logInLink = document.getElementById('logInLink');
const logIn = document.getElementById('logIn');
const signUp = document.getElementById('signUp');
const signUpMessage = document.getElementById('signUpMessage');
const logInMessage = document.getElementById('logInMessage');
const logOutSuccess = document.getElementById('logOutSuccess');
const logInSuccess = document.getElementById('logInSuccess');
const inputFields = document.querySelectorAll('.form-control input');


function clearMessage(element){
    element.classList.remove('error');
    element.classList.remove('success');
    element.textContent = '';
}

function slideIn(element){
    element.classList.add('slide-in');
} 

function hide(element){
    element.classList.remove('slide-in');
    element.classList.remove('show');
    // clear existed input
    const allInput = element.querySelectorAll('input');
    for (let input of allInput){
        input.value='';
    }
}

function show(element){
    element.classList.add('show');
    document.body.addEventListener('click',(evt)=>{
        if( !evt.target.closest('li#logInSignUp') && !evt.target.closest ('div.pop-up-modal')){
            hide(element);
            clearMessage(element.querySelector('span'));
        }
    })
}

function emptyFieldReminder(inputField, message){
    const formControl = inputField.parentElement;
    formControl.classList.add('error');
    const errorMessage = formControl.querySelector('small');
    errorMessage.textContent = message;
}

function removeEmptyFieldReminder(){
    for(let inputField of inputFields){
            if(inputField.parentElement.classList.contains('error')){
                inputField.parentElement.classList.remove('error');
            }
    }
}

logInSignUp.addEventListener('click', () => {
    slideIn(logIn);
    show(logIn);
})

signUpLink.addEventListener('click', () => {
    clearMessage(logInMessage);
    hide(logIn);
    removeEmptyFieldReminder();
    show(signUp);
})

logInLink.addEventListener('click', () => {
    clearMessage(signUpMessage);
    hide(signUp);
    removeEmptyFieldReminder();
    show(logIn);
})


const logInClose = document.getElementById('logInClose');
const signUpClose = document.getElementById('signUpClose');
const logInSuccessClose = document.getElementById('logInSuccessClose');
const logOutSuccessClose = document.getElementById('logOutSuccessClose');


logInClose.addEventListener('click', ()=>{hide(logIn)})
signUpClose.addEventListener('click', ()=>{hide(signUp)})
logInSuccessClose.addEventListener('click', ()=>{hide(logInSuccess)})
signUpClose.addEventListener('click', ()=>{hide(logOutSuccess)})


// ==============================================
// ============ Log In / Sign up ================
// ==============================================

// helper functions

function showMessage(error_type, targetElement){
    switch(error_type){
        case 'a':
            targetElement.textContent = "請先登出";
            break;
        case 'b':
            targetElement.textContent = "此電子郵件已被使用"
            break;
        case 'c':
            targetElement.textContent = "所有欄位不可為空白"
            break;
        case 'd':
            targetElement.textContent = "密碼錯誤"
            break;
        case 'e':
            targetElement.textContent = "此電子郵件尚未註冊"
            break;
    }
}

// ======= log in =======
const logInForm = document.getElementById('logInForm');
logInForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const logInEmail = document.getElementById('logInEmail');
    const logInPassword = document.getElementById('logInPassword');

    const email = logInEmail.value.trim();
    const password = logInPassword.value.trim();

    if(email ==='' || password ===''){
        if(email ===''){
            emptyFieldReminder(logInEmail,"電子信箱欄位不得為空白")
        } 
        if(password ===''){
            emptyFieldReminder(logInPassword,"密碼欄位不得為空白")
        }   
    }
    else{

        const requestBody = JSON.stringify({
            email: email,
            password: password
        });
    
        let responseStatus;
    
        fetch(`${window.origin}/api/user`,{
            method:'PATCH',
            headers: new Headers({ 
                'Content-Type': 'application/json'
            }),
            body: requestBody
        })
        .then(res => {
            responseStatus = res.status;
            return res.json();
        })
        .then(data => {
            if(data.ok){
                hide(logIn);
                slideIn(logInSuccess);
                show(logInSuccess);
                setTimeout(() =>{
                    location.reload();
                },2000)
            }
            else if (data.error && responseStatus === 400){
                logInMessage.classList.add('error');
                error_type = data.message.split(':')[0];
                showMessage(error_type, logInMessage);
            }
            else if(data.error && responseStatus === 500){
                logInMessage.classList.add('error');
                logInMessage.textContent = "很抱歉，伺服器出現錯誤"; 
            }
        })
        .catch(err => {
            console.log(`fetch error : ${err}`)
        })
    }
})


// ======= sign up =======
const signUpForm = document.getElementById('signUpForm');
signUpForm.addEventListener('submit', evt => {
    evt.preventDefault();

    const signUpName = document.getElementById('signUpName');
    const signUpEmail = document.getElementById('signUpEmail');
    const signUpPassword = document.getElementById('signUpPassword');

    const name = signUpName.value.trim();
    const email = signUpEmail.value.trim();
    const password = signUpPassword.value.trim();

    if(name ==='' || email ==='' || password ===''){
        if(name ===''){
            emptyFieldReminder(signUpName,"姓名欄位不得為空白")
        } 
        if(email ===''){
            emptyFieldReminder(signUpEmail,"電子信箱欄位不得為空白")
        } 
        if(password ===''){
            emptyFieldReminder(signUpPassword,"密碼欄位不得為空白")
        }   
    }
    else{
        const requestBody = JSON.stringify({
            name: name,
            email: email,
            password: password
        });
    
        let responseStatus;
    
        fetch(`${window.origin}/api/user`,{
            method:'POST',
            headers: new Headers({ 
                'Content-Type': 'application/json'
            }),
            body: requestBody
        })
        .then(res => {
            responseStatus = res.status;
            return res.json();
        })
        .then(data => {
            if(data.ok){
                signUpMessage.classList.add('success');
                signUpMessage.textContent = "註冊成功"; 
                const logInLink = document.getElementById('logInLink');
                logInLink.textContent = "點此登入";
            }
            else if(data.error && responseStatus === 400){
                error_type = data.message.split(':')[0];
                signUpMessage.classList.add('error');
                showMessage(error_type, signUpMessage);
            }
            else if(data.error && responseStatus === 500){
                signUpMessage.classList.add('error');
                signUpMessage.textContent = "很抱歉，伺服器出現錯誤"; 
            }
        })
        .catch(err => {
            console.log(`fetch error : ${err}`)
        })
    }
})

//  remove emptyFieldReminder once user is focus again
for(let inputField of inputFields){
    inputField.addEventListener('focus', ()=>{
        if(inputField.parentElement.classList.contains('error')){
            inputField.parentElement.classList.remove('error');
        }
    })
}


// =====================================
// ============ Log Out ================
// =====================================

const logOut = document.getElementById('logOut');

logOut.addEventListener('click', () => {
    fetch('/api/user',{method:'DELETE'})
    .then(res => res.json())
    .then(data => {
        if(data.ok){
            slideIn(logOutSuccess);
            show(logOutSuccess);
            setTimeout(() =>{
                location.reload();
            },2000) 
        }
    })
})
