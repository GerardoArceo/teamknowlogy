const express = require('express');
const fs = require('fs');

const app = express();



// ====================================================================================
// FUNCIÓN: Obtiene el archivo histórico de consultas de ADN, cuenta el total de mutaciones,
// de no mutaciones y el ratio entre los totales
// SALIDA:
// Devuelve un JSON con el total de mutaciones, de no mutaciones y el ratio
// ====================================================================================
function getStats() {
    let mutations = 0;
    let noMutations = 0;

    let rawdata = fs.readFileSync('server/docs/dna.json');
    let array = JSON.parse(rawdata);
    for (const a of array) {
        if (a.mutation) mutations++;
        else noMutations++;
    }

    let ratio = 0;
    if (noMutations > 0)
        ratio = mutations / noMutations;

    return {
        count_mutations: mutations,
        count_no_mutation: noMutations,
        ratio
    };
}



// ====================================================================================
// RETORNO:
// Devuelve un HTTP 200-OK y un JSON con las estadísticas de las consultas de mutaciones de ADN
// ====================================================================================
app.use('/stats', async(req, res) => {
    stats = getStats();
    res.json(stats);
});

module.exports = {
    getStats,
    app
};