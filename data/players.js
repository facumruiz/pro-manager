export const mockPlayers = [
  {
    _id: "p01",
    datosPersonales: { nombre: "Rodrigo", apellido: "Muñoz", fechaNacimiento: "1997-03-12", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "GK", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.88, peso: 83 },
    atributos: { tecnico: { control: true, pases: true }, fisico: { agilidad: true, velocidad: false, fuerza: true, resistencia: true }, mental: { comunicacion: true, liderazgo: false, anticipacion: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p02",
    datosPersonales: { nombre: "Sebastián", apellido: "Vera", fechaNacimiento: "1999-07-22", primeraNacionalidad: "Argentina", idiomas: ["Español", "Inglés"] },
    perfilFutbolistico: { posicionNatural: "RB", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.78, peso: 74 },
    atributos: { tecnico: { centros: true, marcaje: true, entradas: true }, fisico: { velocidad: true, resistencia: true, fuerza: false }, mental: { anticipacion: true, decisiones: true, sacrificio: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p03",
    datosPersonales: { nombre: "Lucas", apellido: "Ferreyra", fechaNacimiento: "1996-01-15", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CB", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.85, peso: 82 },
    atributos: { tecnico: { cabeceo: true, entradas: true, marcaje: true }, fisico: { fuerza: true, alcanceDeSalto: true, resistencia: true }, mental: { liderazgo: true, anticipacion: true, comunicacion: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p04",
    datosPersonales: { nombre: "Matías", apellido: "Gómez", fechaNacimiento: "1995-09-08", primeraNacionalidad: "Uruguay", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CB", perfilHabil: "Izquierdo", estado: "Titular" },
    fisico: { altura: 1.83, peso: 79 },
    atributos: { tecnico: { cabeceo: true, entradas: true, pases: true }, fisico: { fuerza: true, alcanceDeSalto: true, equilibrio: true }, mental: { anticipacion: true, decisiones: true, valentia: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p05",
    datosPersonales: { nombre: "Diego", apellido: "Salinas", fechaNacimiento: "2000-04-30", primeraNacionalidad: "Chile", idiomas: ["Español", "Inglés"] },
    perfilFutbolistico: { posicionNatural: "LB", perfilHabil: "Izquierdo", estado: "Titular" },
    fisico: { altura: 1.75, peso: 70 },
    atributos: { tecnico: { centros: true, regate: true, marcaje: false }, fisico: { velocidad: true, aceleracion: true, resistencia: true }, mental: { desmarques: true, sacrificio: true, vision: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p06",
    datosPersonales: { nombre: "Nicolás", apellido: "Bravo", fechaNacimiento: "1998-11-03", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CDM", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.80, peso: 76 },
    atributos: { tecnico: { entradas: true, marcaje: true, pases: true, control: true }, fisico: { fuerza: true, resistencia: true, equilibrio: true }, mental: { anticipacion: true, decisiones: true, sacrificio: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p07",
    datosPersonales: { nombre: "Ezequiel", apellido: "Torres", fechaNacimiento: "1997-06-18", primeraNacionalidad: "Argentina", idiomas: ["Español", "Italiano"] },
    perfilFutbolistico: { posicionNatural: "CM", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.77, peso: 72 },
    atributos: { tecnico: { pases: true, control: true, tecnica: true, regate: true }, fisico: { resistencia: true, agilidad: true, velocidad: false }, mental: { vision: true, decisiones: true, juegoEnEquipo: true } },
    contrato: { clubActual: "Pro Manager FC", fichajoPrioritario: false }
  },
  {
    _id: "p08",
    datosPersonales: { nombre: "Facundo", apellido: "Ríos", fechaNacimiento: "2001-02-14", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CM", perfilHabil: "Ambidiestro", estado: "Titular" },
    fisico: { altura: 1.76, peso: 71 },
    atributos: { tecnico: { pases: true, tecnica: true, tirosLejanos: true }, fisico: { resistencia: true, velocidad: true, aceleracion: true }, mental: { vision: true, determinacion: true, talento: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p09",
    datosPersonales: { nombre: "Bruno", apellido: "Medina", fechaNacimiento: "1999-08-25", primeraNacionalidad: "Paraguay", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CAM", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.74, peso: 68 },
    atributos: { tecnico: { regate: true, tecnica: true, pases: true, remate: true }, fisico: { agilidad: true, aceleracion: true, velocidad: true }, mental: { vision: true, talento: true, decisiones: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p10",
    datosPersonales: { nombre: "Ariel", apellido: "Castillo", fechaNacimiento: "1996-12-01", primeraNacionalidad: "Bolivia", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "ST", perfilHabil: "Derecho", estado: "Titular" },
    fisico: { altura: 1.81, peso: 77 },
    atributos: { tecnico: { remate: true, cabeceo: true, regate: true, control: true }, fisico: { velocidad: true, fuerza: true, aceleracion: true }, mental: { desmarques: true, determinacion: true, valentia: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p11",
    datosPersonales: { nombre: "Tomás", apellido: "Herrera", fechaNacimiento: "1998-05-17", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "ST", perfilHabil: "Izquierdo", estado: "Titular" },
    fisico: { altura: 1.79, peso: 75 },
    atributos: { tecnico: { remate: true, tirosLejanos: true, control: true }, fisico: { velocidad: true, aceleracion: true, agilidad: true }, mental: { determinacion: true, desmarques: true, talento: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p12",
    datosPersonales: { nombre: "Mariano", apellido: "Paz", fechaNacimiento: "2002-10-09", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "GK", perfilHabil: "Derecho", estado: "Suplente" },
    fisico: { altura: 1.90, peso: 86 },
    atributos: { tecnico: { control: false, pases: true }, fisico: { agilidad: true, fuerza: true, velocidad: false, resistencia: true }, mental: { comunicacion: false, liderazgo: false, anticipacion: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p13",
    datosPersonales: { nombre: "Leandro", apellido: "Vega", fechaNacimiento: "2001-03-28", primeraNacionalidad: "Argentina", idiomas: ["Español", "Inglés"] },
    perfilFutbolistico: { posicionNatural: "RB", perfilHabil: "Derecho", estado: "Suplente" },
    fisico: { altura: 1.77, peso: 73 },
    atributos: { tecnico: { centros: false, marcaje: true, entradas: true }, fisico: { velocidad: true, resistencia: true, fuerza: false }, mental: { anticipacion: true, decisiones: false, sacrificio: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p14",
    datosPersonales: { nombre: "Maximiliano", apellido: "Quiroga", fechaNacimiento: "1997-07-11", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CB", perfilHabil: "Derecho", estado: "Suplente" },
    fisico: { altura: 1.84, peso: 80 },
    atributos: { tecnico: { cabeceo: true, entradas: true, marcaje: false }, fisico: { fuerza: true, alcanceDeSalto: true, resistencia: false }, mental: { liderazgo: false, anticipacion: true, comunicacion: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p15",
    datosPersonales: { nombre: "Ignacio", apellido: "Suárez", fechaNacimiento: "2000-09-04", primeraNacionalidad: "Colombia", idiomas: ["Español", "Inglés"] },
    perfilFutbolistico: { posicionNatural: "LM", perfilHabil: "Izquierdo", estado: "Suplente" },
    fisico: { altura: 1.73, peso: 67 },
    atributos: { tecnico: { centros: true, regate: true, tecnica: true }, fisico: { velocidad: true, aceleracion: true, agilidad: true }, mental: { desmarques: true, vision: true, talento: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p16",
    datosPersonales: { nombre: "Andrés", apellido: "Molina", fechaNacimiento: "1998-01-20", primeraNacionalidad: "Venezuela", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "RM", perfilHabil: "Derecho", estado: "Suplente" },
    fisico: { altura: 1.76, peso: 70 },
    atributos: { tecnico: { centros: true, regate: true, tecnica: false }, fisico: { velocidad: true, aceleracion: true, resistencia: true }, mental: { desmarques: false, vision: true, talento: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p17",
    datosPersonales: { nombre: "Pablo", apellido: "Soto", fechaNacimiento: "1999-06-07", primeraNacionalidad: "Chile", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CM", perfilHabil: "Derecho", estado: "Suplente" },
    fisico: { altura: 1.79, peso: 74 },
    atributos: { tecnico: { pases: true, control: true, tecnica: false }, fisico: { resistencia: true, agilidad: false, velocidad: false }, mental: { vision: false, decisiones: true, juegoEnEquipo: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p18",
    datosPersonales: { nombre: "Cristian", apellido: "Ramos", fechaNacimiento: "1996-11-14", primeraNacionalidad: "Perú", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "ST", perfilHabil: "Ambidiestro", estado: "Suplente" },
    fisico: { altura: 1.80, peso: 76 },
    atributos: { tecnico: { remate: true, cabeceo: false, regate: true }, fisico: { velocidad: true, fuerza: false, aceleracion: true }, mental: { desmarques: true, determinacion: true, valentia: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: true }
  },
  {
    _id: "p19",
    datosPersonales: { nombre: "Jorge", apellido: "Espinoza", fechaNacimiento: "2001-08-02", primeraNacionalidad: "Ecuador", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CAM", perfilHabil: "Izquierdo", estado: "Suplente" },
    fisico: { altura: 1.75, peso: 69 },
    atributos: { tecnico: { regate: true, tecnica: true, pases: false }, fisico: { agilidad: true, aceleracion: false, velocidad: true }, mental: { vision: true, talento: true, decisiones: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p20",
    datosPersonales: { nombre: "Ramiro", apellido: "Flores", fechaNacimiento: "2003-02-19", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CB", perfilHabil: "Derecho", estado: "Preseleccionado" },
    fisico: { altura: 1.82, peso: 78 },
    atributos: { tecnico: { cabeceo: false, entradas: true, marcaje: false }, fisico: { fuerza: true, alcanceDeSalto: false, resistencia: false }, mental: { anticipacion: false, decisiones: false, valentia: true } },
    contrato: { clubActual: "Libre", fichajePrioritario: true }
  },
  {
    _id: "p21",
    datosPersonales: { nombre: "Kevin", apellido: "Núñez", fechaNacimiento: "2002-05-23", primeraNacionalidad: "Argentina", idiomas: ["Español", "Inglés"] },
    perfilFutbolistico: { posicionNatural: "LM", perfilHabil: "Izquierdo", estado: "Preseleccionado" },
    fisico: { altura: 1.74, peso: 68 },
    atributos: { tecnico: { centros: false, regate: true, tecnica: true }, fisico: { velocidad: true, aceleracion: true, agilidad: false }, mental: { desmarques: true, vision: false, talento: true } },
    contrato: { clubActual: "Libre", fichajePrioritario: true }
  },
  {
    _id: "p22",
    datosPersonales: { nombre: "Valentín", apellido: "Cruz", fechaNacimiento: "2003-09-30", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "CDM", perfilHabil: "Derecho", estado: "Preseleccionado" },
    fisico: { altura: 1.81, peso: 77 },
    atributos: { tecnico: { entradas: true, marcaje: false, pases: true }, fisico: { fuerza: false, resistencia: true, equilibrio: false }, mental: { anticipacion: true, decisiones: false, sacrificio: true } },
    contrato: { clubActual: "Libre", fichajePrioritario: false }
  },
  {
    _id: "p23",
    datosPersonales: { nombre: "Hernán", apellido: "Ibáñez", fechaNacimiento: "1994-04-06", primeraNacionalidad: "Argentina", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "ST", perfilHabil: "Derecho", estado: "Lesionado" },
    fisico: { altura: 1.82, peso: 78 },
    atributos: { tecnico: { remate: true, cabeceo: true, regate: false }, fisico: { velocidad: false, fuerza: true, aceleracion: false }, mental: { desmarques: true, determinacion: true, valentia: true } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p24",
    datosPersonales: { nombre: "Gabriel", apellido: "Rojas", fechaNacimiento: "2000-12-15", primeraNacionalidad: "Uruguay", idiomas: ["Español"] },
    perfilFutbolistico: { posicionNatural: "RB", perfilHabil: "Derecho", estado: "Suspendido" },
    fisico: { altura: 1.77, peso: 72 },
    atributos: { tecnico: { centros: true, marcaje: false, entradas: true }, fisico: { velocidad: false, resistencia: true, fuerza: false }, mental: { anticipacion: false, decisiones: true, sacrificio: false } },
    contrato: { clubActual: "Pro Manager FC", fichajePrioritario: false }
  },
  {
    _id: "p25",
    datosPersonales: { nombre: "Sergio", apellido: "Domínguez", fechaNacimiento: "1993-07-28", primeraNacionalidad: "Brasil", idiomas: ["Español", "Portugués"] },
    perfilFutbolistico: { posicionNatural: "CM", perfilHabil: "Ambidiestro", estado: "Desafectado" },
    fisico: { altura: 1.78, peso: 73 },
    atributos: { tecnico: { pases: true, tecnica: true, tirosLejanos: false }, fisico: { resistencia: false, agilidad: true, velocidad: false }, mental: { vision: true, decisiones: true, juegoEnEquipo: false } },
    contrato: { clubActual: "Libre", fichajoPrioritario: false }
  }
];
