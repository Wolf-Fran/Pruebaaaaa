document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    // Mantenemos 300 flores, pero si sigue siendo lento, considera reducirlo.
    const numberOfFlowers = 150; 

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


    function getRandomPosition(messageRect, flowerWidth, flowerHeight) {
        let x, y;
        let tries = 0;
        // --- AJUSTE 1: AUMENTAR maxTries ---
        const maxTries = 50; // Aumentado para dar más oportunidades de encontrar espacio
        
        // --- AJUSTE 2: REDUCIR centralAreaPadding ---
        // Valor más pequeño para permitir que las flores se dispersen más hacia los bordes
        // Por ejemplo, 30px o 0px si quieres que lleguen hasta el borde.
        const centralAreaPadding = 30; // Puedes ajustar este valor: menos = más dispersión
        
        const minX = centralAreaPadding;
        const maxX = window.innerWidth - flowerWidth - centralAreaPadding;
        const minY = centralAreaPadding;
        const maxY = window.innerHeight - flowerHeight - centralAreaPadding;

        // Asegurarse de que el área de dispersión tenga un tamaño mínimo,
        // especialmente en pantallas muy pequeñas.
        if (maxX < minX + flowerWidth) { // Si el área horizontal es demasiado pequeña
            maxX = window.innerWidth - flowerWidth; // Extender hasta el borde
            minX = 0;
        }
        if (maxY < minY + flowerHeight) { // Si el área vertical es demasiado pequeña
            maxY = window.innerHeight - flowerHeight; // Extender hasta el borde
            minY = 0;
        }


        do {
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

        console.warn('No se pudo encontrar una posición sin superposición para una flor. Podría haber superposición o el espacio es muy limitado.');
        // Si después de muchos intentos no encuentra un lugar, simplemente devuelve una posición aleatoria
        // dentro del área calculada, aceptando una posible superposición.
        return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    }


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

            // Variaciones para las animaciones
            flower.style.animationDelay = `${Math.random() * 5}s`; // Mayor rango de delay
            flower.style.animationDuration = `${4 + Math.random() * 4}s`; // Mayor rango de duración
            flower.style.transform = `rotate(${Math.random() * 360}deg)`; // Rotación inicial aleatoria

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