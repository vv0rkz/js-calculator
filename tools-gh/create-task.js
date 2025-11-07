#!/usr/bin/env node
import { execSync } from "child_process"

const args = process.argv.slice(2)
const title = args.join(" ")

if (!title) {
    console.log('Usage: npm run task -- "описание задачи"')
    process.exit(1)
}

try {
    // Создаем issue с лейблом task
    console.log("📝 Создаю задачу...")
    execSync(`gh issue create --title "Task: ${title}" --body "Задача: ${title}" --label "task"`, {
        stdio: "inherit",
    })

    console.log("✅ Задача создана! Используй номер в коммитах: feat: #номер описание")
} catch (error) {
    console.log("❌ Ошибка:", error.message)
}
