window.addEventListener("load", function() {
    // Salvează filtrele în localStorage sau cookie dacă "salveaza filtrare" este bifat
    function saveFilters() {
        const filterState = {
            name: document.getElementById("inp-nume").value.toLowerCase().trim(),
            pret: parseFloat(document.getElementById("inp-pret").value),
            categorie: document.getElementById("inp-categorie").value.toLowerCase().trim(),
            ore: document.querySelector('input[name="gr_rad"]:checked').value
        };
        localStorage.setItem('filterState', JSON.stringify(filterState));
    }

    // Încarcă filtrele din localStorage sau cookie
    function loadFilters() {
        const savedFilterState = localStorage.getItem('filterState');
        if (savedFilterState) {
            const filterState = JSON.parse(savedFilterState);
            document.getElementById("inp-nume").value = filterState.name;
            document.getElementById("inp-pret").value = filterState.pret;
            document.getElementById("inp-categorie").value = filterState.categorie;
            document.querySelector(`input[name="gr_rad"][value="${filterState.ore}"]`).checked = true;
            document.getElementById("infoRange").innerHTML = `(${filterState.pret})`;
            document.getElementById("filtrare").click();
        }
    }

    // Șterge filtrele salvate din localStorage sau cookie
    function clearFilters() {
        localStorage.removeItem('filterState');
    }

    // Eveniment pentru schimbarea stării checkbox-ului
    document.getElementById("salveaza-filtrare").addEventListener("change", function() {
        if (this.checked) {
            saveFilters();
        } else {
            clearFilters();
        }
    });

    // Eveniment pentru schimbarea valorii slider-ului de preț
    document.getElementById("inp-pret").addEventListener("input", function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    });

    // Eveniment pentru butonul de filtrare
    document.getElementById("filtrare").addEventListener("click", function() {
        let inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();

        let vRadio = document.getElementsByName("gr_rad");
        let inpOre;
        for (let r of vRadio) {
            if (r.checked) {
                inpOre = r.value;
                break;
            }
        }

        let minOre, maxOre;
        if (inpOre != "toate") {
            let aux = inpOre.split(":");
            minOre = parseInt(aux[0]);
            maxOre = parseInt(aux[1]);
        }

        let inpPret = parseFloat(document.getElementById("inp-pret").value);

        let inpCateg = document.getElementById("inp-categorie").value.toLowerCase().trim();

        let produse = document.getElementsByClassName("produs");
        for (let produs of produse) {
            let valNumeElem = produs.getElementsByTagName("h3")[0];
            let valNume = valNumeElem ? valNumeElem.innerText.toLowerCase().trim() : "";
            let cond1 = valNume.startsWith(inpNume);

            let valOreElem = produs.querySelector("td:nth-child(2)");
            let valOre = valOreElem ? parseInt(valOreElem.innerText) : 0;
            let cond2 = (inpOre == "toate" || (minOre <= valOre && valOre < maxOre));

            let valPretElem = produs.querySelector("td:nth-child(2)");
            let valPret = valPretElem ? parseFloat(valPretElem.innerText.replace(" Lei", "")) : 0;
            let cond3 = (valPret >= inpPret);

            let valCategElem = produs.querySelector(".val-categorie");
            let valCateg = valCategElem ? valCategElem.innerText.toLowerCase().trim() : "";
            let cond4 = (inpCateg == "toate" || inpCateg == valCateg);

            if (cond1 && cond2 && cond3 && cond4) {
                produs.style.display = "block";
            } else {
                produs.style.display = "none";
            }
        }

        // Salvează filtrele dacă checkbox-ul este bifat
        if (document.getElementById("salveaza-filtrare").checked) {
            saveFilters();
        }

        // Update the price display
        document.getElementById("infoRange").innerHTML = `(${inpPret})`;
    });

    // Eveniment pentru butonul de resetare
    document.getElementById("resetare").onclick = function() {
        document.getElementById("inp-nume").value = "";
        document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value = "toate";
        document.getElementById("i_rad4").checked = true;
        document.getElementById("infoRange").innerHTML = "(0)";
        let produse = document.getElementsByClassName("produs");
        for (let prod of produse) {
            prod.style.display = "block";
        }
        document.getElementById("salveaza-filtrare").checked = false;
        clearFilters();
    };

    window.onkeydown = function(e) {
        if (e.key == "c" && e.altKey) {
            let suma = 0;
            let produse = document.getElementsByClassName("produs");
            for (let produs of produse) {
                let stil = getComputedStyle(produs);
                if (stil.display != "none") {
                    suma += parseFloat(produs.querySelector("td:nth-child(2)").innerText.replace(" Lei", ""));
                }
            }
            if (!document.getElementById("par_suma")) {
                let p = document.createElement("p");
                p.innerHTML = `<b>${suma}</b>`;
                p.id = "par_suma";
                let container = document.getElementById("produse");
                container.insertBefore(p, container.children[0]);
                setTimeout(function() {
                    let par = document.getElementById("par_suma");
                    if (par) {
                        par.remove();
                    }
                }, 2000);
            } else {
                let p = document.getElementById("par_suma");
                p.innerHTML = `<b>${suma}</b>`;
            }
        }
    };

    function sorteaza(semn) {
        let produse = document.getElementsByClassName("produs");
        let v_produse = Array.from(produse);
        v_produse.sort(function(a, b) {
            let pret_a = parseFloat(a.querySelector("td:nth-child(2)").innerText.replace(" Lei", ""));
            let pret_b = parseFloat(b.querySelector("td:nth-child(2)").innerText.replace(" Lei", ""));
            if (pret_a == pret_b) {
                let nume_a = a.querySelector("h3 a").innerText;
                let nume_b = b.querySelector("h3 a").innerText;
                return semn * nume_a.localeCompare(nume_b);
            }
            return semn * (pret_a - pret_b);
        });
        for (let prod of v_produse) {
            prod.parentNode.appendChild(prod);
        }
    }

    document.getElementById("sortCrescNume").onclick = function() {
        sorteaza(1);
    };
    document.getElementById("sortDescrescNume").onclick = function() {
        sorteaza(-1);
    };

    // Încarcă filtrele la încărcarea paginii
    loadFilters();
});

document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('inp-nume');

    textarea.addEventListener('input', function() {
        if (textarea.value.trim() === '') {
            textarea.classList.add('is-invalid');
        } else {
            textarea.classList.remove('is-invalid');
        }
    });

    // Inițializează validarea la începutul paginii
    if (textarea.value.trim() === '') {
        textarea.classList.add('is-invalid');
    }
});
