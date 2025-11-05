const calcBtn = document.querySelectorAll(".calc-item")
const result = document.getElementById("result")

const EMPTY_VAL = "0"
const updateRes = (val) => {
    let result = document.getElementById("result")

    if (val === "=" || val === "Enter") {
        result.textContent = eval(result.textContent)
    } else if (val === "RM") {
        result.textContent = EMPTY_VAL
    } else if (val === "⌫" || val === "Backspace") {
        if (result.textContent && result.textContent !== "0") {
            result.textContent = result.textContent.slice(0, -1)
        } else {
            result.textContent = EMPTY_VAL
        }
    } else {
        result.textContent += val
    }
}

for (let btn of calcBtn) {
    btn.addEventListener("click", function () {
        const val = this.textContent
        updateRes(val)
    })
}

document.addEventListener("keydown", function (event) {
    const val = event.key
    console.log(val)
    if (!isNaN(val) || ["+", "-", "*", "/", "Enter", "Backspace"].includes(val)) {
        updateRes(val)
    }
})
