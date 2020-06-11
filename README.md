<img src="https://estaticos.muyinteresante.es/media/cache/760x570_thumb/uploads/images/gallery/5548e20741444aef0ed38e41/adn-1.jpg" title="FVCproductions" alt="FVCproductions">

# Detector de mutaciones de ADN

Sistema que detecta si una persona tiene diferencias genéticas basándose en su secuencia de ADN.

## Instalación

### Prerrequisitos

Tener instalado <a href="https://nodejs.org/es/download/">Node JS</a>

### Descarga de dependencias

Una vez descargado el proyecto, abre la carpeta que lo contiene y ejecuta el siguiente comando:

```
npm install
```

## Uso

### Local

Para ejecutar el sistema en tu propia computadora por favor sigue las siguientes instrucciones: 

Levanta el servidor de forma local con el siguiente comando:
```
node server/server
```
Por default se utilizará el puerto 3011, dicha configuración se puede cambiar en el archivo server/server.js modificando la variable port.

Una vez levantado el servidor, podemos acceder al sistema desde nuestro navegador favorito a través de la siguiente url: http://localhost:3011

### Remoto

Para probar el sistema de forma remota por favor accede a la siguiente url: https://gerardoarceo.com/teamknowlogy

El sistema está alojado en un servidor de Amazon en la capa gratuita.


### Llamada a las funciones

#### Función de detección de mutaciones
Hay un servicio levantado en la ruta "/mutation/", recibe una secuencia de ADN mediante el método HTTP POST, la secuencia se debe enviar en un JSON que tenga el siguiente formato:

```
POST → /mutation/

{
“dna”:["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]
}
```

Dicho lo anterior, si queremos enviar una petición al servidor remoto, lo haremos a la siguiente URL a través del método POST: https://gerardoarceo.com/teamknowlogy/mutation

En caso de que se verifique una mutación se devuelve un HTTP 200-OK, en caso contrario un 403-Forbidden.

Para facilitar la prueba del servicio se habilitó también el método GET para esta función, los
parámetros se envían de la misma forma que en el caso anterior.

#### Ejemplo de petición GET a la consulta de una secuencia de ADN en el servidor remoto
<a href="https://gerardoarceo.com/teamknowlogy/stats">https://gerardoarceo.com/teamknowlogy/mutation?dna={"dna":["ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"]}</a>

#### Función de consulta de estadísticas

Se pueden consultar las estadísticas mediante el servicio levantado en la ruta "/stats", no recibe ningún parámetro, dicho servicio devuelve una respuesta del siguiente tipo:

```
{“count_mutations”:40, “count_no_mutation”:100: “ratio”:0.4}
```

#### Ejemplo de petición GET a la consulta de estadisticas en el servidor remoto
<a href="https://gerardoarceo.com/teamknowlogy/stats">https://gerardoarceo.com/teamknowlogy/stats</a>


## Algoritmo

### Parámetros
* Array de Strings que representan cada fila de una tabla de (NxN) con la secuencia del ADN. Las letras de los Strings solo pueden ser: (A,T,C,G), las cuales representa cada base nitrogenada del ADN.

### Ejemplo

#### Sin mutación:
A T G C G A

C A G T G C

T T A T T T

A G A C G G

G C G T C A

T C A C T G

 

#### Con mutación:
A T G C G A

C A G T G C

T T A T G T

A G A A G G

C C C C T A

T C A C T G


Sabrás si existe una mutación si se encuentra más de una secuencia de cuatro letras iguales, de forma oblicua (diagonal), horizontal o vertical.

#### Caso con mutación:
```
String[] dna = {"ATGCGA","CAGTGC","TTATGT","AGAAGG","CCCCTA","TCACTG"};
```
En este caso el llamado a la función hasMutation(dna) devuelve “true”.

### Análisis del algoritmo
Para conseguir identificar si una secuencia de ADN tiene mutaciones, se dividió el problema en 3 subproblemas más sencillos:

1. Identificar mutaciones en cadenas horizontales
2. Identificar mutaciones en cadenas verticales
3. Identificar mutaciones en cadenas diagonales

Estos 3 subproblemas tienen en común las mismas restricciones para determinar mutaciones por lo que realmente estamos hablando de un sólo problema: Identificar si una cadena tiene mutaciones.

En otras palabras, el problema es identificar si una cadena contiene 4 caracteres iguales contiguos, este problema tiene una complejidad lineal pues basta con recorrer una sola vez la cadena para determinar esto, esto lo podemos llevar a cabo fácilmente siguiendo los siguientes pasos:

1. Inicializar un contador a 1

2. Ir recorriendo caracter por caracter de la cadena, lo hacemos de izquierda a derecha por comodidad

3. Comparamos cada caracter con el siguiente caracter de la cadena, si son iguales aumentamos en 1 el contador, de esta forma podremos llevar la cuenta de la longitud de la subcadena de caracteres iguales

4. En caso de que un caracter no sea igual al siguiente caracter de la cadena, se reinicia el contador a 1 pues significa que se rompió la racha de caracteres iguales (en caso de que existiese dicha racha)

5. Si en algún momento la longitud de la subcadena de caracteres iguales alcanza 4, significa que es una mutación y aumentaremos en 1 nuestro contador de mutaciones

6. Si nuestro contador de mutaciones es mayor a nuestro límite establecido (1), inmediatamente dejamos de buscar más mutaciones y simplemente devolvemos una bandera booleana que indique que la secuencia está mutada.

El algoritmo anterior lo tenemos que ejecutar por cada cadena horizontal, vertical y diagonal que se pueda formar en la secuencia de ADN al tenerla ordenada como una matriz de NxN.

Si al evaluar todas las cadenas formadas en la matriz no se encontrarón más mutaciones que el número máximo permitido, se puede decir que la secuencia no está mutada y se retorna el valor booleano correspondiente.

### Análisis de complejidad
El algoritmo que implementa este sistema tiene una complejidad O(n<sup>2</sup>), dado que se tienen que recorrer todos los elementos de un arreglo bidimensional, esta cota es la mejor que se puede alcanzar para este problema.



## Pruebas

Para asegurar que todas las funciones del proyecto funcionarán de la forma esperada se desarrollaron 2 archivos de pruebas unitarias, uno para las funciones referentes al servicio de detectar mutaciones y otro para las funciones referentes a la consulta de estadísticas.

### Funciones probadas

* validDna: Se comprueba que esta función valide correctamente si una secuencia de ADN es válida a través de una expresión regular.

* stringMutations: Se comprueba que esta función determine correctamente el número de mutaciones dentro de una cadena y si se excede el número máximo que se detenga inmediatamente

* diagonalStringMutations: Se comprueba que esta función retorne efectivamente el número de mutaciones que hay en cada una de las cadenas que se pueden formar en las diagonales de una matriz determinada

* hasMutation: Se comprueba que esta función determine correctamente si una secuencia de ADN ha sufrido mutaciones ya sea por las cadenas formadas horizontal, vertical o diagonalmente.

* getStats: Se comprueba que esta función retorne el formato esperado de estadísticas al extraer los datos del archivo del servidor

### Ejecución de pruebas

Para ejecutar el archivo de pruebas basta con ejecutar el siguiente comando:
```
npm run test
```

## Autor

### [Gerardo Arceo](https://gerardoarceo.com)

### Desarrollado como sistema de prueba para teamknowlogy.