const apiKey = "0jNWfF4lBNsapagiJp6srSvrE0PJT3FWNRuQRytk1IDYEudF9sBAnUEb";
// https://api.pexels.com/v1/curated?page=2&per_page=40 //画像表示
// "https://api.pexels.com/v1/search?query=nature&per_page=1"//検索
const modal = document.querySelector(".modal");
const downloadBtn = document.querySelector(".downloadBtn");
const closeBtn = document.querySelector(".fa-xmark");
const previewImg = document.querySelector(".preview-img img");
const searchForm = document.querySelector(".search-form input");
const resultsImages = document.querySelector(".results-images");
const moreBtn = document.querySelector(".more-btn");
let searchWord = "";
let apiUrl = "";
let page = 1;
let perPage = 20;

// 画像検索
searchForm.addEventListener("keyup", (e) => {
    searchWord = e.target.value;
    if (e.key === "Enter") {
        console.log(searchWord);
        resultsImages.innerHTML = "";
        searchImgs(`https://api.pexels.com/v1/search?query=${searchWord}&per_page=${perPage}`);
    }
});
function searchImgs(searchApi) {
    try {
        fetch(searchApi, {
            headers: { "Authorization": apiKey }
        }).then((res) => res.json())
            .then((data) => {
                displayImgs(data);
            });
    } catch (error) {
        console.log(error);
        alert("読み込みに失敗しました。");
    }
}

// 画像表示
function displayImgs(data) {
    for (let i = 0; i < perPage; i++) {
        resultsImages.innerHTML += `
       <li class="results-card">
         <img src="${data.photos[i].src.large}">
          <div class="results-details">
             <div class="artist">
               <i class="fa-solid fa-camera"></i>
               <span>${data.photos[i].photographer}</span>
             </div>
             <button>
               <i class="fa-solid fa-cloud-arrow-down"></i>
             </button>
           </div>
     </li>
     `;
    }
}

//  画像読み込み
moreBtn.addEventListener("click", () => {
    page++;
    if (searchWord) {
        apiUrl = `https://api.pexels.com/v1/search?query=${searchWord}&per_page=${perPage}`;
    } else {
        apiUrl = `https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`;
    }
    setImgs(apiUrl);
});

// 画像の詳細表示
resultsImages.addEventListener("click", (e) => {
    detailImgs(e.target.currentSrc);
});
function detailImgs(imgUrl) {
    previewImg.src = imgUrl;
    modal.classList.add("show");
    downloadBtn.setAttribute("data-image", imgUrl);
    downloadBtn.addEventListener("click", (e) => {
        downloadImg(e);
    })
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

// 画像ダウンロード
function downloadImg(dlUrl) {
    const data = dlUrl.target.dataset.image;
    fetch(data).then((res) => res.blob())
        .then((data) => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(data);
            a.download = "img";
            a.click();
        });
}

// 非同期処理
function setImgs(prevApi) {
    try {
        fetch(prevApi, {
            headers: { "Authorization": apiKey }
        }).then((res) => res.json())
            .then((data) => {
                displayImgs(data);
            });
    } catch (error) {
        console.log(error);
        alert("読み込みに失敗しました。");
    }
}
setImgs(`https://api.pexels.com/v1/curated?page=${page}&per_page=${perPage}`);
