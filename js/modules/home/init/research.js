// 教学科研模块初始化
export function initResearch() {
    const container = document.getElementById("researchContainer");
    if (!container) return;

    const researchUrl = "https://119.45.252.203/zzu/info/get/Teaching.php";

    // 获取数据
    fetch(researchUrl)
        .then(res => {
            if (!res.ok) throw new Error("教学科研请求失败");
            return res.json();
        })
        .then(data => {
            if (data.status !== "success" || !data.news) {
                throw new Error("数据格式错误");
            }
            renderResearch(data.news);
        })
        .catch(err => {
            console.error("教学科研模块加载失败：", err);
            container.innerHTML = `<p style="text-align:center;color:#999;">加载教学科研内容失败，请稍后再试。</p>`;
        });

    // 渲染函数
    function renderResearch(items) {
        if (items.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:#999;">暂无教学科研内容。</p>`;
            return;
        }

        // 前两个为图片展示卡片
        const imgCards = items.slice(0, 2).map(item => `
            <a href="#" 
               class="research-img-card" 
               data-page="/detail"
               data-type="research"
               data-id="${item.id}">
                <img src="${item.imgUrl}" alt="${item.title}" />
                <div class="research-content">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            </a>
        `).join("");

        // 后四个为文字卡片
        const textCards = items.slice(2).map(item => `
            <a href="#" 
               class="text-card"
               data-page="/detail"
               data-type="research"
               data-id="${item.id}">
                <div class="research-content">
                    <h3>${item.title}</h3>
                    <p>${item.text}</p>
                </div>
            </a>
        `).join("");

        // 合并结构（图片展示 + 文字展示）
        container.innerHTML = `
            ${imgCards}
            <div class="research-text-card">
                ${textCards}
            </div>
        `;
    }
}
