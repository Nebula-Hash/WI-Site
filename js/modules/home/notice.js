// 通知公告模块初始化
export function initNotice() {
    const container = document.getElementById("noticeContainer");
    if (!container) return;

    const noticeUrl = "https://119.45.252.203/zzu/info/get/notices.php";

    // 获取数据
    fetch(noticeUrl)
        .then(res => {
            if (!res.ok) throw new Error("通知请求失败");
            return res.json();
        })
        .then(data => {
            renderNotices(data.news);
        })
        .catch(err => {
            console.error(err);
            container.innerHTML = `<p style="text-align:center;color:#999;">加载通知失败，请稍后再试。</p>`;
        });

    // 渲染函数
    function renderNotices(notices) {
        if (notices.length === 0) {
            container.innerHTML = `<p style="text-align:center;color:#999;">暂无通知公告。</p>`;
            return;
        }

        const html = notices.map(item => `
      <a href="#" class="notice-card" data-page="/detail" data-type="notices" data-id="${item.id}">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <div class="notice-date">${item.time}</div>
      </a>
    `).join("");

        container.innerHTML = html;
    }
}
