const SUPABASE_URL = "https://iyydygckanaydzbjkjwr.supabase.co/rest/v1/container";
const API_KEY = "COLOQUE_AQUI_SUA_ANON_KEY"; // NÃO usar a secret!

// Inicializa mapa
const map = L.map('map').setView([-23.47, -47.44], 14);

// Camada do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Função pra buscar dados
async function carregarContainers() {
  try {
    const response = await fetch(SUPABASE_URL, {
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`
      }
    });

    const data = await response.json();

    data.forEach(container => {
      const cor = container.status ? "red" : "green";

      const marker = L.circleMarker(
        [container.latitude, container.longitude],
        {
          color: cor,
          radius: 10
        }
      ).addTo(map);

      marker.bindPopup(`
        <b>${container.endereco}</b><br>
        Status: ${container.status ? "Cheio 🚨" : "Disponível ✅"}
      `);
    });

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

// Carregar ao iniciar
carregarContainers();