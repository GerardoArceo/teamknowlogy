const express = require('express');
const { CORS } = require('../middlewares/access');
const fs = require('fs');

const app = express();

app.use(CORS);

const MUTATION_LIMIT = 1; // Se considera que una secuencia está mutada si tiene más de MUTATION_LIMIT mutaciones


// ====================================================================================
// FUNCIÓN: Valida a través de una expresión regular que todas las cadenas del arreglo contengan
// únicamente combinaciones de los caracteres A,C,T,G y que su longitud sea mayor a 0
// ENTRADA:
// * dna: es el arreglo que representa la secuencia de ADN
// SALIDA:
// Devuelve un valor booleano, true si es una secuencia válida y false si no lo es
// ====================================================================================
function validDna(dna) {
    if (!dna || dna.length == 0 || dna[0].length == 0) return false;
    for (const s of dna)
        if (/[^ACGT]/.test(s)) return false;
    return true;
}


// ====================================================================================
// FUNCIÓN: Determina cuántas mutaciones tiene una cadena, dónde una mutación es cada subcadena
// de longitud MAX=4 cuyos caracteres sean iguales, en caso de que el número de mutaciones ya
// haya excedido el MUTATION_LIMIT, se dejarán de contar mutaciones y se retornará el total.
// ENTRADA:
// * s: Es la cadena a evaluar
// * mutations: Es el número total de mutaciones que se han contado hasta el momento
// SALIDA:
// Devuelve el número total de mutaciones que se han contado hasta el momento
// ====================================================================================
function stringMutations(s, mutations) {
    const MAX = 4;
    if (s.length < MAX) return mutations;
    num = 1;
    for (let i = 0; i < s.length - 1; i++) {
        if (s[i] == s[i + 1]) {
            if (++num >= MAX)
                if (++mutations > MUTATION_LIMIT) return mutations;
        } else {
            num = 1;
        }
    }
    return mutations;
}


// ====================================================================================
// FUNCIÓN: Extrae todas las subcadenas que se forman en la diagonal de una matriz y las evalúa
// con la funcion stringMutations para actualizar el número total de mutaciones, en caso de que el 
// número de mutaciones ya haya excedido el MUTATION_LIMIT, se dejarán de contar mutaciones y se retornará el total.
// ENTRADA:
// * array: Es la matriz a evaluar
// * bottomToTop: Es una bandera booleana que determinará si se extraerán las diagonales de abajo hacia arriba o de arriba hacia abajo
// * mutations: Es el número total de mutaciones que se han contado hasta el momento
// SALIDA:
// Devuelve el número total de mutaciones que se han contado hasta el momento
// ====================================================================================
function diagonalStringMutations(array, bottomToTop, mutations) {
    let N = array.length;
    for (let k = 0; k <= 2 * (N - 1); ++k) {
        temp = [];
        for (let y = N - 1; y >= 0; --y) {
            let x = k - (bottomToTop ? N - y : y);
            if (x >= 0 && x < N)
                temp.push(array[y][x]);
        }
        string = temp.join('');
        mutations = stringMutations(string, mutations);
        if (mutations > MUTATION_LIMIT) return mutations;
    }
    return mutations;
}


// ====================================================================================
// FUNCIÓN: Determina si una secuencia de ADN está mutada, primero analiza las cadenas horizontales,
// luego las verticales y luego los 2 tipos de cadenas diagonales, en cada uno de esos pasos actualiza
// el contador de mutaciones y si al finalizar todavía es menor que el MUTATION_LIMIT, la secuencia NO está mutada
// ENTRADA:
// * dna: es el arreglo que representa la secuencia de ADN
// SALIDA:
// Devuelve una bandera booleana que indica si la secuencia de entrada está mutada o no
// ====================================================================================
function hasMutation(dna) {
    let mutations = 0;

    //Mutaciones en cadenas horizontales
    for (const string of dna) {
        mutations = stringMutations(string, mutations);
        if (mutations > MUTATION_LIMIT) return true;
    }

    //Mutaciones en cadenas verticales
    for (let i = 0; i < dna.length; i++) {
        string = dna.map((s) => s[i]).join('');
        mutations = stringMutations(string, mutations);
        if (mutations > MUTATION_LIMIT) return true;
    }

    //Mutaciones en cadenas oblicuas con inclinación positiva
    mutations = diagonalStringMutations(dna, false, mutations);
    if (mutations > MUTATION_LIMIT) return true;

    //Mutaciones en cadenas oblicuas con inclinación negativa
    mutations = diagonalStringMutations(dna, true, mutations);
    if (mutations > MUTATION_LIMIT) return true;

    return false;
}


// ====================================================================================
// FUNCIÓN: Actualiza el archivo histórico de las cadenas de ADN evaluadas
// ENTRADA:
// * dna: es el arreglo que representa la secuencia de ADN
// * mutation: es la bandera booleana que indica si la secuencia está mutada o no
// SALIDA:
// Devuelve el JSON actualizado con todas las consultas de mutaciones realizadas hasta el momento
// ====================================================================================
function updateData(dna, mutation) {
    let rawdata = fs.readFileSync('server/docs/dna.json');
    let json = JSON.parse(rawdata);
    json.push({
        dna,
        mutation,
    });
    fs.writeFileSync('server/docs/dna.json', JSON.stringify(json), (err) => {
        if (err) throw err;
    });
    console.log(json);
    return json;
}


// ====================================================================================
// PARÁMETROS:
// * dna: es el arreglo que representa la secuencia de ADN, vendrá en formato JSON 
// de la siguiente manera: {“dna”:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}
// RETORNO:
// Devuelve un estado 403-Forbidden si la secuencia fue inválida o NO tiene mutaciones,
// Devuelve un HTTP 200-OK y un JSON si la secuencia tiene mutaciones 
// ====================================================================================
app.use('/mutation', async(req, res) => {
    if (!req.body.dna && !req.query.dna) {
        return res.status(403).send({
            message: 'Empty DNA'
        });
    }

    dna = req.body.dna || JSON.parse(req.query.dna).dna;

    if (!validDna(dna)) {
        return res.status(403).send({
            message: 'Invalid DNA'
        });
    }

    mutation = hasMutation(dna);
    updateData(dna, mutation);

    if (!mutation)
        res.status(403);
    res.json(mutation);
});

module.exports = {
    validDna,
    stringMutations,
    diagonalStringMutations,
    hasMutation,
    updateData,
    app
};