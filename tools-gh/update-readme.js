#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "fs"
import { execSync } from "child_process"

console.log("🎨 Обновляю README значимыми релизами...")

const changelog = readFileSync("CHANGELOG.md", "utf8")
const originalReadme = readFileSync("README.md", "utf8")
let readme = originalReadme

// Парсим changelog и находим только версии с фичами
const versionBlocks = changelog.split("## v").slice(1)
let prettyChangelog = "## 📋 История версий\n\n"

versionBlocks.forEach((versionBlock) => {
    const versionMatch = versionBlock.match(/^(\d+\.\d+\.\d+)/)
    if (!versionMatch) return

    const version = `v${versionMatch[1]}`

    // Пропускаем если нет раздела "Фичи"
    if (!versionBlock.includes("### ✨ Фичи")) {
        console.log(`⏭️ Пропускаем ${version} - нет фич`)
        return
    }

    // Извлекаем только фичи (первые 3)
    const features = []
    const lines = versionBlock.split("\n")
    let inFeaturesSection = false

    for (const line of lines) {
        if (line.includes("### ✨ Фичи")) {
            inFeaturesSection = true
            continue
        }
        if (inFeaturesSection && line.includes("### ")) {
            break
        }
        if (inFeaturesSection && line.trim().startsWith("-") && features.length < 3) {
            const cleanFeature = line
                .replace(/^- /, "")
                .replace(/\(\[#\d+\]\([^)]+\)\)/g, "")
                .replace(/\[#\d+\]\([^)]+\)/g, "")
                .replace(/#\d+\s*/, "")
                .trim()

            if (cleanFeature && !cleanFeature.toLowerCase().includes("тест")) {
                features.push(cleanFeature)
            }
        }
    }

    if (features.length === 0) {
        console.log(`⏭️ Пропускаем ${version} - нет чистых фич`)
        return
    }

    console.log(`✅ Добавляем ${version} с ${features.length} фичами`)

    // Форматируем версию
    prettyChangelog += `### 🟢 ${version}\n\n`

    // Добавляем демо если есть
    if (existsSync(`docs/${version}.gif`)) {
        prettyChangelog += `**Демо работы**  \n<img src="docs/${version}.gif" width="400" />\n\n`
    } else if (existsSync(`docs/${version}.png`)) {
        prettyChangelog += `**Демо работы**  \n<img src="docs/${version}.png" width="400" />\n\n`
    }

    // Добавляем функционал
    prettyChangelog += `**Функционал:**\n`
    features.forEach((feature) => {
        prettyChangelog += `- ${feature}\n`
    })

    prettyChangelog += `\n**Релиз:** https://github.com/ione-chebkn/js-calculator/releases/tag/${version}\n\n---\n\n`
})

// Проверяем что есть что вставлять
if (!prettyChangelog.includes("### 🟢")) {
    console.log("❌ Не найдено версий с фичами для README")
    process.exit(1)
}

// Заменяем секцию в README
if (readme.includes("## 📋 История версий")) {
    const before = readme.split("## 📋 История версий")[0]
    let after = readme.split("## 📋 История версий")[1] || ""

    // Находим следующий заголовок
    const nextSection = after.match(/\n## [^\n]/)
    if (nextSection) {
        after = after.substring(after.indexOf(nextSection[0]))
    } else {
        after = ""
    }

    readme = before + prettyChangelog + after
} else {
    readme = readme.replace("---", `---\n\n${prettyChangelog}`)
}

// Сохраняем
writeFileSync("README.md", readme)

// ПРОВЕРКА: читаем обновлённый файл
const updatedReadme = readFileSync("README.md", "utf8")
console.log(`📊 Обновлённый README: ${updatedReadme.length} символов`)

// КРИТИЧЕСКИЕ ПРОВЕРКИ
if (updatedReadme.length === 0) {
    console.log("❌ ОШИБКА: README пустой после обновления!")
    process.exit(1)
}

if (updatedReadme.length < originalReadme.length - 100) {
    console.log("❌ ОШИБКА: README стал значительно короче!")
    console.log(`   Было: ${originalReadme.length}, стало: ${updatedReadme.length}`)
    process.exit(1)
}

if (!updatedReadme.includes("### 🟢")) {
    console.log("❌ ОШИБКА: В README нет секций с версиями!")
    process.exit(1)
}

console.log("✅ README успешно обновлён и проверен!")
