document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 300;

    // Función para obtener las dimensiones actuales del mensaje y de una flor de muestra
    function getElementDimensions() {
        const messageRect = messageElement.getBoundingClientRect();

        // Para obtener el tamaño real de la flor, la clonamos temporalmente
        // la añadimos al DOM, obtenemos su tamaño y luego la removemos.
        const tempFlower = flowerTemplate.cloneNode(true);
        tempFlower.style.display = 'block'; // Aseguramos que sea visible para calcular el tamaño
        tempFlower.style.visibility = 'hidden'; // Pero invisible para el usuario
        tempFlower.style.position = 'absolute'; // Necesario para que no afecte el layout
        flowersScatterContainer.appendChild(tempFlower);
        const flowerWidth = tempFlower.offsetWidth;
        const flowerHeight = tempFlower.offsetHeight;
        flowersScatterContainer.removeChild(tempFlower);

        return { messageRect, flowerWidth, flowerHeight };
    }


    // Función para generar una posición aleatoria que evite el área del mensaje
    function getRandomPosition(messageRect, flowerWidth, flowerHeight) {
        let x, y;
        let tries = 0;
        const maxTries = 200; // Aumentar intentos por si hay menos espacio

        do {
            // Generar posición dentro de las dimensiones actuales de la ventana
            x = Math.random() * (window.innerWidth - flowerWidth);
            y = Math.random() * (window.innerHeight - flowerHeight);
            tries++;

            // Verificar si la posición de la flor se superpone con el mensaje
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

        // Si no se encuentra una posición sin superposición, se devuelve una posición aleatoria general
        // O podrías decidir no añadir la flor si el espacio es demasiado pequeño
        console.warn('No se pudo encontrar una posición sin superposición para una flor. Podría haber superposición.');
        return { x: Math.random() * (window.innerWidth - flowerWidth), y: Math.random() * (window.innerHeight - flowerHeight) };
    }

    // Función para crear y posicionar todas las flores
    function createAndPositionFlowers() {
        // Limpiar flores existentes si ya las hay (útil si se llama en resize)
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

    // Crear las flores cuando la página carga
    createAndPositionFlowers();

    // Opcional: Reposicionar las flores cuando se redimensiona la ventana
    // Esto es importante para que se adapten al cambio de tamaño de pantalla
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(createAndPositionFlowers, 200); // Retraso para no ejecutarlo constantemente
    });
});