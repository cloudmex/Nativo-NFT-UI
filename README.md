# NFT Marketplace de comunidades latinas

## π» Tecnologias usadas

Esta es la parte del proyecto enfacada en la UI/UX para esto se necesitaron las siguientes tecnologias:

1. Node.js >= 12 
2. React 
3. MetaMask (ExtensiΓ³n del navegador y mΓ³vil)
4. Infura (IPFS gateway)
5. Truffle framework

## π¨π»βπ» InstalaciΓ³n local del proyecto

Para correr este proyecto de forma local se necesitan los siguientes requerimientos:

1. Tener instalado [Node.js] en su versiΓ³n 12 o superior (recomendamos utilizar la herramienta de [nvm])
2. Instalar el manejador de paquetes de yarn `npm install -g yarn`
3. Instalar las dependencias del proyecto `npm install` o `yarn install` dentro del directorio que contiene el archivo `package.json`
4. Instalar de forma global el framework de Truffle `npm install -g truffle`
5. Compilar tailwind de manera local `npm run build-dev-tailwind`

## π Arbol de archivos
```bash
βββ README.md                                    # Este archivo
βββ package-lock.json
βββ package.json                                 # Archivo que contiene los scripts y dependencias
βββ public                                       # Directorio con los archivos publicos
βΒ Β  βββ ads.txt
βΒ Β  βββ favicon.png
βΒ Β  βββ index.html
βΒ Β  βββ manifest.json
βΒ Β  βββ preview.gif
βΒ Β  βββ robots.txt
βββ src                                          # Directorio fuente del proyecto en react
    βββ App.js                                   # Archivo con el punto de montaje del componente app
    βββ App.test.js
    βββ HOCS
    βΒ Β  βββ MetamaskProtectedRoute.hoc.js        # Archivo que controla las rutas protegidas con metamask
    βββ assets                                   # Directorio con los recursos del slider
    βΒ Β  βββ landingSlider
    βΒ Β      βββ img
    βΒ Β      βΒ Β  βββ ArteHuichol_Uno.jpg
    βΒ Β      βΒ Β  βββ flauta.jpg
    βΒ Β      βΒ Β  βββ flor.jfif
    βΒ Β      βββ sliderData.js
    βββ blocks                                  # Directorio con componentes para tailwind css
    βββ components                              # Directorio de los componenetes en react
    βΒ Β  βββ Footer.component.js
    βΒ Β  βββ Hero.component.js
    βΒ Β  βββ Navbar.component.js
    βΒ Β  βββ imageSlider.component.js
    βΒ Β  βββ modal.component.js
    βΒ Β  βββ modalRevender.component.js
    βΒ Β  βββ nftatribute.component.js
    βΒ Β  βββ statistc.component.js
    βΒ Β  βββ steps.component.js
    βΒ Β  βββ teamMembers.component.js
    βββ contracts                               # Directorio con los contratos para ser importados
    βΒ Β  βββ Address.json
    βΒ Β  βββ Context.json
    βΒ Β  βββ Counters.json
    βΒ Β  βββ ERC165.json
    βΒ Β  βββ ERC721.json
    βΒ Β  βββ ERC721Enumerable.json
    βΒ Β  βββ IERC165.json
    βΒ Β  βββ IERC721.json
    βΒ Β  βββ IERC721Enumerable.json
    βΒ Β  βββ IERC721Metadata.json
    βΒ Β  βββ IERC721Receiver.json
    βΒ Β  βββ MarketPlace.json
    βΒ Β  βββ Migrations.json
    βΒ Β  βββ Strings.json
    βββ icons
    βββ index.cs                                # Archivo index de css del proyecto
    βββ index.js                                # Archivo index del proyecto
    βββ serviceWorker.js                        # Archivo de configuraciΓ³n del service worker
    βββ setupTests.js
    βββ utils                                   # Directorio con archivos de utlidad
    βΒ Β  βββ blockchain_interaction.js           # Archivo que controla la interacciΓ³n con metamask
    βΒ Β  βββ constraint.js                       # Archivo para el control de formato de archivos
    βββ views                                   # Directorio con las vistas de la Dapp
        βββ Detail.view.js
        βββ Galeria.view.js
        βββ Landing.view.js
        βββ MisTokens.view.js
        βββ goMetamask.js
        βββ mintNft.view.js
        βββ notFound.view.js
```
 
[Node.js]: https://nodejs.org/en/download/package-manager/
[nvm]: https://github.com/nvm-sh/nvm
