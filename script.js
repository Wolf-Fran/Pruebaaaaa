document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 100; // Mantén este número o ajusta si hay problemas de rendimiento.

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
        const maxTries = 1000;
        
        // --- MODIFICACIÓN CLAVE AQUÍ ---
        // Definir un área de dispersión que cubra casi toda la ventana,
        // permitiendo un pequeño margen en los bordes para que las flores no se "corten".
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Limites para que las flores se dispersen por toda la pantalla.
        // Aseguramos un rango mínimo para el cálculo random.
        // Permite que las flores se posicionen desde casi el borde 0 hasta el borde final
        // menos el tamaño de la flor.
        const effectiveMinX = 0; // Empieza desde el borde izquierdo
        const effectiveMaxX = Math.max(effectiveMinX, viewportWidth - flowerWidth); // Termina en el borde derecho (menos el ancho de la flor)
        const effectiveMinY = 0; // Empieza desde el borde superior
        const effectiveMaxY = Math.max(effectiveMinY, viewportHeight - flowerHeight); // Termina en el borde inferior (menos el alto de la flor)
        // --- FIN MODIFICACIÓN CLAVE ---

        // Margen de seguridad alrededor del mensaje (ya lo teníamos)
        const messageMargin = 20; 
        const messageLeft = messageRect.left - messageMargin;
        const messageRight = messageRect.right + messageMargin;
        const messageTop = messageRect.top - messageMargin;
        const messageBottom = messageRect.bottom + messageMargin;

        do {
            // Generar posición dentro del rango efectivo
            x = effectiveMinX + Math.random() * (effectiveMaxX - effectiveMinX);
            y = effectiveMinY + Math.random() * (effectiveMaxY - effectiveMinY);
            tries++;

            const overlapsWithMessage = (
                x < messageRight &&
                x + flowerWidth > messageLeft &&
                y < messageBottom &&
                y + flowerHeight > messageTop
            );

            if (!overlapsWithMessage) {
                return { x, y };
            }

        } while (tries < maxTries);

        console.warn('No se pudo encontrar una posición sin superposición para una flor después de varios intentos. Se está forzando una posición, lo que puede causar superposición.');
        // Si no se encuentra una posición sin superposición después de muchos intentos,
        // devolvemos una posición aleatoria dentro del rango efectivo.
        return { x: effectiveMinX + Math.random() * (effectiveMaxX - effectiveMinX), y: effectiveMinY + Math.random() * (effectiveMaxY - effectiveMinY) };
    }


    function createAndPositionFlowers() {
        if (!flowersScatterContainer || !messageElement || !flowerTemplate) {
            console.error("Elementos DOM necesarios no encontrados. No se pueden crear las flores.");
            return;
        }
        flowersScatterContainer.innerHTML = '';

        const { messageRect, flowerWidth, flowerHeight } = getElementDimensions();
        
        if (messageRect.width === 0 || messageRect.height === 0) {
            console.warn("Mensaje sin dimensiones válidas. Reintentando la creación de flores en breve.");
            setTimeout(createAndPositionFlowers, 500); 
            return;
        }

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

    function initialize() {
        createAndPositionFlowers();
    }
    
    initialize();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createAndPositionFlowers, 300);
    });
});