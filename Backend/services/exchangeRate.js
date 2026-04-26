const API_KEY = process.env.EXCHANGE_API_KEY;

const tipoCambioUSD = async (base = "USD") => {
  try {
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al consultar el tipo de cambio del dolar.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error al consultar el tipo de cambio del dolar:", error);
    throw error;
  }
};

const getUltimosDias = (dias = 7) => {
  const hoy = new Date();
  const inicio = new Date();
  inicio.setDate(hoy.getDate() - (dias - 1));

  const fmt = (d) => d.toISOString().split("T")[0];
  return { desde: fmt(inicio), hasta: fmt(hoy) };
};

const tipoCambioHistorico = async (base = "USD", dias = 7) => {
  const { desde, hasta } = getUltimosDias(dias);

  const url = `https://api.frankfurter.app/${desde}..${hasta}?from=${base}&to=MXN,EUR`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Error al consultar historial de frankfurter");

  const data = await res.json();

  const historial = Object.entries(data.rates)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, tasas]) => ({
      fecha,
      mxn: parseFloat(tasas.MXN?.toFixed(4)),
      eur: tasas.EUR ? parseFloat(tasas.EUR.toFixed(4)) : null,
      eurToMxn: tasas.EUR
        ? parseFloat((tasas.MXN / tasas.EUR).toFixed(4))
        : null,
    }));

  return historial;
};

export default { tipoCambioUSD, tipoCambioHistorico };
