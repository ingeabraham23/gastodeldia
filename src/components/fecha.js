export function obtenerFechaFormateada() {
    const meses = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
  
    const diasSemana = [
      "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
    ];
  
    const obtenerFormato12Horas = (hora) => {
      const ampm = hora >= 12 ? "pm" : "am";
      const horas = hora % 12 || 12;
      return `${horas}:${new Date().getMinutes()} ${ampm}`;
    };
  
    const fecha = new Date();
    const diaSemana = diasSemana[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    const horaFormateada = obtenerFormato12Horas(fecha.getHours());
  
    return `${diaSemana} ${dia} de ${mes} de ${año} ${horaFormateada}`;
  }
  