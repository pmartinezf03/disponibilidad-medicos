// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAW6cQKfiK9dMI_Vp9ZQUtZ0j-96RFwv2w",
    authDomain: "disponibilidad-medicos.firebaseapp.com",
    projectId: "disponibilidad-medicos",
    storageBucket: "disponibilidad-medicos.firebasestorage.app",
    messagingSenderId: "844137012998",
    appId: "1:844137012998:web:e74735bdedfe48d2ad0887",
    measurementId: "G-BYFC4M12QY"
};

// Inicializar Firebase y Firestore
try {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase inicializado correctamente.");
} catch (error) {
    console.error("Error al inicializar Firebase:", error);
}
const db = firebase.firestore();

// Cargar lista de municipios en el select
async function cargarMunicipios() {
    const municipioSelect = document.getElementById('municipioSelect');

    try {
        console.log("Cargando lista de municipios...");
        const ayuntamientosSnapshot = await db.collection("Ayuntamientos").get();

        ayuntamientosSnapshot.forEach((doc) => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.id;
            municipioSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los municipios: ", error);
    }
}

// Función para mostrar los datos del municipio seleccionado
async function mostrarMunicipio() {
    const municipioNombre = document.getElementById('municipioSelect').value;
    if (!municipioNombre) return alert("Por favor, selecciona un municipio.");

    const contenedorMunicipios = document.getElementById('contenedor-municipios');
    contenedorMunicipios.innerHTML = ''; // Limpiar el contenedor

    try {
        const municipioSection = document.createElement('section');
        municipioSection.innerHTML = `<h2>${municipioNombre}</h2>`;
        
        const tipos = ["Medic@", "Enfermer@"];
        
        for (const tipo of tipos) {
            const tipoCollectionRef = db.collection("Ayuntamientos").doc(municipioNombre).collection(tipo);
            const tipoSnapshot = await tipoCollectionRef.get();

            if (!tipoSnapshot.empty) {
                const tipoSection = document.createElement('div');
                tipoSection.innerHTML = `<h3>${tipo}</h3>`;
                
                tipoSnapshot.forEach((doc) => {
                    const data = doc.data();
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${data.nombre || "Sin nombre"}</strong><br>
                        Horario: ${data.horario || "No disponible"}<br>
                        Contacto: <a href="tel:${data.contacto}">${data.contacto || "No disponible"}</a><br>
                        Disponibilidad: ${data.sin_medico ? "No disponible" : "Disponible"}
                    `;
                    tipoSection.appendChild(li);
                });

                municipioSection.appendChild(tipoSection);
            }
        }

        contenedorMunicipios.appendChild(municipioSection);
        contenedorMunicipios.style.display = 'block';
        document.getElementById('seleccion-municipio').style.display = 'none';
        document.getElementById('volver-btn').style.display = 'block';

    } catch (error) {
        console.error("Error al cargar los datos del municipio: ", error);
    }
}

// Función para volver a la selección de municipios
function volverASeleccion() {
    document.getElementById('contenedor-municipios').style.display = 'none';
    document.getElementById('seleccion-municipio').style.display = 'block';
    document.getElementById('volver-btn').style.display = 'none';
}

// Cargar los municipios en el select al cargar la página
document.addEventListener('DOMContentLoaded', cargarMunicipios);
