class ToDo {
    constructor() {
        this.listEl = document.getElementById("todo-list")
        this.searchEl = document.getElementById("input-text")
        this.tasks = []
        this.term = ""  //wyszukiwany termins
        this.loadFromLocalStorage()
        this.bindEvents()
    }

    //Ustawia wszystkie zdarzenia dla przycisków, listy i wyszukiwarki
    bindEvents() {
        document.getElementById("todo-save").addEventListener("click", () => this.taskAdd())
        this.listEl.addEventListener("click", (e) => this.handleListClick(e))
        this.searchEl.addEventListener("input", () => {
            this.term = this.searchEl.value.toLowerCase()
            this.draw()
        })
        document.addEventListener("click", (e) => this.handleOutsideClick(e))
    }

    //Dodaje nowe zadanie i aktualizuje listę
    taskAdd() {
        const text = document.getElementById("todo-add").value.trim()
        const date = document.getElementById("todo-data").value

        if (text.length < 3 || text.length > 255) {
            alert("Tekst musi mieć od 3 do 255 znaków!")
            return
        }

        if (date) {
            const inputDate = new Date(date)
            const today = new Date()
            today.setHours(0,0,0,0)
            if (inputDate <= today) {
                alert("Data musi być w przyszłości!")
                return
            }
        }

        this.tasks.push({ text, date })
        this.draw()
        this.saveToLocalStorage()
        document.getElementById("todo-add").value = ""
        document.getElementById("todo-data").value = ""
    }

    //Getter zwracający tylko zadania pasujące do term
    getFilteredTasks() {
        if (this.term.length < 2) return this.tasks
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term))
    }

    draw() {
        this.listEl.innerHTML = ""
        this.getFilteredTasks().forEach((task, index) => {
            let textHTML = task.text
            if (this.term.length >= 2) {
                const regex = new RegExp(`(${this.term})`, "gi")
                textHTML = task.text.replace(regex, "<mark>$1</mark>")
            }

            let dateHTML = ""
            if (task.date) {
                dateHTML = `<span class="todo-date">${task.date}</span>`
            }

            const li = document.createElement("li")
            li.dataset.index = index
            li.innerHTML = `<span class="todo-text">${textHTML}</span> ${dateHTML} 
            <button class="todo-trash">🗑️</button>`
            this.listEl.appendChild(li)
        })
    }

    //Obsługuje kliknięcia na li: edycję lub usuwanie
    handleListClick(e) {
        const li = e.target.closest("li")
        if (!li) return

        const index = li.dataset.index

        if (e.target.classList.contains("todo-trash")) {
            this.tasks.splice(index, 1)
            this.draw()
            this.saveToLocalStorage()
            return
        }

        if (li.querySelector(".edit-input")) return
        this.enableEditMode(li, index)
    }

    //Włącza tryb edycji dla wybranego zadania
    enableEditMode(li, index) {
        const task = this.tasks[index]
        let dateValue = ""
        if (task.date) {
            dateValue = task.date
        }

        li.innerHTML = `<input type="text" class="edit-input" value="${task.text}"> 
        <input type="date" class="edit-date" value="${dateValue}">
        <button class="todo-trash">🗑️</button>`

        const input = li.querySelector(".edit-input")
        input.focus()

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.saveEdit(li, index)
            }
        })
    }

    //Zapisuje zmiany w edytowanym zadaniu
    saveEdit(li, index) {
        const newText = li.querySelector(".edit-input").value.trim()
        const newDate = li.querySelector(".edit-date").value

        if (newText.length < 3 || newText.length > 255) {
            alert("Zadanie musi mieć od 3 do 255 znaków!")
            return
        }

        this.tasks[index] = { text: newText, date: newDate }
        this.draw()
        this.saveToLocalStorage()
    }

    //Zapisuje zmiany po kliknięciu poza edytowanym zadaniem
    handleOutsideClick(e) {
        const activeEdits = document.querySelectorAll("#todo-list li .edit-input")
        activeEdits.forEach(input => {
            const li = input.closest("li")
            if (!li.contains(e.target)) {
                const index = li.dataset.index
                this.saveEdit(li, index)
            }
        })
    }

    //Zapisuje wszystkie zadania do LocalStorage
    saveToLocalStorage() {
        localStorage.setItem("local_storage", JSON.stringify(this.tasks))
    }

    //Wczytuje zadania z LocalStorage
    loadFromLocalStorage() {
        const saved = JSON.parse(localStorage.getItem("local_storage") || "[]")
        this.tasks = saved
    }
}

//Inicjalizacja aplikacji po załadowaniu DOM
window.addEventListener("DOMContentLoaded", () => {
    document.todo = new ToDo()
})
