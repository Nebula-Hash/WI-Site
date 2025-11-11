// 加载详情页数据
export async function loadDetailData({ type, id }) {
    const detailContainer = document.getElementById('detail-content');
    if (!type || !id) {
        detailContainer.innerHTML = '<p>无效的详情请求</p>';
        return;
    }

    try {
        const url = `https://119.45.252.203/zzu/info/get/article.php?type=${type}&id=${id}`;
        const response = await fetch(url);
        const data = await response.json();

        // 调试
        console.log("请求的 URL：", url);
        console.log("详情页数据：", data);

        // 动态填充详情内容
        const resp = data.data;

        document.getElementById('detail-title').textContent = resp.title || '无标题';
        document.getElementById('detail-time').textContent = resp.time || '';
        document.getElementById('detail-content').innerHTML = resp.text || '';
    } catch (err) {
        detailContainer.innerHTML = `<p style="color:red;">加载详情失败：${err}</p>`;
    }
}