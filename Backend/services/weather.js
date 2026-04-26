const API_KEY = process.env.OPENWEATHER_API_KEY;

const getWeather = async (ciudad = "Chihuahua") => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al obtener el clima");
    }
    const data = await response.json();
    return {
      ciudad: data.name,
      pais: data.sys.country, // "MX"
      temperatura: parseFloat(data.main.temp.toFixed(1)), // 24.3
      sensacion: parseFloat(data.main.feels_like.toFixed(1)), // 22.1
      minima: parseFloat(data.main.temp_min.toFixed(1)),
      maxima: parseFloat(data.main.temp_max.toFixed(1)),
      humedad: data.main.humidity, // 45 (%)
      descripcion: data.weather[0].description, // "cielo claro"
      icono: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };
  } catch (error) {
    console.error("Error al obtener el clima:", error);
    throw error;
  }
};
export default { getWeather };
