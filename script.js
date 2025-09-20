document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 100; // O el número que estés usando

    function getElementDimensions() {
        // Siempre recalcular las dimensiones del mensaje al inicio de la función
        // para asegurar que estén actualizadas, especialmente después de un resize.
        const messageRect = messageElement.getBoundingClientRect();
        
        const tempFlower = flowerTemplate.cloneNode(true);
        tempFlower.style.display = 'block';
        tempFlower.style.visibility = 'hidden';
        tempFlower.style.position = 'absolute';
        flowersScatterContainer.appendChild(tempFlower);
        const flowerWidth = tempFlower.offsetWidth;
        const flowerHeight = tempFlower.offsetHeight;
        flowersScatterContainer.removeChild(tempFlower);

        // Si por alguna razón el mensaje no tiene dimensiones válidas,
        // podríamos usar un fallback o registrar una advertencia.
        if (messageRect.width === 0 || messageRect.height === 0) {
            console.warn("El mensaje no tiene dimensiones válidas al calcular.");
            // Podrías devolver valores predeterminados o intentar recalcular más tarde
        }
        return { messageRect, flowerWidth, flowerHeight };
    }

    function getRandomPosition(messageRect, flowerWidth, flowerHeight) {
        let x, y;
        let tries = 0;
        const maxTries = 500;
        const centralAreaPadding = 30; // Ajusta según tu preferencia

        const minX = centralAreaPadding;
        const maxX = window.innerWidth - flowerWidth - centralAreaPadding;
        const minY = centralAreaPadding;
        const maxY = window.innerHeight - flowerHeight - centralAreaPadding;

        // Asegurarse de que el área de dispersión tenga un tamaño mínimo
        const safeMinX = (maxX < minX + flowerWidth) ? 0 : minX;
        const safeMaxX = (maxX < minX + flowerWidth) ? window.innerWidth - flowerWidth : maxX;
        const safeMinY = (maxY < minY + flowerHeight) ? 0 : minY;
        const safeMaxY = (maxY < minY + flowerHeight) ? window.innerHeight - flowerHeight : maxY;

        do {
            x = safeMinX + Math.random() * (safeMaxX - safeMinX);
            y = safeMinY + Math.random() * (safeMaxY - safeMinY);
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
        return { x: safeMinX + Math.random() * (safeMaxX - safeMinX), y: safeMinY + Math.random() * (safeMaxY - safeMinY) };
    }

    function createAndPositionFlowers() {
        // Verificar que el contenedor de las flores y el mensaje existan
        if (!flowersScatterContainer || !messageElement || !flowerTemplate) {
            console.error("Elementos DOM necesarios no encontrados. No se pueden crear las flores.");
            return; // Salir si falta algo crítico
        }

        flowersScatterContainer.innerHTML = ''; // Limpia las flores existentes

        const { messageRect, flowerWidth, flowerHeight } = getElementDimensions();

        // Si el mensaje tiene dimensiones inválidas, podría ser un problema.
        // Podríamos intentar de nuevo o salir. Por ahora, asumimos que es válido.

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

    createAndPositionFlowers(); // Crea las flores al cargar la página

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        // Aumenta el tiempo si el problema persiste. Esto da más tiempo al navegador para estabilizarse.
        resizeTimeout = setTimeout(createAndPositionFlowers, 300); // Antes 200ms
    });
});