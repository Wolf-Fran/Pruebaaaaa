document.addEventListener('DOMContentLoaded', () => {
    const flowersScatterContainer = document.querySelector('.flowers-scatter-container');
    const flowerTemplate = document.querySelector('.flower-template');
    const messageElement = document.querySelector('.message');
    const numberOfFlowers = 500;

    // Obtener las dimensiones del mensaje para no superponer las flores sobre él
    const messageRect = messageElement.getBoundingClientRect();

    // Función para generar una posición aleatoria que evite el área del mensaje
    function getRandomPosition(flowerWidth, flowerHeight) {
        let x, y;
        let tries = 0;
        const maxTries = 100; // Evitar bucles infinitos

        do {
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

        // Si no se encuentra una posición sin superposición, se devuelve una posición predeterminada
        return { x: Math.random() * (window.innerWidth - flowerWidth), y: Math.random() * (window.innerHeight - flowerHeight) };
    }


    for (let i = 0; i < numberOfFlowers; i++) {
        const flower = flowerTemplate.cloneNode(true); // Clonar la imagen base
        flower.classList.remove('flower-template'); // Quitar la clase de plantilla
        flower.classList.add('scattered-flower'); // Añadir la clase para el CSS
        flower.style.display = 'block'; // Hacerla visible

        // Obtener dimensiones de la flor clonada para el cálculo de posición
        // Asumimos que width del CSS ya está aplicado (100px)
        const flowerWidth = 100;
        const flowerHeight = 100; // Asumir altura similar

        const { x, y } = getRandomPosition(flowerWidth, flowerHeight);
        flower.style.left = `${x}px`;
        flower.style.top = `${y}px`;

        // Retraso para que la animación de "float" no sea idéntica en todas
        flower.style.animationDelay = `${Math.random() * 2}s`;
        flower.style.animationDuration = `${5 + Math.random() * 3}s`; // Variar duración

        // Opcional: Rotación aleatoria inicial
        flower.style.transform = `rotate(${Math.random() * 360}deg)`;


        flowersScatterContainer.appendChild(flower);
    }
});