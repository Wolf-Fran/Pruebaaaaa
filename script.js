document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');

    // --- AJUSTE 1: Disminuir el número de flores ---
    // 100 flores suelen verse bien y son menos exigentes para el rendimiento móvil.
    // Puedes ajustar este número (ej. 150, 80) según cómo se vea y el rendimiento.
    const numberOfFlowers = 100; 

    function getElementDimensions() {
        // Asegúrate de que el mensaje tenga tiempo para renderizarse y tener un tamaño válido.
        // Si no tiene ancho/alto, podríamos retrasar un poco o usar valores predeterminados.
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
        const maxTries = 1000; // Aumentamos intentos ya que hay menos espacio válido

        // Ajustamos el padding a 0 para que puedan cubrir toda la pantalla
        const centralAreaPadding = 0;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let minX = centralAreaPadding;
        let maxX = viewportWidth - flowerWidth - centralAreaPadding;
        let minY = centralAreaPadding;
        let maxY = viewportHeight - flowerHeight - centralAreaPadding;

        if (maxX <= minX) {
            minX = 0;
            maxX = Math.max(0, viewportWidth - flowerWidth);
        }
        if (maxY <= minY) {
            minY = 0;
            maxY = Math.max(0, viewportHeight - flowerHeight);
        }

        do {
            x = minX + Math.random() * (maxX - minX);
            y = minY + Math.random() * (maxY - minY);
            tries++;

            // --- AJUSTE 2: Lógica mejorada para evitar el área del mensaje ---
            // Creamos un "margen de seguridad" alrededor del mensaje para que las flores no lo toquen.
            const messageMargin = 20; // Espacio extra alrededor del mensaje

            const messageLeft = messageRect.left - messageMargin;
            const messageRight = messageRect.right + messageMargin;
            const messageTop = messageRect.top - messageMargin;
            const messageBottom = messageRect.bottom + messageMargin;

            const overlapsWithMessage = (
                x < messageRight &&
                x + flowerWidth > messageLeft &&
                y < messageBottom &&
                y + flowerHeight > messageTop
            );
            // --- FIN DE AJUSTE 2 ---

            if (!overlapsWithMessage) {
                return { x, y };
            }

        } while (tries < maxTries);

        console.warn('No se pudo encontrar una posición sin superposición para una flor después de varios intentos. Se está forzando una posición, lo que puede causar superposición.');
        // Si no encuentra una posición sin superposición, se devuelve una dentro del rango general.
        // Si esto pasa a menudo, significa que hay demasiado poco espacio libre o muchas flores.
        return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    }


    function createAndPositionFlowers() {
        if (!flowersScatterContainer || !messageElement || !flowerTemplate) {
            console.error("Elementos DOM necesarios no encontrados. No se pueden crear las flores.");
            return;
        }
        flowersScatterContainer.innerHTML = '';

        const { messageRect, flowerWidth, flowerHeight } = getElementDimensions();
        
        // --- AJUSTE 3: Comprobación de dimensiones del mensaje ---
        // Si el mensaje no tiene ancho o alto, es un problema de renderizado.
        // En ese caso, podríamos reintentar o evitar que las flores se generen mal.
        if (messageRect.width === 0 || messageRect.height === 0) {
            console.warn("Mensaje sin dimensiones válidas. Reintentando la creación de flores en breve.");
            setTimeout(createAndPositionFlowers, 500); // Intenta de nuevo después de medio segundo
            return;
        }
        // --- FIN DE AJUSTE 3 ---

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

    // Usamos requestAnimationFrame para asegurar que el DOM esté lo más listo posible
    // Esto es más robusto que solo DOMContentLoaded en algunos escenarios
    function initialize() {
        // Asegurarse de que el mensaje ya esté visible y tenga sus dimensiones finales
        // forzando un redibujado inicial si es necesario.
        // Podríamos también usar un pequeño timeout aquí si el problema persiste.
        createAndPositionFlowers();
    }
    
    // Ejecutar la inicialización cuando el DOM esté cargado.
    initialize();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createAndPositionFlowers, 300);
    });
});