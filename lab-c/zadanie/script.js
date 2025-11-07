let map = L.map('map').setView([53.00, 14.00], 17);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);

let marker = L.marker([53.43, 14.56]).addTo(map);
marker.bindPopup("Twoja lokalizacja").openPopup();

let piecesContainer = document.getElementById("pieces");
let board = document.getElementById("board");
let totalPieces = 16;
let placedPieces = 0;

// Przycisk lokalizacji i zapisu mapy
document.getElementById("locBtn").addEventListener("click", locateUser);
document.getElementById("saveBtn").addEventListener("click", saveAndCreate);

// pobieranie geolokalizacji użytkownika
function locateUser() {
    if (!navigator.geolocation) {
        alert("Twoja przeglądarka nie obsługuje geolokalizacji!");
        return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        map.setView([lat, lon], 17);
        marker.setLatLng([lat, lon]);
        marker.bindPopup("Twoja lokalizacja").openPopup();
    }, err => {
        console.error(err);
    });
}

function saveAndCreate() {
    let orgWidth = map.getContainer().style.width;
    let orgHeight = map.getContainer().style.height;

    map.getContainer().style.width = '1200px';
    map.getContainer().style.height = '400px';
    map.invalidateSize();

    leafletImage(map, function(err, canvas) {
        map.getContainer().style.width = orgWidth;
        map.getContainer().style.height = orgHeight;
        map.invalidateSize();

        if (err) {
            console.error(err);
            return;
        }

        let mapcanvas = document.getElementById("rasterMap");
        let ctx = mapcanvas.getContext("2d");
        mapcanvas.width = 1200;
        mapcanvas.height = 300;
        ctx.drawImage(canvas, 0, 0, 1200, 300);
        createPuzzle(mapcanvas);
    });
}

// tutaj się tworzą puzzle
function createPuzzle(canvas) {
    piecesContainer.innerHTML = "";
    board.innerHTML = "";
    placedPieces = 0;

    let cols = 4;
    let rows = 4;
    let pW = 1200 / cols;
    let pH = 400 / rows;

    // tworzenie puzzli
    for (let i = 0; i < totalPieces; i++) {
        let p = document.createElement("div");
        p.classList.add("piece");
        p.draggable = true;

        let srcX = (i % cols) * pW;
        let srcY = Math.floor(i / cols) * pH;

        p.style.backgroundImage = "url(" + canvas.toDataURL() + ")";
        p.style.backgroundPosition = (-srcX) + "px " + (-srcY) + "px";
        p.dataset.correct = i;
        piecesContainer.appendChild(p);
    }

    // mieszanie puzzli
    let Puzelki = Array.from(piecesContainer.children);
    piecesContainer.innerHTML = "";
    puzzlesRand(Puzelki).forEach(p => piecesContainer.appendChild(p));

    // pola docelowe
    for (let i = 0; i < totalPieces; i++) {
        let s = document.createElement("div");
        s.classList.add("slot");
        s.dataset.index = i;
        board.appendChild(s);
    }

    dragAndDrop();
}

// układanie puzzli drag and drop + cofanie do rozsypanych
function dragAndDrop() {
    let pieces = document.querySelectorAll(".piece");
    let slots = document.querySelectorAll(".slot");

    pieces.forEach(p => {
        p.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text", p.dataset.correct);
        });
    });

    slots.forEach(s => {
        s.addEventListener("dragover", e => e.preventDefault());
        s.addEventListener("drop", e => {
            e.preventDefault();
            let data = e.dataTransfer.getData("text");
            if (s.childElementCount === 0) {
                let piece = document.querySelector('[data-correct="' + data + '"]');
                s.appendChild(piece);

                // Sprawdzenie poprawności dopasowania
                if (parseInt(s.dataset.index) === parseInt(piece.dataset.correct)) {
                    // jeśli puzzel był wcześniej błędny – teraz zalicz
                    if (!piece.classList.contains("correct")) {
                        piece.classList.add("correct");
                        placedPieces++;
                        console.log("Poprawny element: " + placedPieces + " / " + totalPieces);
                    }
                } else {
                    // jeśli puzzel był wcześniej poprawny, ale teraz przesunięty — odejmij
                    if (piece.classList.contains("correct")) {
                        piece.classList.remove("correct");
                        placedPieces--;
                    }
                }

                // Jeśli wszystkie poprawne – gratulacje
                if (placedPieces === totalPieces) {
                    console.log("Ułożono wszystkie puzzle! 🎉");
                    Winner();
                }
            }
        });
    });
    // umożliwia wrzucenie puzzla z powrotem do rozsypanych
    piecesContainer.addEventListener("dragover", e => e.preventDefault());
    piecesContainer.addEventListener("drop", e => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        const piece = document.querySelector('[data-correct="' + data + '"]');
        if (!piece) return;
        const parent = piece.parentElement;

        if (parent && parent.classList.contains("slot") &&
            parseInt(parent.dataset.index) === parseInt(piece.dataset.correct) &&
            piece.classList.contains("correct")) {
            piece.classList.remove("correct");
            placedPieces--;
        }

        piecesContainer.appendChild(piece);
    });
}

// funkcja do wymieszania tablicy
function puzzlesRand(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// powiadomienie o wygranej
function Winner() {
    if (Notification.permission === "granted") {
        new Notification("Gratulacje!", {body: "Ułożyłeś wszystkie puzzle"});
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") {
                new Notification("Gratulacje!", {body: "Ułożyłeś wszystkie puzzle"});
            }
        });
    } else {
        alert("Gratulacje! Ułożyłeś wszystkie puzzle!");
    }
}
