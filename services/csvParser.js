const csv = require('csv-parser');
const stream = require('stream');

exports.parseCSV = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];

        const readable = new stream.Readable();
        readable._read = () => {};
        readable.push(buffer);
        readable.push(null);

        readable
            .pipe(csv({
                separator: ';'
            }))
            .on('data', (row) => {
                const normalizado = {};

                Object.keys(row).forEach((k) => {
                    normalizado[k.trim()] = row[k];
                });

                if (!normalizado['_3']) return;
                if (normalizado['_3'] === 'Valor') return;

                results.push({
                    data: normalizado['Extrato Conta Corrente'],
                    descricao: normalizado['_2'],
                    valor: parseFloat(
                        normalizado['_3']
                        .replace('.', '')
                        .replace(',', '.')
                    )
                });
            })
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};