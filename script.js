const SUPABASE_URL = "https://iyydygckanaydzbjkjwr.supabase.co/rest/v1/container?select=*";
const API_KEY = "sb_publishable_fHPmub9Khy8ZWhGEvYq7Fg_KPMwAlrC";

const map = L.map('map').setView([-23.47, -47.44], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

let markers = [];

// 🔄 Carregar containers
async function carregarContainers() {
  try {
    const response = await fetch(SUPABASE_URL, {
      method: "GET",
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${API_KEY}`,
        "Cache-Control": "no-cache"
      }
    });

    const data = await response.json();

    console.log("Dados do Supabase:", data); // 🔍 DEBUG

    // Remove markers antigos
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    data.forEach(c => {

      // 🔥 CORREÇÃO: trata boolean corretamente
      const cheio = (c.status === true || c.status == 1);
      const cor = cheio ? "red" : "green";

      const marker = L.circleMarker([c.latitude, c.longitude], {
        color: cor,
        radius: 10
      }).addTo(map);

      marker.bindPopup(`
        <b>${c.endereco}</b><br>
        Status: ${cheio ? "Cheio 🚨" : "Disponível ✅"}
      `);

      markers.push(marker);
    });

  } catch (err) {
    console.error("Erro ao carregar:", err);
  }
}

// 📍 Ir para localização do usuário
function irParaMinhaLocalizacao() {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    map.setView([lat, lng], 15);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup("Você está aqui 📍")
      .openPopup();
  });
}

// 🔄 Atualizar manual
function atualizarMapa() {
  carregarContainers();
}

// 🔁 Auto atualização (mais rápido)
setInterval(carregarContainers, 3000);

// 🚀 Inicialização
carregarContainers();