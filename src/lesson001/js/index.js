let scene;
let camera;
let renderer;

function init() {

    window.addEventListener('resize', onResize, false);
    // 帧数相关
    let stats = initStats();

    // 创建一个`场景`，它将保存所有元素，如对象、相机和灯光。
    scene = new THREE.Scene();

    // 创建一个`相机`，它用于设置我们正在看的地方。PerspectiveCamera（透视摄像机）
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    // 将`相机`定位并指向场景的中心
    camera.position.set(-30, 40, 30);
    camera.lookAt(scene.position);

    // 创建一个render并设置大小 render：渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // 在`场景`中显示`轴`
    let axes = new THREE.AxesHelper(20);
    scene.add(axes);

    // region  ground plane  --------------------------------------------------------------
    // 创建地平面
    let planeGeometry = new THREE.PlaneGeometry(60, 20);
    let planeMaterial = new THREE.MeshLambertMaterial({ //材质对象Material
        color: 0xAAAAAA
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial); // //网格模型对象Mesh
    plane.receiveShadow = true;

    // 旋转并定位平面
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0); // 以物体的中心点计算的

    // 将平面添加到场景中
    scene.add(plane);
    // endregion ground plane  --------------------------------------------------------------


    // region cube --------------------------------------------------------------
    // 创建一个立方体
    let cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    let cubeMaterial = new THREE.MeshLambertMaterial({ // //材质对象Material
        color: 0xFF0000,
        // wireframe: true
    });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial); //网格模型对象Mesh
    cube.castShadow = true;

    // 定位立方体。以物体的中心点计算的
    cube.position.set(-4, 3, 0);

    // 将立方体添加到场景
    scene.add(cube);
    // endregion cube --------------------------------------------------------------

    // region sphere --------------------------------------------------------------
    // 创建一个球形
    let sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    let sphereMaterial = new THREE.MeshLambertMaterial({ // //材质对象Material
        color: 0x7777FF,
        // wireframe: true
    });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial); //网格模型对象Mesh
    sphere.castShadow = true;

    // 定位 以物体的中心点计算的
    sphere.position.set(20, 4, 2);

    // 添加到场景
    scene.add(sphere);
    // endregion sphere --------------------------------------------------------------


    // region 光源 --------------------------------------------------------------
    let spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-40, 40, -15);

    spotLight.castShadow = true;

    scene.add(spotLight);
    // endregion 光源 --------------------------------------------------------------


    // 将渲染器的输出添加到html元素
    document.getElementById("webgl-div").appendChild(renderer.domElement);
    // 渲染场景
    // renderer.render(scene, camera);

    // region  renderScene渲染相关 --------------------------------------------------------------
    let step = 0;

    let controls = {
        rotationSpeed : 0.02,
        bouncingSpeed : 0.03
    };

    let gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'bouncingSpeed', 0, 0.5);

    function renderScene() {
        stats.update(); // 帧数更新显示

        // 绕着立方体的轴旋转它
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // 上下弹跳球体
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));


        requestAnimationFrame(renderScene);
        renderer.render(scene, camera);
    }
    // endregion  renderScene渲染相关 --------------------------------------------------------------
    renderScene();

}

/** 初始化帧数显示 */
function initStats() {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById('stats-div').appendChild(stats.domElement);
    return stats;
}

/** 重新设置大小 */
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

