// 合作交流模块初始化
export function initCooperation() {
    const container = document.getElementById("cooperationContainer");
    if (!container) return;

    const coopUrl = "https://119.45.252.203/zzu/info/get/cooperation.php";


    // 获取数据
    fetch(coopUrl)
        .then(res => {
            if (!res.ok) throw new Error("合作交流请求失败");
            return res.json();
        })
        .then(data => {
            if (data.status !== "success" || !data.news) {
                throw new Error("数据格式错误");
            }
            renderCooperation(data.news);
        })
        .catch(err => {
            console.error("合作交流模块加载失败：", err);
            container.innerHTML = `<p style="text-align:center;color:#999;">加载合作交流失败，请稍后再试。</p>`;
        });

    // 渲染函数
    function renderCooperation(items) {
        if (items.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:#999;">暂无合作交流。</p>`;
            return;
        }

        const html = items.map(item => {
            return `
                <a href="#" 
                   class="cooperation-item"
                   data-page="/detail"
                   data-type="cooperation"
                   data-id="${item.id}">
                    <div class="cooperation-date">
                        <div class="date-number">${item.day}</div>
                        <div class="date-month">${item.year}</div>
                    </div>
                    <div class="cooperation-content">
                        <p>${item.title}</p>
                    </div>
                </a>
            `;
        }).join("");

        container.innerHTML = html;
    }
}
