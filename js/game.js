async function fetchApiData() {
    try {
        const response = await fetch('https://web-production-55103.up.railway.app/Racism');
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }
        const data = await response.json();
        
        document.getElementById('image').src = data.Imagen;
        document.getElementById('frase').textContent = data.frase;
        
        const respuestasList = document.getElementById('respuestas');
        respuestasList.innerHTML = '';
        
        const respuestasAleatorias = shuffleArray(data.Respuestas);
        
        respuestasAleatorias.forEach(respuesta => {
            const li = document.createElement('li');
            li.textContent = respuesta;
            li.addEventListener('click', () => {
                if (respuesta === data.respuestaOK) {
                    li.style.backgroundColor = 'green';
                    toggleRefrescarButton(true);
                    document.querySelectorAll('#respuestas li').forEach(respuesta => {
                        respuesta.style.pointerEvents = 'none';
                    });
                    playCorrectSound();
                } else {
                    li.style.backgroundColor = 'red';
                }
            });
            respuestasList.appendChild(li);
        });

        const reflexionElement = document.getElementById('reflexion');
        reflexionElement.innerHTML = formatReflexion(data.Reflexion);

    } catch (error) {
        document.getElementById('frase').textContent = `Error: ${error.message}`;
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function formatReflexion(reflexion) {
    const words = reflexion.split(' ');
    const maxWordsPerLine = 13;
    let formattedText = '';

    for (let i = 0; i < words.length; i += maxWordsPerLine) {
        formattedText += words.slice(i, i + maxWordsPerLine).join(' ') + '<br>';
    }

    return formattedText;
}

function toggleRefrescarButton(show) {
    const refreshButton = document.getElementById('refreshButton');
    const reflexionElement = document.getElementById('reflexion');
    if (show) {
        refreshButton.style.display = 'block';
        reflexionElement.style.display = 'block';
    } else {
        refreshButton.style.display = 'none';
        reflexionElement.style.display = 'none';
    }
}

fetchApiData();

document.getElementById('refreshButton').addEventListener('click', () => {
    fetchApiData();
    toggleRefrescarButton(false);
    document.querySelectorAll('#respuestas li').forEach(respuesta => {
        respuesta.style.pointerEvents = 'auto';
        respuesta.style.backgroundColor = '';
    });
});
