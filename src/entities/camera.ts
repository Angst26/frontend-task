import * as THREE from "three";
import CameraControls from "camera-controls";

export class CameraController {
    private controls: CameraControls;

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
        this.controls = new CameraControls(camera, domElement);
        this.controls.dollyToCursor = true;
        this.controls.dollySpeed = 0.4;
        this.controls.draggingSmoothTime = 0;
        this.controls.smoothTime = 0;
        this.controls.mouseButtons.right = CameraControls.ACTION.ROTATE;
        this.controls.mouseButtons.left = CameraControls.ACTION.NONE;
    }

    public update(delta: number): boolean {
        return this.controls.update(delta);
    }

    public fitToBox(box: THREE.Box3, instantly: boolean = false): void {
        this.controls.fitToBox(box, instantly);
    }

    public dispose(): void {
        this.controls.dispose();
    }
}