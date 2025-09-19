document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 500;

    function getElementDimensions() {
        const messageRect = messageElement.getBoundingClientRect();
        const tempFlower = flowerTemplate.cloneNode(true);
        tempFlower.style.display = 'block';
        tempFlower.style.visibility = 'hidden';
        tempFlower.style.position = 'absolute';
        flowersScatterContainer.appendChild(tempFlower);
        const flowerWidth = tempFlower.offsetWidth;
        const flowerHeight = tempFlower.offsetHeight;
        flowersScatterContainer.removeChild(tempFlower);
        return { messageRect, flowerWidth, flowerHeight };
    }


    // --- MODIFICACIÓN AQUÍ EN getRandomPosition ---
    function getRandomPosition(messageRect, flowerWidth, flowerHeight) {
        let x, y;
        let tries = 0;
        const maxTries = 200;

        // Definir un margen o radio alrededor del centro de la pantalla
        // para restringir la dispersión de las flores.
        // Puedes ajustar estos valores según qué tan "centralizadas" las quieras.
        const centralAreaPadding = 100; // Por ejemplo, 100px desde los bordes del centro
        
        // Calcular los límites del área central donde pueden aparecer las flores
        // Esto crea un rectángulo central donde las flores pueden aparecer
        const minX = centralAreaPadding;
        const maxX = window.innerWidth - flowerWidth - centralAreaPadding;
        const minY = centralAreaPadding;
        const maxY = window.innerHeight - flowerHeight - centralAreaPadding;

        // Asegurarse de que el área central sea válida (no se solape con sí misma)
        if (maxX < minX) maxX = minX;
        if (maxY < minY) maxY = minY;


        do {
            // Generar posición dentro del área central definida
            x = minX + Math.random() * (maxX - minX);
            y = minY + Math.random() * (maxY - minY);
            tries++;

            const overlapsWithMessage = (
                x < messageRect.right &&
                x + flowerWidth > messageRect.left &&
                y < messageRect.bottom &&
                y + flowerHeight > messageRect.top
            );

            if (!overlapsWithMessage) {
                return { x, y };
            }

        } while (tries < maxTries);

        console.warn('No se pudo encontrar una posición sin superposición para una flor. Podría haber superposición o el espacio central es muy pequeño.');
        // En caso de que no se encuentre una buena posición central sin superposición,
        // aún así intentamos una posición más general para asegurar que la flor aparezca.
        return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    }
    // --- FIN DE LA MODIFICACIÓN EN getRandomPosition ---


    function createAndPositionFlowers() {
        flowersScatterContainer.innerHTML = '';
        const { messageRect, flowerWidth, flowerHeight } = getElementDimensions();

        for (let i = 0; i < numberOfFlowers; i++) {
            const flower = flowerTemplate.cloneNode(true);
            flower.classList.remove('flower-template');
            flower.classList.add('scattered-flower');
            flower.style.display = 'block';

            const { x, y } = getRandomPosition(messageRect, flowerWidth, flowerHeight);
            flower.style.left = `${x}px`;
            flower.style.top = `${y}px`;

            flower.style.animationDelay = `${Math.random() * 2}s`;
            flower.style.animationDuration = `${5 + Math.random() * 3}s`;
            flower.style.transform = `rotate(${Math.random() * 360}deg)`;

            flowersScatterContainer.appendChild(flower);
        }
    }

    createAndPositionFlowers();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createAndPositionFlowers, 200);
    });
});