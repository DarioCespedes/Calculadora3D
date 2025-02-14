
function calcularCosto() {

    //// obtener valores de las variables de entrada
    let descripcionp = document.getElementById("descripcion").value;
    let horas = parseFloat(document.getElementById("horas").value);
    let kilos = parseFloat(document.getElementById("kilos").value);
    let tiempopro = parseFloat(document.getElementById("tiempo_produccion").value);
    let tiempopost = parseFloat(document.getElementById("tiempo_postproduccion").value);
    let cosdiseno = parseFloat(document.getElementById("costo_diseno").value);
    let costofilamento = parseFloat(document.getElementById("cfilamento").value);
    

                                    ////Calculos////

    

    //costo por hora de luz
    let consumoluz= 1000 // Modificar dependiendo del costo del KWatts
    let consumow= 0.450 // Modificar dependiendo del consumo de la impresora en Kwatts
    let costexhora= (consumoluz*consumow) * horas

    //coste filamento
    let costfilamento =  costofilamento * kilos
   
    ///Preproduccion
    let cosoperador = 8500 // Modificar dependiendo el valor de la hora del trabajo ( o de nuestro trabajo)
    let prepro = cosoperador * tiempopro

    /// Postproduccion
    let postpro = cosoperador * tiempopost

    /// Amortizacion = Horas * ((Coste de la impresora ) / (Dias activa al año * Horas activa al dia * Años de amortizacion))
    let amortizacion = ((2190000)/(200*8*1)) 
    let costamortizacion = horas * amortizacion

    /// Fallos
    let tfallo = 0.15 // Porcentaje por fallos de las impresiones, se puede modificar segun la necesidad
    let fallos = (costfilamento + costexhora + prepro + postpro + costamortizacion) * tfallo

    //Total de costos
    let total = (fallos + costamortizacion + costexhora + postpro + prepro + costfilamento) 

    //Valor con diseño, sin ganancia
    let disenoo = total + cosdiseno

    ///Valor final con ganancia 
    let totalfinal = disenoo + (disenoo*0.22)

    //// mostrar valores
    document.getElementById("rdescripcion").innerText = descripcionp;
    document.getElementById("costoelectricidad").innerText = "$ " + costexhora.toFixed(2);
    document.getElementById("prepro").innerText = "$ " + prepro.toFixed(2);
    document.getElementById("postpro").innerText = "$ " + postpro.toFixed(2);
    document.getElementById("amortizacion").innerText = "$ " + costamortizacion.toFixed(2);
    document.getElementById("fallos").innerText = "$ " + fallos.toFixed(2);
    document.getElementById("basica").innerText = "$ " + total.toFixed(2);
    document.getElementById("totalf").innerText = "$ " + totalfinal.toFixed(0);
    
    document.getElementById("formulario").style.display = "none";
    document.getElementById("resumen").style.display = "block";
}
function cerrarResumen() {
    document.getElementById("resumen").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

///Para ventas
function procesarVenta() {
    let descripcionp = document.getElementById("descripcion").value;
    let totalfinal = document.getElementById("totalf").innerText; 

    if (!descripcionp || totalfinal.trim() === "$ 0.00") {
        alert("Primero debes calcular el costo antes de procesar la venta.");
        return;
    }

    let fecha = new Date().toLocaleDateString();

    // Insertar valores en el recibo
    document.getElementById("recibo_descripcion").innerText = descripcionp;
    document.getElementById("recibo_total").innerText = totalfinal;
    document.getElementById("recibo_fecha").innerText = fecha;

    // Mostrar el recibo y ocultar el resumen y el formulario
    document.getElementById("formulario").style.display = "none";
    document.getElementById("resumen").style.display = "none";
    document.getElementById("recibo").style.display = "block";
    

    
}

// Función para cerrar el recibo y volver al formulario
function cerrarRecibo() {
    document.getElementById("recibo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

function generarPDF() {
    // Verifica si jsPDF está disponible
    if (typeof window.jspdf === "undefined") {
        alert("Error: jsPDF no está cargado correctamente.");
        return;
    }

    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();

    // Configuración de empresa
    let empresa = "NOMBRE DE LA EMPRESA";
    let telefono = "Tel: +1 1234567890";
    let correo = "contacto@correo.com";

    // Logo 
    let logoURL = "images/web.png"; 

    // Intentar cargar el logo
    let img = new Image();
    img.src = logoURL;
    img.onload = function () {
        doc.addImage(img, "PNG", 80, 10, 50, 20); // Ajusta la posición y tamaño

        // Nombre de la empresa
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(empresa, 105, 40, null, null, "center");

        // Contacto
        doc.setFontSize(10);
        doc.text(telefono, 105, 50, null, null, "center");
        doc.text(correo, 105, 55, null, null, "center");

        // Línea separadora
        doc.line(10, 60, 200, 60);

        // Fecha
        let fecha = new Date().toLocaleDateString();
        doc.setFontSize(12);
        doc.text("Fecha de venta: " + fecha, 10, 70);

        // Obtener valores asegurando que los elementos existen
        let descripcionElem = document.getElementById("rdescripcion");
        let precioFinalElem = document.getElementById("totalf");

        let descripcion = descripcionElem ? descripcionElem.innerText : "No disponible";
        let precioFinal = precioFinalElem ? precioFinalElem.innerText : "No disponible";

        // Tabla de productos
        let startY = 80;
        doc.setFontSize(12);
        doc.text("Descripción", 20, startY);
        doc.text("Cantidad", 100, startY);
        doc.text("Valor Final", 150, startY);

        doc.line(10, startY + 5, 200, startY + 5); // Línea separadora

        doc.text(descripcion, 20, startY + 15);
        doc.text("1", 110, startY + 15); // Cantidad (por defecto 1)
        doc.text(precioFinal, 150, startY + 15);

        // Línea separadora final
        doc.line(10, startY + 25, 200, startY + 25);

        // Mensaje final
        doc.setFontSize(14);
        doc.setFont("helvetica", "italic");
        doc.text("¡Muchas gracias por su compra!", 105, startY + 40, null, null, "center");

        // Guardar PDF
        doc.save("factura_venta.pdf");
    };

    img.onerror = function () {
        alert("Error al cargar el logo. Verifica la ruta.");
    };
}



