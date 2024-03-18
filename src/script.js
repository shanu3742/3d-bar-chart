import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import * as d3 from 'd3'
const loader = new FontLoader();

/**
 * get the canvas from dom 
 */
const canvas  = document.getElementById('canvas')
/**
 * get width and height 
 */
const size={
    width:window.innerWidth,
    height:window.innerHeight
}

/**
 * create scene 
 */
const scene = new THREE.Scene();



const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff ,side:THREE.DoubleSide});
const planeGeometry = new THREE.PlaneGeometry(3, 1);
const plane  = new THREE.Mesh(planeGeometry,planeMaterial)
plane.rotation.x = Math.PI * -0.5;
scene.add(plane)



/**
 * add camera to scene 
*/

const camera= new THREE.PerspectiveCamera(75,size.width / size.height, 0.1, 100);
/**
 * set the camera position 
 */
camera.position.x = 0;
camera.position.y =1;
camera.position.z = 4;
let data =[0,1,2,3,4,5,6,7,8,9]

const createBox = (boxColor,barHeight,barWidth,barXcord,i) => {
    /**
     * create basic material  0x00ff00
     */
    const boxMaterial = new THREE.MeshStandardMaterial({ color: boxColor });
    
    /**
     * create basic geometry
     */
    let boxHeight=barHeight;
    
    const boxGeometry = new THREE.BoxGeometry(barWidth, boxHeight, 1); 
    
    
    
  
    
    /**
     * create mesh 
     */
    let collisionValue= 0.001
    const box = new THREE.Mesh(boxGeometry,boxMaterial)
    console.log(box.position.y)
    box.position.y = (boxHeight/2)+collisionValue;
    box.position.x = barXcord;
    // if(i===Math.floor((data.length-1)/2)){
    //     camera.lookAt(box.position)
    // }
    
    /**
     * add box to the scene 
     */
    scene.add(box)
    }
 
    const xScale  = d3.scaleBand().domain(data).range([-1.5,1.5]).paddingInner(0.5).paddingOuter(0.5)
    const yScale = d3.scaleLinear().domain([0,10]).range([0.5,1.5])
    // .bandWidth(0.2)
    
    console.log(xScale.bandwidth())
    for(let i=0;i<data.length;i++){
        createBox('#800080',yScale(i),xScale.bandwidth(),xScale(i),i)
    }
    



const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})

/**
 * axis helper 
 */
const axisHelper = new THREE.AxesHelper(5);
// scene.add(axisHelper);
/**
 * enable orbit controll
 */
const controls= new OrbitControls(camera,canvas);
controls.update();
controls.enableDamping= true;


/**
 * add sun light to graph
 */
// White directional light at half intensity shining from the top.
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1);
directionalLight.position.set( - 1, 2, 1 )
scene.add( directionalLight );

const helper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( helper );

const pointLight = new THREE.PointLight( 'yellow', 1 );
pointLight.position.set( 1.5, 2, 1 )
scene.add( pointLight );
const pointLightHelper1 = new THREE.PointLightHelper( pointLight, 1 );
scene.add( pointLightHelper1 );


const secondPointLight = new THREE.PointLight( 'green', 1 );
secondPointLight.position.set( -1.6, 1.3, 0 )
scene.add( secondPointLight );
const pointLightHelper = new THREE.PointLightHelper( secondPointLight, 1 );
scene.add( pointLightHelper );

renderer.setSize(size.width,size.height)
renderer.render(scene,camera)


loader.load('/font/helvetiker/helvetiker.bold.typeface.json',(font) => {
console.log('font loaded')
console.log(font)
const geometry = new TextGeometry( 'Bar Chart', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
} );

const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );

const text = new THREE.Mesh( geometry, material );
text.position.z=1
text.position.x=-1
// text.rotation.x= Math.PI * 0.5
scene.add( text );


}
)



const tick = () => {
    controls.update()
    renderer.render(scene,camera)
    requestAnimationFrame(tick)
}

tick()