import * as THREE from "three";

export class HighLighter {
    private originalMaterials = new Map<THREE.Mesh, THREE.Material | THREE.Material[]>(

    );

    public highlight(object: THREE.Object3D): void {
        object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (!this.originalMaterials.has(mesh)) {
                    this.originalMaterials.set(mesh, mesh.material);
                }
                if ("emissive" in mesh.material) {

                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    console.warn(mat.emissive)
                    mat.emissive = new THREE.Color(0x00ff00);
                    mat.needsUpdate = true;
                } else {
                    mesh.material = new THREE.MeshBasicMaterial({
                        color: (mesh.material as any).color || new THREE.Color(0xffffff),
                        wireframe: true,
                    });
                    (mesh.material as THREE.Material).needsUpdate = true;
                }
            }
        });
    }

    public restore(object: THREE.Object3D): void {
        object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const original = this.originalMaterials.get(mesh);
                if (original) {
                    mesh.material = original;
                    (mesh.material as THREE.Material).needsUpdate = true;
                    this.originalMaterials.delete(mesh);
                }
            }
        });
    }

    //альтернативный костыльный метод
    public restoreAlt(object: THREE.Object3D): void {
        object.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = mesh.material as THREE.MeshStandardMaterial;
                mat.emissive = new THREE.Color(0x000000)
                mat.needsUpdate = true;

            }
        });
    }
}