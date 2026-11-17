export async function buscarCMEIs() {
  const resposta = await fetch(
    "http://localhost:3001/api/cmeis"
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar CMEIs");
  }

  return resposta.json();
}

export async function buscarDashboard() {
  const resposta = await fetch(
    "http://localhost:3001/api/dashboard"
  );

  if (!resposta.ok) {
    throw new Error("Erro ao buscar dashboard");
  }

  return resposta.json();
}