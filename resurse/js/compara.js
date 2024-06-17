let produseDeComparat = JSON.parse(localStorage.getItem('produseDeComparat')) || [];

function adaugaLaComparare(idProdus, numeProdus) {
    if (produseDeComparat.length < 2) {
        produseDeComparat.push({ id: idProdus, nume: numeProdus });
        actualizeazaContainerComparare();
    } else {
        alert("Ștergeți un produs din lista de comparare pentru a adăuga altul.");
    }

    if (produseDeComparat.length >= 2) {
        dezactiveazaButoaneleCompara();
    }

    localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
}

function stergeProdusComparare(index) {
    produseDeComparat.splice(index, 1);
    actualizeazaContainerComparare();
    activeazaButoaneleCompara();
    localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
}

function actualizeazaContainerComparare() {
    const container = document.getElementById('container-comparare');
    const produseContainer = document.getElementById('produse-comparare');

    if (produseDeComparat.length > 0) {
        container.style.display = 'block';
        produseContainer.innerHTML = '';
        produseDeComparat.forEach((produs, index) => {
            produseContainer.innerHTML += `
                <div>
                    <span>${produs.nume}</span>
                    <button onclick="stergeProdusComparare(${index})">Șterge</button>
                </div>
            `;
        });

        if (produseDeComparat.length === 3) {
            produseContainer.innerHTML += `<button onclick="afiseazaComparare()">Afișează</button>`;
        }
    } else {
        container.style.display = 'none';
    }
}

function dezactiveazaButoaneleCompara() {
    const butoane = document.querySelectorAll('.compara-btn');
    butoane.forEach(buton => {
        buton.disabled = true;
        buton.title = 'Ștergeți un produs din lista de comparare';
    });
}

function activeazaButoaneleCompara() {
    const butoane = document.querySelectorAll('.compara-btn');
    butoane.forEach(buton => {
        buton.disabled = false;
        buton.title = '';
    });
}

function afiseazaComparare() {
    if (produseDeComparat.length === 2) {
        const url = `/compara?produs1=${produseDeComparat[0].id}&produs2=${produseDeComparat[1].id}`;
        window.open(url, '_blank');
    } else {
        alert("Adăugați două produse pentru comparare.");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const savedComparare = localStorage.getItem('produseDeComparat');
    if (savedComparare) {
        produseDeComparat = JSON.parse(savedComparare);
        actualizeazaContainerComparare();
        if (produseDeComparat.length >= 2) {
            dezactiveazaButoaneleCompara();
        }
    }

    window.addEventListener('beforeunload', function() {
        localStorage.setItem('produseDeComparat', JSON.stringify(produseDeComparat));
    });

    setInterval(function() {
        const lastUpdate = localStorage.getItem('lastUpdate');
        if (lastUpdate && (Date.now() - new Date(lastUpdate)) > 86400000) {
            localStorage.removeItem('produseDeComparat');
            produseDeComparat = [];
            actualizeazaContainerComparare();
        }
    }, 60000);

    localStorage.setItem('lastUpdate', new Date());
});
