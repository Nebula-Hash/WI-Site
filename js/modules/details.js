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
        const resp = data?.data;

        // 校验返回数据
        if (!resp) {
            detailContainer.innerHTML = '<p>未找到详情内容</p>';
            return;
        }

        // ======== 内容预处理 ========
        let rawText = resp.text || "";

        // 1) decode HTML entities（防止 \u003Cimg 之类的编码）
        rawText = rawText
            .replace(/\\u003C/g, "<")
            .replace(/\\u003E/g, ">")
            .replace(/\\n/g, "\n"); // 进一步确保换行被识别

        // 2) 按换行拆分为段落（不会拆 img 标签）
        let paragraphs = rawText
            .split(/\n+/)        // 1 个或多个换行都视为新的段落
            .map(p => p.trim())
            .filter(p => p.length > 0);

        // 3) 包装成 <p>（如果是 img 标签则保留原样）
        rawText = paragraphs
            .map(block => {
                // 若本段是图片或已有 HTML 结构，则不包裹 <p>
                if (/^<img/i.test(block) || /^<.+>/.test(block)) {
                    return block;
                }
                return `<p>${block}</p>`;
            })
            .join("\n");


        // ======== 动态挂载 ========
        document.getElementById('detail-title').textContent = resp.title || '无标题';
        document.getElementById('detail-time').textContent = resp.time || '';

        // 支持富文本（含 img）
        detailContainer.innerHTML = rawText;
    } catch (err) {
        detailContainer.innerHTML = `<p style="color:red;">加载详情失败：${err}</p>`;
    }
}