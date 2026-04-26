import weather from "../services/weather.js";

export const obtenerClima = async (req, res) => {
  try {
    const ciudad = req.query.ciudad || "Cuauhtemoc";
    const data = await weather.getWeather(ciudad);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
