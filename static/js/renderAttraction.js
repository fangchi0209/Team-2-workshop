const carouselSlide = document.getElementById('carouselSlide');
const indicatorGroup = document.getElementById('indicatorGroup');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let attractionData = {};


// ========== get data ===========
async function getData(){
    const attractionId = window.location.pathname.split('/').pop();
    const res = await fetch(`/api/attraction/${attractionId}`)
    const data = await res.json();  
    attractionData = data['data'];
};

// ============ render data ===========

// render carousel
function renderCarousel(){
    const attractionImages = attractionData['images'];
    attractionImages.forEach( imageUrl => {
        const image = document.createElement('img');
        image.src = imageUrl;
        image.alt = attractionData['name']
        image.classList.add('hide')
        carouselSlide.appendChild(image);

        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        indicatorGroup.appendChild(indicator);
    })
    carouselSlide.firstElementChild.classList.remove('hide');
    indicatorGroup.firstElementChild.classList.add('current');
}

// render attraction text information
function renderTextData(){
    const name = document.getElementById('name');
    const category = document.getElementById('category');
    const mrt = document.getElementById('mrt');
    const description = document.getElementById('description');
    const address = document.getElementById('address');
    const transport = document.getElementById('transport');
    name.innerText = attractionData['name'];
    category.innerText = attractionData['category'];
    mrt.innerText = attractionData['mrt'] ? ` at ${attractionData['mrt']}`: "";
    description.innerText = attractionData['description'];
    address.innerText = attractionData['address'];
    transport.innerText = attractionData['transport'] ? attractionData['transport'] : "尚無相關資料";
};

// disable date selection before today
function setSelectMinDate(){
    const now = new Date();
    const nowStr = now.toISOString();
    const today = nowStr.split('T')[0];
    const bookingDate = document.getElementById('bookingDate');
    bookingDate.setAttribute('min', today);
}


// ========== initialize ===========
(async function init(){
    await getData();
    renderCarousel();
    renderTextData();
    setSelectMinDate();
})();


// =========== carousel change image feature ===========

const carouselImages = carouselSlide.children;
const indicators = indicatorGroup.children;

function nextImage(){
    let imgNum = carouselImages.length;
    carouselImages[currentIndex].classList.add('hide');
    indicators[currentIndex].classList.remove('current');
    if (currentIndex < imgNum - 1){
        currentIndex++;
    }
    else{
        currentIndex = 0;
    }
    carouselImages[currentIndex].classList.remove('hide');
    indicators[currentIndex].classList.add('current');
}

function prevImage(){
    let imgNum = carouselImages.length;
    carouselImages[currentIndex].classList.add('hide');
    indicators[currentIndex].classList.remove('current');
    if (currentIndex > 0){
        currentIndex--;
    }
    else{
        currentIndex = imgNum - 1;
    }
    carouselImages[currentIndex].classList.remove('hide');
    indicators[currentIndex].classList.add('current');
}

// change carousel image by click arrow button
nextBtn.addEventListener('click', nextImage);
prevBtn.addEventListener('click',prevImage);

// change carousel image by click left/right side of the image
function clickSideToChangeImage(evt){
    const carouselTotalWidth = carouselSlide.getBoundingClientRect().width;
    const carouselLeft = carouselSlide.getBoundingClientRect().left;
    const leftBoundary =  carouselLeft + carouselTotalWidth / 3;
    const rightBoundary = carouselLeft + carouselTotalWidth / 3 * 2;
    if(evt.clientX < leftBoundary){
        prevImage();
    }
    else if(evt.clientX > rightBoundary){
        nextImage();
    }
}

carouselSlide.addEventListener('click', clickSideToChangeImage);


// change carousel image by swipe (on mobile or PAD device)
let touchOriginX = null;
let readyToSwipeAgain = false;
function getOrigin(evt){
    touchOriginX = evt.touches[0].clientX;
    readyToSwipeAgain = true;
}

function triggerSwipe(evt){
    let touchCurrentPosition = evt.touches[0].clientX;
    let moveDistance = touchCurrentPosition - touchOriginX;
    if(readyToSwipeAgain && moveDistance > 30){
        nextImage();
        readyToSwipeAgain = false;
    }
    else if(readyToSwipeAgain && moveDistance < -30){
        prevImage();
        readyToSwipeAgain = false;
    }
}

carouselSlide.addEventListener('touchstart', getOrigin);
carouselSlide.addEventListener('touchmove', triggerSwipe);


// ========= price varies according to time selection =========
const morningSelect = document.getElementById('morning');
const afternoonSelect = document.getElementById('afternoon');
const price = document.getElementById('price')
function renderPrice(){
    if(morningSelect.checked){
        price.innerText = "新台幣 2000 元"
    }
    else if(afternoonSelect.checked)
    {
        price.innerText = "新台幣 2500 元"
    }
}
const timeSelect = document.getElementById('timeSelect');
timeSelect.addEventListener('change',renderPrice)


//======= loader effect while image loading ==========
const loader = document.getElementById('loader');
for(let image of carouselImages){
    image.addEventListener('load', () => {
        loader.hidden = true;
    })
}