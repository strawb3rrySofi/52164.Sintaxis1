import AnalizadorVisitor from "./generated/AnalizadorVisitor.js";

export class CustomJavaScriptGeneratorVisitor extends AnalizadorVisitor {
    constructor() {
        super();
        this.output = [];
        this.indent = "";
    }

    visitPrograma(ctx) {
        for (let instr of ctx.instruccion()) {
            this.visit(instr);
        }
        return this.output.join("\n");
    }

    visitInstruccion(ctx) {
        return this.visit(ctx.conteo());
    }

    visitConteo(ctx) {
        const id = ctx.identificador().getText();
        const inicio = ctx.numero(0).getText();
        const fin = ctx.numero(1).getText();
        this.output.push(`${this.indent}for (let ${id} = ${inicio}; ${id} <= ${fin}; ${id}++) {`);
        const prevIndent = this.indent;
        this.indent += "    ";
        for (let sent of ctx.sentencia()) {
            this.visit(sent);
        }
        this.indent = prevIndent;
        this.output.push(`${this.indent}}`);
    }

    visitSentencia(ctx) {
        if (ctx.salida().length > 0) {
            for (let salida of ctx.salida()) {
                this.visit(salida);
            }
        } else if (ctx.terminar()) {
            this.visit(ctx.terminar());
        }
    }

    visitSalida(ctx) {
        const texto = ctx.CADENA().getText();
        this.output.push(`${this.indent}console.log(${texto});`);
    }

    visitTerminar(ctx) {
        this.output.push(`${this.indent}break;`);
    }
}

export class CustomJavaGeneratorVisitor extends AnalizadorVisitor {
    constructor() {
        super();
        this.output = [];
        this.indent = "";
    }

    visitPrograma(ctx) {
        this.output.push("public class Ejemplo {");
        this.indent = "    ";
        this.output.push(`${this.indent}public static void main(String[] args) {`);
        const prevIndent = this.indent;
        this.indent += "    ";
        for (let instr of ctx.instruccion()) {
            this.visit(instr);
        }
        this.indent = prevIndent;
        this.output.push(`${this.indent}}`);
        this.output.push("}");
        return this.output.join("\n");
    }

    visitInstruccion(ctx) {
        return this.visit(ctx.conteo());
    }

    visitConteo(ctx) {
        const id = ctx.identificador().getText();
        const inicio = ctx.numero(0).getText();
        const fin = ctx.numero(1).getText();
        this.output.push(`${this.indent}for (int ${id} = ${inicio}; ${id} <= ${fin}; ${id}++) {`);
        const prevIndent = this.indent;
        this.indent += "    ";
        for (let sent of ctx.sentencia()) {
            this.visit(sent);
        }
        this.indent = prevIndent;
        this.output.push(`${this.indent}}`);
    }

    visitSentencia(ctx) {
        if (ctx.salida().length > 0) {
            for (let salida of ctx.salida()) {
                this.visit(salida);
            }
        } else if (ctx.terminar()) {
            this.visit(ctx.terminar());
        }
    }

    visitSalida(ctx) {
        const texto = ctx.CADENA().getText();
        const javaText = texto.replace(/^'(.*)'$/, '"$1"');
        this.output.push(`${this.indent}System.out.println(${javaText});`);
    }

    visitTerminar(ctx) {
        this.output.push(`${this.indent}break;`);
    }
}