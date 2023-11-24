const api = "https://openapi.programming-hero.com/api/videos/category/";
const videosContainer = document.querySelector(".videosContainer");
const noVideoContainer = document.querySelector(".noVideo");
const sortByViewButton = document.getElementById("sort-by-view");

// by default load category
let currentCategoryId = "1000";

const loadData = (id) => {
  try {
    videosContainer.innerHTML = "";
    noVideoContainer.innerHTML = "";

    fetch(api + id)
      .then((res) => res.json())
      .then((data) => {
        const videos = data?.data;

        if (!videos || videos.length === 0) {
          const noContent = document.createElement("div");
          noContent.innerHTML = `<div class="no-content">
        <img src="./resource/Icon.png" alt="no content">
          <h1>OOPS!!, Sorry,There is No content here</h1>
          </div>`;
          noVideoContainer.appendChild(noContent);
        } else {
          if (sortByViewButton.classList.contains("active")) {
            sortAndDisplayVideos(videos);
          } else {
            displayVideos(videos);
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
};

const sortAndDisplayVideos = (videos) => {
  const sortedVideos = videos.slice().sort((a, b) => {
    const viewA = parseFloat(a?.others?.views.replace(/[^\d.]/g, ""));
    const viewB = parseFloat(b?.others?.views.replace(/[^\d.]/g, ""));
    return viewB - viewA;
  });

  displayVideos(sortedVideos);
};

// Display content
const displayVideos = (videos) => {
  videos.forEach((video) => {
    const singleVideo = document.createElement("div");
    const verifiedIcon = video?.authors[0]?.verified
      ? '<i style="font-size:24px" class="fa">&#xf058;</i>'
      : "";
    const timestamp = video?.others?.posted_date;

    // const secondsInWeek = 7 * 24 * 60 * 60;
    // const secondsInDay = 24 * 60 * 60;
    const secondsInHour = 60 * 60;
    const secondsInMinute = 60;

    let remainingSeconds = timestamp;

    // const weeks = Math.floor(remainingSeconds / secondsInWeek);
    // remainingSeconds %= secondsInWeek;

    // const days = Math.floor(remainingSeconds / secondsInDay);
    // remainingSeconds %= secondsInDay;

    const hours = Math.floor(remainingSeconds / secondsInHour);
    remainingSeconds %= secondsInHour;

    const minutes = Math.floor(remainingSeconds / secondsInMinute);
    singleVideo.classList.add("singleVideo");
    singleVideo.innerHTML = `
              <div class="thumbNail">
                <img src="${video?.thumbnail}" alt="Thumbnail">
              </div>
              <div class="author">
                <div class="authorProfile">
                    <img src="${
                      video?.authors[0].profile_picture
                    }" alt="Author Profile">
                    <div class="time">${
                      video?.others?.posted_date
                        ? hours + " hrs " + minutes + " mins " + " ago"
                        : ""
                    }</div>
                </div>
                <div class="details">
                  <h1>${video?.title}</h1>
                  <div class="verify">
                    <span>${video?.authors[0]?.profile_name}</span>
                    <span>${verifiedIcon}</span>
                  </div>
                  <p>${video?.others?.views} views</p>
                </div>
              </div>
            `;
    videosContainer.appendChild(singleVideo);
  });
};
// Display Category tab
const categoriesContainer = document.querySelector(".categories");
const loadCategories = () => {
  try {
    fetch(`https://openapi.programming-hero.com/api/videos/categories`)
      .then((res) => res.json())
      .then((categories) => {
        const cats = categories.data;
        cats.forEach((cat) => {
          const button = document.createElement("button");
          button.classList.add("tab-item", "btn");
          button.textContent = cat.category;
          button.addEventListener("click", () => {
            const allButtons = document.querySelectorAll(".tab-item.btn");
            allButtons.forEach((btn) => {
              btn.classList.remove("active");
            });
            button.classList.add("active");
            loadData(cat.category_id);
          });
          categoriesContainer.appendChild(button);
          if (cat.category_id === "1000") {
            button.classList.add("active");
            loadData(cat.category_id);
          }
        });
      });
  } catch (error) {
    console.log(error);
  }
};
// sort button
sortByViewButton.addEventListener("click", () => {
  if (sortByViewButton.classList.contains("active")) {
    sortByViewButton.classList.remove("active");
  } else {
    sortByViewButton.classList.add("active");
  }
  loadData(currentCategoryId);
});
loadCategories();
loadData(currentCategoryId);
