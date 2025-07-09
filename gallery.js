var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = async function () {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    var camera = new BABYLON.ArcRotateCamera("camera1", -0.8, 1.2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var index = 0;
    var gs;

    const models = [
        { file: "gs_Fire_Pit.splat", radius: 6, alpha: -0.8 },
        { file: "newGSplat.splat", radius: 5, alpha: 1.5 },
        { file: "newGSplat.splat", radius: 7, alpha: 2.2 },
    ];

    //const baseURL = "https://your-host.com/splats/";
    const baseURL = "./models/";


    async function loadModel() {
        gs?.dispose();
        const model = models[index];
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, baseURL, model.file, scene);
        gs = result.meshes[0];
        camera.radius = model.radius;
        camera.alpha = model.alpha;
    }

    await loadModel();

    // Add buttons to cycle models
    const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const left = BABYLON.GUI.Button.CreateSimpleButton("left", "<");
    const right = BABYLON.GUI.Button.CreateSimpleButton("right", ">");

    [left, right].forEach(btn => {
        btn.width = "50px";
        btn.height = "50px";
        btn.color = "white";
        btn.background = "gray";
        ui.addControl(btn);
    });

    left.left = "-45%";
    left.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    left.onPointerUpObservable.add(() => {
        index = (index + models.length - 1) % models.length;
        loadModel();
    });

    right.left = "45%";
    right.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    right.onPointerUpObservable.add(() => {
        index = (index + 1) % models.length;
        loadModel();
    });

    return scene;
};

createScene().then(scene => {
    engine.runRenderLoop(() => scene.render());
});
window.addEventListener("resize", () => engine.resize());
