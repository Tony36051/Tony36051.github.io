// scripts/postinstall.js
//
// patch-package 用于兼容 Node.js 22+ 移除的 SlowBuffer：
// hexo-related-popular-posts 间接依赖的 buffer-equal-constant-time@1.0.1
// 直接访问了 Node.js v22 起被移除的 SlowBuffer.prototype，导致本地
// node v25 构建报错 Cannot read properties of undefined。
//
// CI（GitHub Actions, node 20）的 SlowBuffer 仍存在，无需该 patch；
// 且 patch-package 在 CI 环境运行会触发 npm "Exit handler never called"
// 崩溃（npm 已知 bug），因此仅当 Node 主版本 >= 22 时才运行 patch-package。
const { spawnSync } = require("child_process");

const major = Number(process.versions.node.split(".")[0]);

if (major >= 22) {
  try {
    // shell:true 让 Windows 用 cmd / Linux 用 sh 解析 npx(npx.cmd)
    const r = spawnSync("npx patch-package", { stdio: "inherit", shell: true });
    if (r.status === 0) {
      console.log("[postinstall] patch-package applied");
    } else {
      console.warn(`[postinstall] patch-package exited ${r.status}, skipping`);
    }
  } catch (e) {
    // patch 应用失败不阻断安装（本地可手动 `npx patch-package` 重试）
    console.warn("[postinstall] patch-package failed, skipping:", e.message);
  }
} else {
  console.log(
    `[postinstall] Node ${major} < 22, skip patch-package (SlowBuffer exists)`,
  );
}
