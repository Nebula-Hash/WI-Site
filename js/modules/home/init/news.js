// 新闻模块初始化
export function initNews() {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  // API 接口
  const newsMainUrl = "https://119.45.252.203/zzu/info/get/newBigPhoto.php";
  const newsListUrl = "https://119.45.252.203/zzu/info/get/new.php";

  // Promise.all 同时请求两个接口
  Promise.all([
    fetch(newsMainUrl).then(res => {
      if (!res.ok) throw new Error("主新闻请求失败");
      return res.json();
    }),
    fetch(newsListUrl).then(res => {
      if (!res.ok) throw new Error("新闻列表请求失败");
      return res.json();
    })
  ])
    .then(([mainData, listData]) => {
      renderNews(mainData, listData);
    })
    .catch((err) => {
      console.error(err);
      container.innerHTML = `<p style="text-align:center;color:#999;">加载新闻失败，请稍后再试。</p>`;
    });

  // 动态渲染
  function renderNews(mainData, listData) {
    const main = mainData.news[0] || {};
    const list = listData.news || [];

    // const mainHTML = `
    //         <div class="news__main">
    //             <a href="#" class="news__main-link" data-page="/detail" data-type="new" data-id="${main.id}">
    //                 <img src="${main.imgUrl}" alt="${main.title}">
    //                 <div class="news__main-text">
    //                     <h3>${main.title}</h3>
    //                     <p>${main.text}</p>
    //                 </div>
    //             </a>
    //         </div>
    //     `;
    const mainHTML = `
            <div class="news__main">
                <a class="news__main-link" >
                    <img src="${main.imgUrl}" alt="${main.title}">
                    <div class="news__main-text">
                        <h3>${main.title}</h3>
                        <p>${main.text}</p>
                    </div>
                </a>
            </div>
        `;

    const listHTML = `
            <div class="news__list">
                ${list.map(item => `
                    <a href="#" class="news__item" data-page="/detail" data-type="new" data-id="${item.id}">
                        <div class="news__info">
                            <h4>${item.title}</h4>
                            <span class="news__date">${item.time}</span>
                        </div>
                        <img src="${item.imgUrl}" alt="${item.title}">
                    </a>
                `).join("")}
            </div>
        `;

    container.innerHTML = mainHTML + listHTML;
  }
}
