import * as THREE from 'three';

export default class Scene {
    public scene: THREE.Scene;

    constructor(bgColor: string = '#333333') {
        this.scene = new THREE.Scene();
        this._setBackground(bgColor);
        this.initLights()
    }
    private _setBackground (color: string): void {
        this.scene.background = new THREE.Color(color);
    }



    private initLights() {
        const dirLight = this.createDireactionalLights(0xffffff, 1)
        this.scene.add(dirLight);

        const ambientLight = this.createAmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
    }

    private createAmbientLight(color: number, intensity: number): THREE.AmbientLight {
        return new THREE.AmbientLight(color, intensity);
    }

    private createDireactionalLights(color: number, intensity: number): THREE.DirectionalLight {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(5, 10, 15);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 50;

        return light;
    }

    public addObject(object3d: THREE.Object3D){
        this.scene.add(object3d);
    }

    public removeObject(object3d: THREE.Object3D){
        this.scene.remove(object3d);
    }

    public clear(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }
    }

}