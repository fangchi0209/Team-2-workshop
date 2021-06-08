const bookingDateInput = document.getElementById('bookingDate');

function emptyFieldReminder(inputField, message){
    const formControl = inputField.parentElement;
    formControl.classList.add('error');
    const errorMessage = formControl.querySelector('small');
    errorMessage.textContent = message;
}


function getBookingInfo(){
    let attrId = parseInt(location.pathname.split('/').pop());
    let date = document.getElementById('bookingDate').value
    const bookingTimeInputs = document.getElementsByName('time');
    let time;
    let price;
    for(let bookingTime of bookingTimeInputs){
        if(bookingTime.checked){
            time = bookingTime.value;
        }
    }
    if(time === 'morning'){
        price = 2000;
    }
    else if (time === 'afternoon'){
        price = 2500;
    }
    return {
        attractionId: attrId,
        date: date,
        time: time,
        price: price
    }
}

bookingDateInput.addEventListener('focus',()=>{
    if(bookingDateInput.parentElement.classList.contains('error')){
        bookingDateInput.parentElement.classList.remove('error');
    }
})


document.getElementById('bookingBtn').addEventListener('click', (evt)=>{
    evt.preventDefault();
    fetch(`${window.origin}/api/user`)
    .then(res => res.json())
    .then(data => {
        if(data.data){
            if(!bookingDateInput.value){
                emptyFieldReminder(bookingDateInput,"日期欄位不得為空白");
            }
            else{
                const requestBody = JSON.stringify(getBookingInfo());
                fetch('/api/booking',{
                    method:'POST',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    }),
                    body: requestBody
                })
                .then(res => res.json())
                .then(data => {
                    if (data.ok){
                        location.href = '/booking'
                    }
                    else if(data.error){
                        console.log(data.message.split(':')[1]);
                    }
                })
                .catch(err => {
                    console.log(`fetch error : ${err}`)
                })
            }
        }
        else{
            document.getElementById('logIn').classList.add('slide-in');
            document.getElementById('logIn').classList.add('show');
        }
    })
    .catch(err => {
        console.log(`fetch error : ${err}`)
    })
})

