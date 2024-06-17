document.addEventListener('DOMContentLoaded', function() {
    let initialOrder = [];

    function saveInitialOrder() {
        let produse = document.getElementsByClassName("produs");
        initialOrder = Array.from(produse);
    }

    function validateInputs() {
        let isValid = true;


        const inpPret = document.getElementById('inp-pret');
        if (isNaN(inpPret.value) || inpPret.value < 0) {
            inpPret.classList.add('is-invalid');
            isValid = false;
        } else {
            inpPret.classList.remove('is-invalid');
        }

        const inpCategorie = document.getElementById('inp-categorie');
        if (inpCategorie.value.trim() === '') {
            inpCategorie.classList.add('is-invalid');
            isValid = false;
        } else {
            inpCategorie.classList.remove('is-invalid');
        }

        const inpOre = document.getElementById('inp-ore');
        if (isNaN(inpOre.value) || inpOre.value < 0) {
            inpOre.classList.add('is-invalid');
            isValid = false;
        } else {
            inpOre.classList.remove('is-invalid');
        }

        const inpOS = document.getElementById('inp-os');
        if (inpOS.value.trim() === '') {
            inpOS.classList.add('is-invalid');
            isValid = false;
        } else {
            inpOS.classList.remove('is-invalid');
        }

        const inpTip = document.getElementById('inp-tip');
        if ([...inpTip.options].filter(option => option.selected).length === 0) {
            inpTip.classList.add('is-invalid');
            isValid = false;
        } else {
            inpTip.classList.remove('is-invalid');
        }

        return isValid;
    }

    function saveFilters() {
        const filterState = {
            name: document.getElementById("inp-nume").value.toLowerCase().trim(),
            pret: parseFloat(document.getElementById("inp-pret").value),
            categorie: document.getElementById("inp-categorie").value.toLowerCase().trim(),
            ore: parseInt(document.getElementById("inp-ore").value),
            refundabil: document.querySelector('input[name="gr_rad_refund"]:checked').value,
            os: document.getElementById("inp-os").value.toLowerCase().trim(),
            tip: Array.from(document.getElementById("inp-tip").options).filter(option => option.selected).map(option => option.value.toLowerCase().trim())
        };
        localStorage.setItem('filterState', JSON.stringify(filterState));
    }

    function loadFilters() {
        const savedFilterState = localStorage.getItem('filterState');
        if (savedFilterState) {
            const filterState = JSON.parse(savedFilterState);
            document.getElementById("inp-nume").value = filterState.name;
            document.getElementById("inp-pret").value = filterState.pret;
            document.getElementById("inp-categorie").value = filterState.categorie;
            document.getElementById("inp-ore").value = filterState.ore;
            document.getElementById("inp-os").value = filterState.os;
            filterState.tip.forEach(val => {
                document.querySelector(`#inp-tip option[value="${val}"]`).selected = true;
            });
            document.querySelector(`input[name="gr_rad_refund"][value="${filterState.refundabil}"]`).checked = true;
            document.getElementById("infoRange").innerHTML = `(${filterState.pret})`;
            document.getElementById("infoRangeOre").innerHTML = `(${filterState.ore})`;
            document.getElementById("filtrare").click();
        }
    }

    function clearFilters() {
        localStorage.removeItem('filterState');
    }

    document.getElementById("salveaza-filtrare").addEventListener("change", function() {
        if (this.checked) {
            saveFilters();
        } else {
            clearFilters();
        }
    });

    document.getElementById("inp-pret").addEventListener("input", function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    });

    document.getElementById("inp-ore").addEventListener("input", function() {
        document.getElementById("infoRangeOre").innerHTML = `(${this.value})`;
    });

    document.getElementById("filtrare").addEventListener("click", function() {
        if (!validateInputs()) {
            alert("Vă rugăm să completați corect toate câmpurile.");
            return;
        }

        let inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        let inpOre = parseInt(document.getElementById("inp-ore").value);
        let inpRefundabil = document.querySelector('input[name="gr_rad_refund"]:checked').value;
        let inpPret = parseFloat(document.getElementById("inp-pret").value);
        let inpCateg = document.getElementById("inp-categorie").value.toLowerCase().trim();
        let inpOS = document.getElementById("inp-os").value.toLowerCase().trim();
        let inpTipOptions = document.getElementById("inp-tip").options;
        let inpTip = Array.from(inpTipOptions).filter(option => option.selected).map(option => option.value.toLowerCase().trim());

        let produse = document.getElementsByClassName("produs");
        for (let produs of produse) {
            let valNumeElem = produs.querySelector("h3 a");
            let valNume = valNumeElem ? valNumeElem.innerText.toLowerCase().trim() : "";
            let cond1 = valNume.startsWith(inpNume);

            let valOreElem = produs.querySelector("td:nth-child(4)");
            let valOre = valOreElem ? parseInt(valOreElem.innerText) : 0;
            let cond2 = (valOre >= inpOre);

            let valRefundElem = produs.querySelector(".val_refund");
            let valRefund = valRefundElem ? valRefundElem.innerText.toLowerCase().trim() : "";
            let cond3 = (inpRefundabil == "toate" || inpRefundabil == valRefund);

            let valPretElem = produs.querySelector("td:nth-child(2)");
            let valPret = valPretElem ? parseFloat(valPretElem.innerText.replace(" Lei", "")) : 0;
            let cond4 = (valPret >= inpPret);

            let valCategElem = produs.querySelector(".val-categorie");
            let valCateg = valCategElem ? valCategElem.innerText.toLowerCase().trim() : "";
            let cond5 = (inpCateg == "toate" || inpCateg == valCateg);

            let valOSElem1 = produs.querySelector(".windows");
            let cond6 = valOSElem1 && valOSElem1.innerText.toLowerCase().trim() === "da" && inpOS.includes("windows");
            
            let valOSElem2 = produs.querySelector(".linux");
            let cond7 = valOSElem2 && valOSElem2.innerText.toLowerCase().trim() === "da" && inpOS.includes("linux");
            
            let valOSElem3 = produs.querySelector(".mac");
            let cond8 = valOSElem3 && valOSElem3.innerText.toLowerCase().trim() === "da" && inpOS.includes("macos");
            
            let osCondition = inpOS === "" || cond6 || cond7 || cond8;
            
            let valTipElem = produs.querySelector(".plat");
            let valTip = valTipElem ? valTipElem.innerText.toLowerCase().trim() : "";
            let cond9 = inpTip.includes(valTip) || inpTip.length === 0;
            console.log(valTipElem);

            if (cond1 && cond2 && cond3 && cond4 && cond5 && osCondition && cond9) {
                produs.style.display = "block";
            } else {
                produs.style.display = "none";
            }
        }

        if (document.getElementById("salveaza-filtrare").checked) {
            saveFilters();
        }

        document.getElementById("infoRange").innerHTML = `(${inpPret})`;
        document.getElementById("infoRangeOre").innerHTML = `(${inpOre})`;
    });

    document.getElementById("resetare").onclick = function() {
        if (confirm("Ești sigur că vrei să resetezi filtrele?")) {
            document.getElementById("inp-nume").value = "";
            document.getElementById("inp-pret").value = document.getElementById("inp-pret").min;
            document.getElementById("inp-categorie").value = "toate";
            document.getElementById("inp-ore").value = document.getElementById("inp-ore").min;
            document.getElementById("i_rad3").checked = true;
            document.getElementById("inp-os").value = "";
            Array.from(document.getElementById("inp-tip").options).forEach(option => option.selected = false);
            document.getElementById("infoRange").innerHTML = "(0)";
            document.getElementById("infoRangeOre").innerHTML = "(0)";
            let produse = document.getElementsByClassName("produs");
            for (let prod of produse) {
                prod.style.display = "block";
            }
            document.getElementById("salveaza-filtrare").checked = false;
            clearFilters();

            // Resetează ordinea produselor la cea inițială
            let container = document.querySelector('.grid-produse');
            initialOrder.forEach(prod => {
                container.appendChild(prod);
            });
        }
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
    saveInitialOrder();
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