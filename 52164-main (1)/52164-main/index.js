import antlr4 from "antlr4";
import { CharStreams, CommonTokenStream } from "antlr4";
import AnalizadorLexer from "./generated/AnalizadorLexer.js";
import AnalizadorParser from "./generated/AnalizadorParser.js";
import readline from "readline";
import fs from "fs";
import { execSync } from "child_process";
import { CustomJavaScriptGeneratorVisitor } from "./CustomCalculatorVisitor.js";

// Variables para saber si hubo errores
let huboErrores = false;
let huboErrorLexico = false;
const lexerErrors = [];
const parserErrors = [];

// Listener personalizado para recolectar errores
class MyErrorListener extends antlr4.error.ErrorListener {
    constructor(esLexer, collector) {
        super();
        this.esLexer = esLexer;
        this.collector = collector;
    }

    syntaxError(recognizer, offendingSymbol, line, column, msg, e) {
        const errorMessage = this.esLexer
            ? `[ERROR LÉXICO] Línea ${line}, columna ${column}: ${msg}`
            : `[ERROR SINTÁCTICO] Línea ${line}, columna ${column}: ${msg}`;

        this.collector.push(errorMessage);
        if (this.esLexer) {
            huboErrorLexico = true;
        }
        huboErrores = true;
    }
}

async function main() {
    let input;

    // Intentar leer el archivo de entrada
    try {
        input = fs.readFileSync('input.txt', 'utf8');
    } catch (err) {
        // Si no existe, pedir por teclado
        input = await leerCadena();
        console.log(input);
    }

    // Crear el lexer y obtener todos los tokens
    let inputStream = CharStreams.fromString(input);
    let lexer = new AnalizadorLexer(inputStream);

    // Agregar listener de errores al lexer
    lexer.removeErrorListeners();
    lexer.addErrorListener(new MyErrorListener(true, lexerErrors));

    console.log("Verificando tokens generados por el lexer...");
    const tokens = lexer.getAllTokens();
    if (tokens.length === 0) {
        console.error("No se generaron tokens. Verifica la entrada y la gramática.");
        return;
    }

    // Mostrar la tabla de tokens y lexemas
    console.log("\nTabla de Tokens y Lexemas:");
    console.log("--------------------------------------------------");
    console.log("| Lexema         | Token                         |");
    console.log("--------------------------------------------------");
    for (let token of tokens) {
        const tokenType = AnalizadorLexer.symbolicNames[token.type] || `UNKNOWN (${token.type})`;
        const lexema = token.text;
        console.log(`| ${lexema.padEnd(14)} | ${tokenType.padEnd(30)}|`);
    }
    console.log("--------------------------------------------------");

    // Si hubo errores léxicos, los imprimimos después de la tabla
    if (lexerErrors.length > 0) {
        for (let error of lexerErrors) {
            console.error(`\n${error}`);
        }
    }

    // Volver a crear el lexer y parser porque getAllTokens consume los tokens
    inputStream = CharStreams.fromString(input);
    lexer = new AnalizadorLexer(inputStream);

    // Elimina los listeners por defecto del lexer, pero NO agregues el tuyo aquí
    lexer.removeErrorListeners();

    let tokenStream = new CommonTokenStream(lexer);
    let parser = new AnalizadorParser(tokenStream);

    // Agregar listener de errores al parser solo si no hubo errores léxicos
    parser.removeErrorListeners();
    if (!huboErrorLexico) {
        parser.addErrorListener(new MyErrorListener(false, parserErrors));
    }

    parser.buildParseTrees = true;
    let tree = parser.programa();

    if (!huboErrorLexico && parserErrors.length > 0) {
        for (let error of parserErrors) {
            console.error(`\n${error}`);
        }
    }

    // Mostrar árbol sintáctico
    console.log("\nÁrbol de derivación:");
    console.log(tree.toStringTree(parser.ruleNames));

    // Validación y traducción
    if (!huboErrores) {
        console.log("\nLa entrada es válida. No se encontraron errores.");

        const jsVisitor = new CustomJavaScriptGeneratorVisitor();
        const jsCode = jsVisitor.visit(tree);
        fs.writeFileSync("ejemplo.js", jsCode, "utf8");
        
        console.log("\nCódigo JavaScript generado:\n");
        console.log(jsCode);

        console.log("\nResultado:\n");
        try {
            execSync("node ejemplo.js", { stdio: "inherit" });
        } catch (err) {
            console.error("\nError al ejecutar el código JavaScript generado.");
        }
    } else {
        if (huboErrorLexico) {
            console.log("\nLa entrada contiene errores léxicos. No se generó el código en JavaScript.");
        } else {
            console.log("\nLa entrada contiene errores sintácticos. No se generó el código en JavaScript.");
        }
    }
}

function leerCadena() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question("Ingrese una cadena: ", (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

// Ejecuta la función principal
main();