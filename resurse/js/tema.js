// Setează tema salvată în localStorage la încărcarea paginii
document.addEventListener("DOMContentLoaded", function() {
    let tema = localStorage.getItem("tema");
    if (tema) {
        document.body.classList.add(tema);
    }

    // Schimbă tema întunecată
    document.getElementById("schimba_tema").onclick = function() {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
        } else {
            document.body.classList.remove("light"); // Elimină clasa "light" dacă este prezentă
            document.body.classList.remove("neutral"); // Elimină clasa "neutral" dacă este prezentă
            document.body.classList.add("dark");
            localStorage.setItem("tema", "dark");
        }
    }

    // Schimbă tema deschisă
    document.getElementById("schimba_tema2").onclick = function() {
        if (document.body.classList.contains("light")) {
            document.body.classList.remove("light");
            localStorage.removeItem("tema");
        } else {
            document.body.classList.remove("dark"); // Elimină clasa "dark" dacă este prezentă
            document.body.classList.remove("neutral"); // Elimină clasa "neutral" dacă este prezentă
            document.body.classList.add("light");
            localStorage.setItem("tema", "light");
            document.body.classList.remove("dark");
            document.body.classList.add("tema");
            localStorage.setItem("switchState", "unchecked");
        }
    }
    // Schimbă tema netural
    document.getElementById("schimba_tema3").onclick = function() {
        if (document.body.classList.contains("neutral")) {
            document.body.classList.remove("neutral");
            localStorage.removeItem("tema");
        } else {
            document.body.classList.remove("dark"); // Elimină clasa "dark" dacă este prezentă
            document.body.classList.remove("light"); // Elimină clasa "light" dacă este prezentă
            document.body.classList.add("neutral");
            localStorage.setItem("tema", "neutral");
            document.body.classList.remove("dark");
            document.body.classList.add("tema");
            localStorage.setItem("switchState", "unchecked");
        }
    }
});
document.addEventListener("DOMContentLoaded", function() {
    const switchInput = document.getElementById("schimba_tema");

    // Restaurarea stării switch-ului din localStorage
    let switchState = localStorage.getItem("switchState");
    if (switchState === "checked") {
        switchInput.checked = true;
        document.body.classList.add("dark");
        document.body.classList.remove("tema");
    } else {
        switchInput.checked = false;
        document.body.classList.add("tema");
        document.body.classList.remove("dark");
    }

    // Evenimentul de schimbare a stării switch-ului
    switchInput.addEventListener("change", function() {
        if (switchInput.checked) {
            document.body.classList.remove("tema");
            document.body.classList.add("dark");
            localStorage.setItem("switchState", "checked");
        } else {
            document.body.classList.remove("dark");
            document.body.classList.add("tema");
            localStorage.setItem("switchState", "unchecked");
        }
        
    });
});
