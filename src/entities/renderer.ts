import * as THREE from "three";

export class Renderer {
    public renderer: THREE.WebGLRenderer;

    constructor(container: HTMLDivElement) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(this.renderer.domElement);
    }

    public setSize(width: number, height: number): void {
        this.renderer.setSize(width, height);
    }

    public render(scene: THREE.Scene, camera: THREE.Camera): void {
        this.renderer.render(scene, camera);
    }
}