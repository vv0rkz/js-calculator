#!/usr/bin/env node
import { readFileSync, existsSync } from "fs"
import { execSync } from "child_process"

// Читаем текущую версию
const packageJson = JSON.parse(readFileSync("package.json", "utf8"))
const [major, minor, patch] = packageJson.version.split(".").map(Number)

// Анализируем коммиты чтобы определить тип версии
const commitMessages = execSync("git log --oneline -10", { encoding: "utf8" })

let nextVersion
if (commitMessages.includes("feat:")) {
    nextVersion = `v${major}.${minor + 1}.0` // minor release
} else {
    nextVersion = `v${major}.${minor}.${patch + 1}` // patch release
}

console.log(`📦 Предполагаемая следующая версия: ${nextVersion}`)

// Проверяем демо
const hasDemo = existsSync(`docs/${nextVersion}.gif`) || existsSync(`docs/${nextVersion}.png`)

if (!hasDemo) {
    console.log(`❌ Релиз ${nextVersion} требует демо!`)
    console.log(`📸 Создай: docs/${nextVersion}.gif`)
    process.exit(1)
}

console.log(`✅ Демо для ${nextVersion} готово!`)
