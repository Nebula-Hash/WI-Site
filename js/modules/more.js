// 加载更多页数据
export async function loadMoreData({ type }) {
    const moreContainer = document.getElementById('more-content');
    if (!type) {
        moreContainer.innerHTML = '<p>无效的请求</p>';
        return;
    }

    try {
        const url = `https://119.45.252.203/zzu/info/get/list.php?type=${type}`;
        const response = await fetch(url);
        const data = await response.json();

        // 调试
        console.log("请求的 URL：", url);
        console.log("更多页数据：", data);

        // 校验返回数据
        if (data.status !== 'success' || !Array.isArray(data.data)) {
            moreContainer.innerHTML = '<p>暂无数据可显示</p>';
            return;
        }

        // 生成内容列表
        const items = data.data;

        const itemsHTML = items
            .map(item => `
                <a href="#" class="more-item" data-page="/detail" data-type="${type}" data-id="${item.id}">
                    <div class="more-item-title">${item.title}</div>
                    <span class="more-arrow">➜</span>
                </a>
            `)
            .join('');

        moreContainer.innerHTML = itemsHTML;


    } catch (err) {
        moreContainer.innerHTML = `<p style="color:red;">加载详情失败：${err}</p>`;
    }
}