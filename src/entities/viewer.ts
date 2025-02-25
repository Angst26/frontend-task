import * as THREE from "three";
import CameraControls from "camera-controls";

import * as uuid from "uuid";
import Scene from './scene.ts'
import Model from "./model.ts";
import {CameraController} from "./camera.ts";
import {Renderer} from "./renderer.ts";
import {HighLighter} from "./highLighter.ts";

CameraControls.install({ THREE });

class Viewer {
  public id: string;
  public scene: Scene = new Scene();
  public camera: THREE.PerspectiveCamera;

  private renderer: Renderer;
  private cameraController: CameraController;
  private highlighter: HighLighter = new HighLighter();

  private _renderNeeded = true;
  private _clock = new THREE.Clock();
  public model: Model = new Model();

  private _highlightedObject: THREE.Object3D | null = null;


  constructor(container: HTMLDivElement) {
    this.id = uuid.v4();

    //инициализация камеры
    this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    this.camera.position.set(10, 10, 10);

    //используем класс Render для создания рендера
    this.renderer = new Renderer(container);

    //используем класс CameraController
    this.cameraController = new CameraController(this.camera, this.renderer.renderer.domElement);


    window.addEventListener("resize", this.resize);

    this.model.loadModel().then((object3d) => {
      if (object3d) {
        object3d.rotateX(-Math.PI / 2);
        this.scene.addObject(object3d);
        const boundingBox = new THREE.Box3().setFromObject(object3d);
        this.cameraController.fitToBox(boundingBox, false);
        this.model.model = object3d;
        this.model.status.next("idle");
      }
    });

    this.updateViewer();
  }


  public updateViewer() {
    this._renderNeeded = true;
    this._render();
  }

  private resize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderNeeded = true;
    this.updateViewer();
  };

  private _render = () => {
    const clockDelta = this._clock.getDelta();
    const hasControlsUpdated = this.cameraController.update(clockDelta);

    if (hasControlsUpdated || this._renderNeeded) {
      this.renderer.render(this.scene.scene, this.camera);
      this._renderNeeded = false;
    }

    window.requestAnimationFrame(this._render);
  };



  public highlightObject(object: THREE.Object3D) {
    if (this._highlightedObject === object) return; // если выбран тот же объект, ничего не делаем
    if (this._highlightedObject) {
      console.log('удаляем цвет у предыдущего объекта')
      this.highlighter.restoreAlt(this._highlightedObject);
    }
    this.highlighter.highlight(object)
    this._highlightedObject = object;
    this.updateViewer();
  }


  public dispose(): void {
    // console.log("dispose viewer", this.id);
    window.removeEventListener("resize", this.resize);

    const domElement = this.renderer.renderer.domElement;
    if(domElement.parentElement) {
      domElement.parentElement.removeChild(domElement);
    }

    this.renderer.renderer.dispose()
    this.cameraController.dispose()

    this.scene.clear()
    this._renderNeeded = false;
  }

}

export default Viewer;
