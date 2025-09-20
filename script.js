document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 300; // Mantén este número o ajusta si hay problemas de rendimiento.

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
        const maxTries = 500;
        
        // --- AJUSTES CRÍTICOS AQUÍ ---
        // Reducimos el padding para que las flores se dispersen más ampliamente.
        // Si quieres que cubran toda la pantalla, incluso por los bordes, puedes usar 0.
        const centralAreaPadding = 0; // Cambiado de 30 a 0 o un número muy pequeño

        // Calcular los límites del área de dispersión de forma más robusta
        // Aseguramos que el rango de cálculo siempre sea al menos 0
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Establecer los límites iniciales para toda la ventana (menos el padding)
        let minX = centralAreaPadding;
        let maxX = viewportWidth - flowerWidth - centralAreaPadding;
        let minY = centralAreaPadding;
        let maxY = viewportHeight - flowerHeight - centralAreaPadding;

        // Asegurarse de que maxX no sea menor que minX (y lo mismo para Y)
        // Si el área disponible es muy pequeña, permitimos que se sobrepase el padding
        if (maxX <= minX) { // Si el área horizontal es demasiado pequeña para el padding
            minX = 0;
            maxX = Math.max(0, viewportWidth - flowerWidth); // Asegura que no sea negativo
        }
        if (maxY <= minY) { // Si el área vertical es demasiado pequeña para el padding
            minY = 0;
            maxY = Math.max(0, viewportHeight - flowerHeight); // Asegura que no sea negativo
        }
        // --- FIN DE AJUSTES CRÍTICOS ---


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
        // Si fallan todos los intentos, devolvemos una posición aleatoria dentro del rango calculado
        return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    }


    function createAndPositionFlowers() {
        if (!flowersScatterContainer || !messageElement || !flowerTemplate) {
            console.error("Elementos DOM necesarios no encontrados. No se pueden crear las flores.");
            return;
        }
        flowersScatterContainer.innerHTML = '';

        const { messageRect, flowerWidth, flowerHeight } = getElementDimensions();
        
        // Puedes agregar una pequeña comprobación aquí para 'messageRect' si es necesario
        // if (messageRect.width === 0 || messageRect.height === 0) { ... }

        for (let i = 0; i < numberOfFlowers; i++) {
            const flower = flowerTemplate.cloneNode(true);
            flower.classList.remove('flower-template');
            flower.classList.add('scattered-flower');
            flower.style.display = 'block';

            const { x, y } = getRandomPosition(messageRect, flowerWidth, flowerHeight);
            flower.style.left = `${x}px`;
            flower.style.top = `${y}px`;

            flower.style.animationDelay = `${Math.random() * 5}s`;
            flower.style.animationDuration = `${4 + Math.random() * 4}s`;
            flower.style.transform = `rotate(${Math.random() * 360}deg)`;

            flowersScatterContainer.appendChild(flower);
        }
    }

    createAndPositionFlowers();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createAndPositionFlowers, 300);
    });
});