document.addEventListener('DOMContentLoaded', function() {
    function updateOffers() {
        fetch('/resurse/json/oferte.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.oferte || data.oferte.length === 0) {
                    throw new Error('No offers found in the JSON file.');
                }

                const now = new Date().getTime();
                const currentOffer = data.oferte.find(oferta => {
                    const startTime = new Date(oferta['data-incepere']).getTime();
                    const endTime = new Date(oferta['data-finalizare']).getTime();
                    return now >= startTime && now <= endTime;
                });

                if (!currentOffer) {
                    document.getElementById('oferta-text').innerText = "Nicio ofertă disponibilă în acest moment.";
                    document.getElementById('timer').innerText = "";
                    return;
                }

                const ofertaText = `Reducere de ${currentOffer.reducere}% la produsele din categoria ${currentOffer.categorie} până la ${new Date(currentOffer['data-finalizare']).toLocaleString()}`;
                document.getElementById('oferta-text').innerText = ofertaText;
                
                const endTime = new Date(currentOffer['data-finalizare']).getTime();
                const timer = document.getElementById('timer');
                
                function updateTimer() {
                    const now = new Date().getTime();
                    const distance = endTime - now;
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                    timer.innerText = `${hours}h ${minutes}m ${seconds}s`;

                    if (distance < 0) {
                        clearInterval(x);
                        timer.innerText = "Oferta a expirat";
                        // Refresh the offer
                        updateOffers();
                    }
                }

                const x = setInterval(updateTimer, 1000);
                updateTimer();

                document.querySelectorAll('.produs').forEach(prod => {
                    const categorie = prod.querySelector('.val-categorie').innerText.trim().toLowerCase();
                    if (categorie === currentOffer.categorie.toLowerCase()) {
                        const pretVechiElem = prod.querySelector('.pret-vechi');
                        const pretRedusElem = prod.querySelector('.pret-redus');
                        
                        if (pretVechiElem && pretRedusElem) {
                            const pretVechi = parseFloat(pretVechiElem.textContent.replace(' Lei', ''));
                            const pretNou = pretVechi * (1 - currentOffer.reducere / 100);
                            pretRedusElem.textContent = `${pretNou.toFixed(2)} Lei`;
                            pretVechiElem.style.textDecoration = 'line-through';
                        } else {
                            console.error('Elementele pentru preț vechi sau preț redus nu au fost găsite.');
                        }
                    }
                });
            })
            .catch(error => console.error('Eroare la încărcarea ofertei:', error));
    }

    updateOffers();
    setInterval(updateOffers, 60000);
});
