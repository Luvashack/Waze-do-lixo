// 🔥 CONFIG
const url = "https://iyydygckanaydzbjkjwr.supabase.co/rest/v1/container";
const apiKey = "SUA_API_KEY_PUBLICA_AQUI";

// 🗺️ Criar mapa
const map = L.map('map').setView([-23.47, -47.44], 13);

// Camada do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  .addTo(map);

// 📦 Função para carregar lixeiras
async function carregarLixeiras() {
  const res = await fetch(url, {
    headers: {
      "apikey": apiKey,
      "Authorization": "Bearer " + apiKey
    }
  });

  const data = await res.json();

  data.forEach(lixeira => {

    if (!lixeira.latitude || !lixeira.longitude) return;

    let cor, texto;

    if (lixeira.status === true) {
      cor = "red";
      texto = "Cheio 🔴";
    } else {
      cor = "green";
      texto = "Vazio 🟢";
    }

    const marker = L.circleMarker(
      [lixeira.latitude, lixeira.longitude],
      {
        radius: 10,
        color: cor,
        fillColor: cor,
        fillOpacity: 0.7
      }
    ).addTo(map);

    marker.bindPopup(
      `<b>${lixeira["endereço"]}</b><br>${texto}`
    );
  });
}

// 🔄 Atualização automática
setInterval(() => {

  // limpa os marcadores antigos
  map.eachLayer(layer => {
    if (layer instanceof L.CircleMarker) {
      map.removeLayer(layer);
    }
  });

  carregarLixeiras();

}, 5000);

// primeira carga
carregarLixeiras();