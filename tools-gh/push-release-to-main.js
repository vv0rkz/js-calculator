#!/usr/bin/env node
const { execSync } = require("child_process")
const packageJson = require("../package.json")

const version = packageJson.version
const releaseBranch = `v${version}`

console.log(`🚀 Завершение релиза v${version}...`)

try {
    // 1. Проверяем, что мы в релизной ветке
    const currentBranch = execSync("git branch --show-current").toString().trim()
    if (currentBranch !== releaseBranch) {
        console.error(`❌ Текущая ветка: ${currentBranch}. Должна быть: ${releaseBranch}`)
        process.exit(1)
    }

    // 2. Мерджим в main
    console.log(`🔀 Мерджим ${releaseBranch} в main...`)
    execSync("git checkout main", { stdio: "inherit" })
    execSync(`git merge ${releaseBranch} --no-ff -m "Release v${version}"`, { stdio: "inherit" })

    // 3. Пушим всё
    console.log("📤 Пушим изменения...")
    execSync("git push origin main", { stdio: "inherit" })
    execSync("git push --tags", { stdio: "inherit" })

    console.log(`✅ Релиз v${version} завершён!`)
    console.log(`🌐 GitHub: https://github.com/doechon/js-calculator/releases/tag/v${version}`)
} catch (error) {
    console.error("❌ Ошибка при завершении релиза:", error.message)
    process.exit(1)
}
