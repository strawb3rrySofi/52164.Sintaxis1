grammar Analizador;

programa: instruccion+ ;

instruccion: conteo ;

conteo: PARA identificador DESDE numero HASTA numero HACER LBRACE sentencia* RBRACE ;

sentencia: salida+ | terminar ;

salida: IMPRIMIR LPAREN CADENA RPAREN SEMICOLON ;

terminar: SALIR SEMICOLON ;

identificador: IDENTIFICADOR ;

numero: NUMERO ;

CADENA: '\'' (~['\r\n])* '\'' ;

PARA: 'para';
DESDE: 'desde';
HASTA: 'hasta';
HACER: 'hacer';
IMPRIMIR: 'imprimir';
SALIR: 'salir';

LPAREN: '(';
RPAREN: ')';
LBRACE: '{';
RBRACE: '}';
SEMICOLON: ';';

IDENTIFICADOR: LETRA (LETRA | DIGITO)* ;
NUMERO: DIGITO+ ;

fragment LETRA: [a-zA-Z] ;
fragment DIGITO: [0-9] ;
fragment SIMBOLO: [ .,!?()] ;

WS: [ \t\r\n]+ -> skip ;