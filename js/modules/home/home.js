export async function initHome() {
    import("./init/banner.js").then(m => m.initBanner());
    import("./init/news.js").then(m => m.initNews());
    import("./init/notice.js").then(m => m.initNotice());
    import("./init/research.js").then(m => m.initResearch());
    import("./init/cooperation.js").then(m => m.initCooperation());
}
