# Erp_FootLocker
¿De qué se trata la empresa?

El nombre de la tienda es Skibiz. Nuestra tienda consiste en una tienda de zapatos sobre el ámbito deportivo. Como puede ser.

¿En qué consiste el ERP de la tienda?

Esta página servirá para poder hacer un estudio de mercado sobre los productos más vendidos en la página web para Ayudar a los usuarios a tener una mayor facilidad a la hora de elegir los productos que más le interesen.

¿Cómo funciona?: Al entrar en la página se registrará las actividades y las compras que quieran o hayan querido se registrará en el ERP para poder hacer los estudio de mercado necesarios.

participación del estudio: Al meterte en la pagina y en un producto te saldran mas productos relacionados y si lo compro otra persona tambien puede salir las opciones que el haya comprado.

Facilita la toma de decisiones: Al tener acceso a los datos en tiempo real sobre el inventario, ventas y comportamiento de los clientes, el ERP te permitirá identificar tendencias y tomar decisiones estratégicas. Esto ayudará a ajustar tus estrategias de marketing y compras en función de las demandas del mercado.

Optimiza el rendimiento: Con el ERP, podrás analizar el rendimiento de cada producto y localizar las áreas donde tu tienda necesita mejorar. De esta forma, podrás ajustar tus operaciones para aumentar la eficiencia y reducir costos, asegurando que siempre tengas los productos adecuados en stock.

Lenguages utilizados: utilizaremos HTML, CSS, JavaScript, JSON, XAMMP.

Instalacion y versiones: Las versiones necesarias son:VisualStudioCode >=1.96 Node.js >= v22.11.0, JSON >= x.x.x, bootstrap: ~5.4.x, Live Server >=5.6.1,Git: >= 2.42.x

Como utilizar los programas:

## VisualStudioCode:
Para poder utilizar el HTML no es necesario ninguna aplicación para poder hacer el programa; Pero es mejor utilizar programas como Visual Studio.
Para poder descargarlo es necesario entrar al este link"https://code.visualstudio.com//" este link te llevara directo a la página para poder 
instalarlo, hay varias opciones pero la más recomendable es la gratuita, diríjase al botón que ponga "Download for Windows" una vez le haga click 
se descarga un programa llamado "VSCodeUserSetup" una vez lo habrá le deberá aceptar los términos y servicios, en el siguiente apartado no deberá 
tocar nada y darle a "Siguiente" y finalmente deberá darle a instalar y ya lo tendra listo para su disposición.

## HTML:
El HTML es el lenguaje estándar utilizado para crear la estructura y el contenido básico de una página web. No es un lenguaje de programación, sino un lenguaje de marcado que se utiliza para estructurar y organizar elementos en la web.

## CSS:
CSS también se escribe en un archivo que puedes crear en un editor de texto. Para que el navegador sepa que debe aplicar esos estilos, debes decirle al archivo HTML que use ese archivo de CSS.

## JavaScript:
Igual que HTML y CSS, se puede escribir JavaScript en un editor de texto. Luego, simplemente debes enlazar este archivo a la página HTML para que funcione en el navegador.

## Json:
JSON también se guarda en un archivo, y puedes crear uno en un editor de texto. Es muy común ver JSON en aplicaciones donde necesitas almacenar información y luego acceder a ella.

## Node.js:
Para comenzar con la instalación deberemos ir a este link " https://nodejs.org/ " y hacer clik en " Download Node.js (LTS) ". Una vez instalamos lo inicializamos y deberemos darle a next hasta que se muestre en pantalla varias opciones, nosotros deberemos darle a " add to PATH ", una vez lo hayamos seleccionado deberemos activar la opción " Automatically install the necessary tools. Note that this will also install Chocolatey. The script will pop-up in a new window after the installation completes. " una vez finalizado el proceso de instalación se abrirá la terminal y solo le tendras que dar a cualquier botón para que empiece la instalación.Una vez hecho todo necesitaremos acceder a la terminal de Visual Studio Code. una vez nos encontremos en la terminal deberemos copiar y pegar este comando
" 
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser 
irm get.scoop.sh | iex 
"
Una vez terminada la instalación deberemos de copiar y pegar este comando 
"
winget install Schniz.fnm


fnm env --use-on-cd | Out-String | Invoke-Expression


fnm use --install-if-missing 22


node -v # should print v22.11.0G


npm -v # should print 10.9.0 
" 
una vez terminada con la instalación del programa solo faltaria poner este comando " node JS/servidor.js " para iniciar el servidor responsable con el registro y actualización del Json(base de datos).

## Live Server:
Live Server es una extensión para Visual Studio Code que te permite lanzar un servidor de desarrollo local para tus proyectos web.
Para instalarlo es necesario abrir Visual Studio Code y en el lado izquierdo buscar el icono de la Marketplace, una vez estes dentro en el buscador de la extensión tendrás que poner Live Server, cuando te salga la extensión y dale a instalar.
Ahora para utilizarlo solo debes darle al botón de abajo a la derecha que pone " Go Live " con eso bastaría para que se te abra el navegador con la página ya cargada.


## Dependencias a instalar

Para que tu proyecto funcione correctamente, asegúrate de instalar las siguientes dependencias. Estas son necesarias para configurar el servidor y conectarse a la base de datos SQLite:

```json
"dependencies": {
  "cors": "^2.8.5",
  "express": "^4.21.2",
  "node": "^22.13.0",
  "sqlite3": "^5.1.7"
}

Insertar el siguiente comando en la terminal para instalar las dependencias :

npm install cors express sqlite3

 