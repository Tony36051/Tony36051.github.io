---
title: AGENTS.md
date: 2026-09-07
tags:
- AI
- Agent
---

我的 AGENTS.md 文件的内容，按需自取。

<!--more-->

# AGENTS.md

## From andrej-karpathy

```md
# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.
```

## add 语言描述

```md
# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 5. Using language
- **思考过程语言**：无论用户使用何种语言提问，在进行深度思考、逻辑推理、任务拆解（即 `<thinking>` 或思维链部分）时，**必须全程使用简体中文**进行内部推导与规划。
- **回复语言**：最终呈现给用户的分析、解释、命令确认以及进度说明，均使用简体中文。
- **代码与注释**：代码中的变量名、函数名保持地道的英文命名；关键代码注释、Commit Message 等视项目规范编写，默认使用中文或英文。
- 所有文件的读取、写入、提交等操作必须统一使用 UTF-8 编码
- 批量处理、脚本生成等自动化流程同样保持 UTF-8 输出

## Git Commit & Checkpoint Policy

### 1. 触发提交的时机（When to Commit）
在完成一个逻辑相对完整、具备独立可运行性的改动后，必须主动执行 `git commit` 作为安全检查点（Checkpoint）。典型触发场景包括：
- 完成了一个独立功能模块（Feature）或一个明确的子任务。
- 修复了一个独立的 Bug，且相关单元测试/功能验证已通过。
- 完成了一次跨多文件的重构（Refactoring），且构建/测试无报错。
- **不要**等用户显式催促才提交，但**严禁**在代码处于未完成、语法错误或破坏构建的断点状态下盲目提交。

### 2. 提交前的自检步骤（Pre-commit Verification）
执行 `git commit` 前，必须按顺序执行以下验证（如果有对应脚本）：
1. 运行项目 Lint / Format 检查，确保代码风格合规。
2. 运行相关测试或构建命令（如 `npm test`、`cargo test`、`pytest` 等），确认改动没有引入回归错误。
3. 执行 `git status` 与 `git diff`，仔细确认本次暂存的文件仅包含本次任务所需的改动，剔除无关的临时文件或日志。

### 3. Commit 规范
- 使用语义化提交格式（Conventional Commits），例如：
  - `feat(auth): implement jwt token verification`
  - `fix(parser): handle empty markdown tags edge case`
  - `refactor(db): migrate connection pool to async client`
- 仅暂存本次相关的修改文件（优先指定具体文件，慎用全量 `git add .`）。
- 提交信息的描述应精准反映本次阶段性修改的核心内容，方便后续排查与 `git reset / revert` 回退。

### 4. 边界与红线（Strict Constraints）
- ❌ **严禁执行 `git push`**：除非用户明确下达了 push 指令，否则所有 commit 仅保留在本地。
- ❌ **严禁使用破坏性命令**：严禁未经用户许可运行 `git reset --hard`、`git clean -f`、`git checkout -f` 或直接修改既有提交历史（如 `git rebase` / `git commit --amend`）。
- ❌ **严禁跳过 Hooks**：严禁添加 `--no-verify` 绕过项目的 pre-commit hooks。
```


## 再叠加windows使用、git提交

```
# AGENTS.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.
**Priority:** Project-specific instructions (e.g., `.cursorrules`, `CONTRIBUTING.md`, project-level `AGENTS.md`) **always override** this global file when conflicts arise.

---

## 0. Language Policy

- **思考过程语言**：无论用户使用何种语言提问，在进行深度思考、逻辑推理、任务拆解（即内部思维链 / reasoning trace）时，默认使用简体中文进行内部推导与规划。
  - 例外：涉及复杂算法推导、底层调试、报错信息本身为英文等场景，允许中英夹杂或切换为英文推理，以保证推理质量优先于语言一致性。
  - 注意：并非所有 agent 工具都暴露可被 system prompt 直接控制的推理通道，本条仅在 agent 支持可控推理语言时生效。
- **回复语言**：默认使用简体中文回复，无论用户使用何种语言提问。若用户明确要求以其提问语言（如英文）回复，或项目协作者要求跟随提问语言，则以该要求为准。
- **代码与注释**：变量名、函数名保持地道英文命名；关键代码注释、Commit Message 按项目规范编写，默认中文，无规范时可用英文。
- **编码**：所有文件的读取、写入、提交等操作统一使用 UTF-8 编码；批量处理、脚本生成等自动化流程同样保持 UTF-8 输出。

---

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

This applies during execution too: if a goal-driven loop (see Section 4) surfaces a **new directional ambiguity** (not just an implementation detail), pause the loop and clarify before continuing. Routine implementation choices within an already-clear goal do not require interruption.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

**No unverified success claims.** Never state that tests pass, a build succeeds, or a bug is fixed unless you have actually executed the corresponding command and observed its output in this session. "Should work" and "passed" are not interchangeable — only report the latter if you ran it.

**Two distinct loops, two distinct limits — do not conflate them:**

- **Verify-fix loop** (this section): implement → run check → fix → re-run, until the stated success criteria are met. Weak criteria ("make it work") require clarification instead of looping. If this loop does not converge within a reasonable number of attempts, stop and report what was tried, rather than continuing indefinitely.
- **Pre-commit retry loop** (see Git Policy §2): capped at 3 attempts, specifically for lint/test/build failures blocking a commit. Reaching this cap means *stop and report*, not "try something else automatically."

The pre-commit cap does not extend to the broader verify-fix loop, and vice versa — a stuck verify-fix loop should surface to the user well before silently retrying forever.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## 5. Git Commit & Checkpoint Policy

### 5.1 触发提交的时机（When to Commit）

Git Commit 是面向人类的**持久化安全锚点**，核心目的是为后续可能的 `git revert/reset` 提供**最小粒度的、确定可用的回退基线**。必须在完成一个**原子化的逻辑单元**后主动执行：

- ✅ 完成了一个独立功能模块（Feature）或一个明确的子任务。
- ✅ 修复了一个独立的 Bug，且相关单元测试/功能验证已通过（且验证是真实执行过的，见第 4 节）。
- ✅ 完成了一次跨多文件的重构（Refactoring），且构建/测试无报错。
- ⚠️ **粒度控制**：单个 commit 应聚焦于单一职责。若改动跨越多个不相关的业务域，或 diff 规模显著超出当前任务的合理范围，必须拆分为多个逻辑独立的 commit，避免回退时误伤无关代码。
- 💡 **试错隔离**：在探索性编码阶段，优先使用 Agent 原生 Checkpoint / 临时分支进行试错。**仅当代码达到稳定、可验证状态时，才沉淀为正式的 Git Commit**。
- ❌ **不要**等用户显式催促才提交，但**严禁**在代码处于未完成、语法错误或破坏构建的断点状态下盲目提交。

### 5.2 提交前的自检步骤（Pre-commit Verification）

执行 `git commit` 前，必须按顺序执行以下验证（如果有对应脚本/工具）：

1. 运行项目 Lint / Format 检查，确保代码风格合规。
2. 运行相关测试或构建命令（如 `npm test`、`cargo test`、`pytest` 等），确认改动没有引入回归错误。
3. 扫描本次暂存的 diff，确认不包含密钥、Token、API Key、`.env` 等敏感信息或凭证；如发现，立即从暂存区移除并提醒用户检查是否已泄露。
4. 执行 `git status` 与 `git diff`，仔细确认本次暂存的文件仅包含本次任务所需的改动，剔除无关的临时文件或日志。
5. **⛔ 自检失败处理**：若上述任一检查未通过，**禁止提交**。Agent 可自动尝试修复并重试最多 **3 次**（见第 4 节"两种循环"的区分）；若仍失败（或项目无自动化验证手段时），必须**立即暂停并向用户报告具体错误信息与已尝试的修复方案**，等待人工介入，严禁静默跳过或强行提交。

### 5.3 Commit 规范

- 使用语义化提交格式（Conventional Commits），例如：
  - `feat(auth): implement jwt token verification`
  - `fix(parser): handle empty markdown tags edge case`
  - `refactor(db): migrate connection pool to async client`
- **Body 补充（推荐）**：对于涉及多文件或架构调整的 commit，应在 body 中简要说明**"变更影响范围"**和**"已通过的验证方式"**，以降低未来回退时的评估成本。
- 仅暂存本次相关的修改文件（优先指定具体文件路径，默认禁用全量 `git add .`）。
- 提交信息的描述应精准反映本次阶段性修改的核心内容，方便后续排查与 `git reset / revert` 回退。

### 5.4 分支策略（Branch Policy）

- 默认在用户明确指定或当前所在的分支上操作，**不擅自创建、切换或删除分支**。
- 如任务规模较大、需要隔离试错，可在征得用户同意后创建临时特性分支（如 `feature/xxx`），并在报告中说明分支名与用途。
- 严禁在未告知用户的情况下切换到与用户预期不同的分支进行提交。

### 5.5 边界与红线（Strict Constraints）

- ❌ **严禁执行 `git push`**：除非用户明确下达了 push 指令，否则所有 commit 仅保留在本地。
- ❌ **严禁使用破坏性命令**：严禁未经用户许可运行 `git reset --hard`、`git clean -f`、`git checkout -f` 或直接修改既有提交历史（如 `git rebase` / `git commit --amend`）。
- ❌ **严禁跳过 Hooks**：严禁添加 `--no-verify` 绕过项目的 pre-commit hooks。
- ❌ **严禁无限重试**：自检失败时不得陷入无限制的"修复-测试"循环，必须遵守第 5.2 节中的重试上限。
- ❌ **严禁未经验证即报告成功**：适用第 4 节"无未验证成功声明"条款，Git 提交场景同样适用。

## 6. 禁止在生成的 Python/JS 脚本中硬编码 MSYS 风格路径

**背景**：本机通过 Git Bash 运行，你在 shell 中看到的路径是 MSYS 格式
（如 `/d/git/xx`）。这个格式只有 bash 自己认识，Python、Node 等原生
Windows 程序会将其当作 Linux 根目录下的路径去查找，导致
`FileNotFoundError`。

**规则**：无论任务描述、当前工作目录、还是你自己 `pwd`/`ls` 得到的路径
是什么格式，在生成的 .py / .js 等脚本文件内部写路径时，必须遵守：

1. **优先使用相对路径**，基于脚本自身位置推导：
```python
   from pathlib import Path
   BASE_DIR = Path(__file__).resolve().parent
   data_path = BASE_DIR / "data" / "input.csv"
```

2. **确实需要绝对路径时**，一律转换为 Windows 正斜杠格式（不要用反斜杠，
   避免转义问题），例如写 `D:/git/xx/data.csv`，**禁止**写
   `/d/git/xx/data.csv`。

3. **写代码前自查**：如果发现自己准备写入的路径字符串以 `/` + 单个字母
   + `/` 开头（如 `/d/`、`/c/`），这就是 MSYS 格式，必须先转换再写入
   脚本，不能直接抄。

❌ 错误示例（会在脚本内部报错）：
```python
df = pd.read_csv("/d/git/xx/data.csv")
```

✅ 正确示例：
```python
df = pd.read_csv("D:/git/xx/data.csv")
# 或更好：
df = pd.read_csv(Path(__file__).resolve().parent / "data.csv")
```
```