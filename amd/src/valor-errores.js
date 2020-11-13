var valores = {
    "errorFuerzaEjercida": {
        "valores_base": [0.0, 1.0, 2.5, 3.5, 5.0],
        "factor_random": 0.5,
        "puede_ser_negativo": true
    },
    "errorFuerzaMedida": {
        "valores_base": [0.0, 1.0, 2.0, 3.0, 4.0],
        "factor_random": 0.2,
        "puede_ser_negativo": true
    },
    "errorAltura": {
        "valores_base": [0.0, 0.3, 0.7, 1.1, 1.5],
        "factor_random": 0.2,
        "puede_ser_negativo": true
    }
}

const INTENSIDADES = [
    "Ninguno",
    "Bajo",
    "Medio",
    "Alto"
];

function indiceIntensidad(intensidad) {
    let i = INTENSIDADES.findIndex((e) => e == intensidad);
    if (i < 0) {
        i = Math.floor(Math.random() * 4); // Entero entre 0 y 3 inclusives;
    }
    return i;
}

export function getError(tipo, intensidad) {
    let ind = indiceIntensidad(intensidad);
    let error = valores[tipo]
    let variacion = Math.random() *
        error.factor_random * 2 - error.factor_random; //+- factor
    let signo = 1;
    if (error.puede_ser_negativo && Math.random() < 0.5) {
        signo = -1;
    }
    return signo * (error.valores_base[ind] + variacion);
}