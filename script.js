function procesarAgenda() {
  const texto = document.getElementById("textoAgenda").value;
  
  // Obtener el nombre de la empleada (4 líneas después de "Lista desagrupada")
  const lineas = texto.split('\n');
  const indiceListaDesagrupada = lineas.findIndex(linea => linea.includes("Lista desagrupada"));
  const nombreEmpleada = lineas[indiceListaDesagrupada + 4] || "Empleada no encontrada";

  const dias = texto.split(
    /(?=Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)/g
  );
  let resultadoHTML = "";

  dias.forEach((dia) => {
    // Verificar si el día contiene información válida
    if (dia.trim()) {
      // Obtener el título del día
      const tituloMatch = dia.match(
        /(Lunes|Martes|Miércoles|Jueves|Viernes|Sábado|Domingo)[\s\S]*?2025/
      );

      if (tituloMatch) {
        const titulo = tituloMatch[0];

        // Dividir el día en servicios
        const servicios = dia
          .split(/\d{1,2}:\d{2}\n\d{1,2}:\d{2}/g) // Dividir por patrones de hora
          .filter(servicio => servicio.includes("Ver pago")); // Solo servicios con "Ver pago"

        if (servicios.length > 0) {
          resultadoHTML += `<div class="dia">`;
          // Agregar nombre de empleada centrado
          resultadoHTML += `<div class="empleada-nombre">${nombreEmpleada}</div>`;
          resultadoHTML += `<div class="dia-titulo">${titulo}:</div>`;
          
          // Objeto para contar servicios
          const conteoServicios = {};
          
          servicios.forEach((servicio) => {
            // Buscar el nombre del servicio (primera línea después de las horas)
            const lineas = servicio.split('\n');
            const nombreServicio = lineas.find(linea => 
              linea.trim() && 
              !linea.match(/^\d{1,2}:\d{2}$/) && 
              !linea.includes('Cliente:') && 
              !linea.includes('Ver pago') &&
              !linea.match(/^[A-Za-z]+$/) // Excluye líneas que solo contienen un nombre
            );
            
            if (nombreServicio) {
              // Quitar el emoji ✨️ y espacios extras
              const nombreLimpio = nombreServicio.replace(/✨️/g, '').trim();
              conteoServicios[nombreLimpio] = (conteoServicios[nombreLimpio] || 0) + 1;
            }
          });
          
          // Mostrar servicios agrupados con color si están repetidos
          Object.entries(conteoServicios).forEach(([servicio, cantidad]) => {
            const esRepetido = cantidad > 1;
            resultadoHTML += `<div class="servicio ${esRepetido ? 'repetido' : ''}">${servicio}${cantidad > 1 ? ` - ${cantidad}` : ''}</div>`;
          });
          
          // Mostrar total de servicios
          const totalServicios = Object.values(conteoServicios).reduce((a, b) => a + b, 0);
          resultadoHTML += `<div class="total">Total servicios: ${totalServicios}</div>`;
          
          resultadoHTML += `</div>`;
        }
      }
    }
  });

  document.getElementById("resultado").innerHTML = resultadoHTML;
}