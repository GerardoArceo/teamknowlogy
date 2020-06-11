const { getStats } = require('../routes/stats');

// ====================================================================================
// getStats
// ====================================================================================

test("El archivo leído del servidor coincide con el formato esperado", () => {
    r = getStats();
    expect(r.count_mutations >= 0 && r.count_no_mutation >= 0 && r.ratio >= 0).toBe(true);
});