import chi2gof from '@stdlib/stats-chi2gof';

export function isUniformlyDistributed(frequencies: number[]) {
    const chiSquareResult = chi2gof(
        frequencies,
        'discrete-uniform',
        0,
        frequencies.length - 1,
    );

    // console.log(frequencies);
    // console.log(chiSquareResult);

    return !chiSquareResult.rejected;
}
