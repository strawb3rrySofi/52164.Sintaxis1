# 52164.Sintaxis1
Analizador Sintáctico y Semántico
Abrir la carpeta en Visual Studio Code.

Una vez que tengas abierto el proyecto en Visual Studio Code, el primer paso es cargar una entrada que se quieras analizar. Para hacerlo, puedes copiar la gramática de alguno de los ejemplos disponibles y pegarlo dentro del archivo llamado "input.txt". Es importante que guardes los cambios en ese archivo para que el programa pueda detectar y procesar la nueva entrada.

Con el contenido ya listo en input.txt, abre la terminal dentro de Visual Studio Code. En esta terminal deberás ejecutar el comando "node index.js". Si todo está correcto, se mostrará lo siguiente en la consola:

*La tabla de Tokens y Lexemas.
*El árbol sintáctico (textual).
*Un mensaje indicando si la entrada es válida o no. Si hay errores, se especificará si son léxicos o sintácticos.
*La correspondiente traducción a JavaScript (si aplica). Con su respectiva solución.

Si la traducción a JavaScript es posible, se mostrara en un archivo llamado "ejemplo.js". Si el directorio donde debe guardarse ese archivo no existe, el programa lo creará automáticamente. Para ejecutar este archivo y ver el resultado del código traducido, basta con usar el comando "node ejemplo.js" en la terminal. El resultado del programa traducido se imprimirá en la consola.

Adicionalmente, si deseas visualizar el árbol sintáctico de forma más gráfica y clara solo tendrá seleccionar la opción “Iniciar depuración”. Esto abrirá una vista gráfica del árbol que facilita su interpretación visual 
DATO: para que esto funcione tendra que haber entrado aunque sea una vez al archivo "Analizador.g4"
