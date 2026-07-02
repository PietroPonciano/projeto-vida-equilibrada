const PDFDocument = require("pdfkit");
const fs = require("fs");

function formatCurrency(value) {
    return `R$ ${Number(value || 0).toFixed(2).replace(".", ",")}`;
}

async function createRelatorioPdf(res, ano, mes, user, relatorioData, chartPath) {
    const doc = new PDFDocument({
        margin: 45
    });

    const primaryColor = "#7ed957";
    const headerHeight = 85;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio_${ano}_${mes}.pdf`);

    doc.pipe(res);

    //  HEADER
    doc.rect(0, 0, doc.page.width, headerHeight).fill(primaryColor);

    doc.fillColor("black")
        .fontSize(26)
        .font("Helvetica-Bold")
        .text("Vida Equilibrada", 45, 28);

    doc.moveDown(4);

    //  TÍTULO
    doc.font("Helvetica-Bold").fontSize(18)
        .text(`Relatório Financeiro • ${mes}/${ano}`);

    doc.font("Helvetica").fontSize(12)
        .moveDown()
        .text(`Usuário: ${user.username}`)
        .text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`);

    doc.moveDown(2);

    // ============================
    //  RESUMO INTELIGENTE
    // ============================

    const total = relatorioData.total || 0;

    doc.font("Helvetica-Bold").fontSize(14)
        .text("Resumo Inteligente", {
            underline: true
        });

    doc.font("Helvetica").fontSize(12).moveDown();

    doc.text(`Total Gasto: ${formatCurrency(total)}`);
    doc.text(`Maior Categoria: ${relatorioData.maiorCategoria || "-"}`);
    doc.text(`Local com Maior Gasto: ${relatorioData.maiorLocal || "-"}`);

    doc.moveDown(1);

    // ============================
    //  TIPOS DE GASTO
    // ============================

    doc.font("Helvetica-Bold").text("Distribuição por Tipo");

    doc.font("Helvetica").moveDown(0.5);

    doc.text(`Recorrente: ${formatCurrency(relatorioData.recorrente)}`);
    doc.text(`Variável: ${formatCurrency(relatorioData.variavel)}`);
    doc.text(`Ocasional: ${formatCurrency(relatorioData.ocasional)}`);
    doc.text(`Sazonal: ${formatCurrency(relatorioData.sazonal)}`);

    doc.moveDown(2);

    // ============================
    //  ALERTA INTELIGENTE
    // ============================

    doc.font("Helvetica-Bold").text("Análise do Sistema");

    doc.moveDown(0.5);

    doc.font("Helvetica-Oblique")
        .fillColor("#333")
        .text(relatorioData.alerta || "Sem alertas no momento.");

    doc.fillColor("black");

    doc.moveDown(2);

    // ============================
    //  TABELA POR CATEGORIA
    // ============================

    if (relatorioData.categorias?.length) {

        const tableTop = doc.y;
        const rowHeight = 20;

        const col = {
            categoria: 50,
            total: 250,
            percentual: 400
        };

        // header
        doc.rect(col.categoria - 5, tableTop - 3, 500, rowHeight)
            .fill(primaryColor);

        doc.fillColor("black").font("Helvetica-Bold")
            .text("Categoria", col.categoria, tableTop)
            .text("Total", col.total, tableTop)
            .text("% do Total", col.percentual, tableTop);

        let currentY = tableTop + rowHeight;
        let zebra = false;

        relatorioData.categorias.forEach(g => {

            if (zebra) {
                doc.rect(col.categoria - 5, currentY - 3, 500, rowHeight)
                    .fill("#f5f5f5");
            }
            zebra = !zebra;

            doc.fillColor("black").font("Helvetica");

            doc.text(g.categoria, col.categoria, currentY);
            doc.text(formatCurrency(g.total), col.total, currentY);
            doc.text(`${g.percentual}%`, col.percentual, currentY);

            currentY += rowHeight;
        });

        doc.moveDown(2);
    }

    // ============================
    //  GRÁFICOS
    // ============================

    doc.addPage();

    doc.font("Helvetica-Bold")
        .fontSize(18)
        .text("Gráficos e Análises Visuais", {
            underline: true
        })
        .moveDown(2);

    if (chartPath && fs.existsSync(chartPath)) {
        doc.image(chartPath, {
            width: 460,
            align: "center",
        });
    } else {
        doc.fontSize(12).text("Nenhum gráfico disponível.", {
            align: "center",
        });
    }

    // ============================
    //  RODAPÉ
    // ============================

    doc.moveDown(3)
        .fontSize(10)
        .fillColor("gray")
        .text("Vida Equilibrada — Gestão Financeira Inteligente ©", {
            align: "center"
        });

    doc.end();
}

module.exports = {
    createRelatorioPdf
};