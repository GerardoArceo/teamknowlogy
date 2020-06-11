const { validDna, stringMutations, diagonalStringMutations, hasMutation, updateData } = require('../routes/mutation');

// ====================================================================================
// validDna
// ====================================================================================

test("la secuencia ['A', 'C', 'G', 'T'] debe ser válida", () => {
    expect(validDna(['A', 'C', 'G', 'T'])).toBe(true);
});

test("la secuencia ['CCC', 'CCC', 'CCC'] debe ser válida", () => {
    expect(validDna(['CCC', 'CCC', 'CCC'])).toBe(true);
});

test("la secuencia ['GTTGAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'] debe ser válida", () => {
    expect(validDna(['GTTGAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'])).toBe(true);
});

test("la secuencia [' TTGAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'] debe ser inválida", () => {
    expect(validDna([' TTGAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'])).toBe(false);
});

test("la secuencia ['AASAAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'] debe ser inválida", () => {
    expect(validDna(['AASAAGG', 'AAAAAGG', 'TTTTTTT', 'AAAGGGT'])).toBe(false);
});

test("la secuencia ['', ''] debe ser inválida", () => {
    expect(validDna(['', ''])).toBe(false);
});



// ====================================================================================
// stringHasMutation
// ====================================================================================

test("la cadena 'ACGGGTAAAACGG' debe tener 1 mutación", () => {
    expect(stringMutations('ACGGGTAAAACGG', 0)).toBe(1);
});

test("la cadena 'AAAAGAAAAT' debe tener 2 mutaciones", () => {
    expect(stringMutations('AAAAGAAAAT', 0)).toBe(2);
});

test("la cadena 'AAAAACAAAAATTTT' debe tener 5 mutaciones pero se detendrá en 2", () => {
    expect(stringMutations('AAAAACAAAAATTTT', 0)).toBe(2);
});

test("la cadena 'AAAGGGCCCTTT' NO debe tener una mutación", () => {
    expect(stringMutations('AAAGGGCCCTTT', 0)).toBe(0);
});

test("la cadena 'ACGT' NO debe tener una mutación", () => {
    expect(stringMutations('ACGT', 0)).toBe(0);
});

test("la cadena 'GATTACAGATTACA' NO debe tener una mutación", () => {
    expect(stringMutations('GATTACAGATTACA', 0)).toBe(0);
});



// ====================================================================================
// diagonalStringMutations
// ====================================================================================

test('la secuencia debe tener 2 mutaciones en las subcadenas de sus diagonales con inclinación positiva', () => {
    expect(diagonalStringMutations([
        "AGTGC",
        "GTCAT",
        "CCATT",
        "AATGC",
        "ATTCG"
    ], false, 0)).toStrictEqual(2);
});

test('la secuencia debe tener 2 mutaciones en las subcadenas de sus diagonales con inclinación negativa', () => {
    expect(diagonalStringMutations([
        "AGTGC",
        "GTCAT",
        "CCATT",
        "AATGC",
        "ATTCG"
    ], true, 0)).toStrictEqual(0);
});



// ====================================================================================
// hasMutation
// ====================================================================================

test('la secuencia de ADN proporcionada NO está mutada', () => {
    expect(hasMutation([
        "ATGCGA",
        "CAGTGC",
        "TTATTT",
        "AGATGG",
        "GCGTCA",
        "TCACTG"
    ])).toBe(false);
});

test('la secuencia de ADN proporcionada SÍ está mutada', () => {
    expect(hasMutation([
        "ATGCGA",
        "CAGTGC",
        "TTATGT",
        "AGAAGG",
        "CCCCTA",
        "TCACTG"
    ])).toBe(true);
});

test('la secuencia de ADN proporcionada SÍ está mutada', () => {
    expect(hasMutation([
        "GGGGTGGGG",
        "CCCAAACCC",
        "GGGTTTGGG",
        "CCCAAACCC",
        "GGGTTTGGG",
        "CCCAAACCC",
        "GGGTTTGGG",
        "CCCAAACCC",
        "GGGTTTGGG"
    ])).toBe(true);
});