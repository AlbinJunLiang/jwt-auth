import sum from "../../src/services/math.service";

test('La suma es correcta', () => {
    expect(sum(2, 4)).toBe(6);
})