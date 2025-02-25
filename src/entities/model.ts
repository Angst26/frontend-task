import * as THREE from 'three';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import parseJSON, { findThreeJSJSON} from '../utils/parse-json.ts'; // Предполагаемые утилиты

export type ViewerStatus = "idle" | "loading" | "error";

export default class Model {
    public model: THREE.Object3D | undefined;
    public status: BehaviorSubject<ViewerStatus> = new BehaviorSubject<ViewerStatus>("idle");
    public modelSubject: BehaviorSubject<THREE.Object3D | null> = new BehaviorSubject<THREE.Object3D | null>(null);

    constructor() { }

    public async loadModel(): Promise<THREE.Object3D> {
        this.status.next("loading");
        try {
            const modelUrl = "https://storage.yandexcloud.net/lahta.contextmachine.online/files/pretty_ceiling_props.json";
            const response = await axios.get(modelUrl, {
                headers: {
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                },
            });
            const data = response.data;
            const jsonObject = findThreeJSJSON(data);
            if (!jsonObject) {
                throw new Error("JSON data not found");
            }
            const object3d = await parseJSON(jsonObject);
            this.assignPropertyValues(object3d);
            // console.log("Model loaded:", object3d.name);
            this.model = object3d;
            this.modelSubject.next(object3d);
            this.status.next("idle");
            return object3d;
        } catch (error) {
            this.status.next("error");
            console.error("Failed to load model:", error);
            throw new Error("Failed to load model");
        }
    }

    private assignPropertyValues(object: THREE.Object3D): void {
        const progressStatuses: { [key: number]: string } = {
            1: "Not Started",
            2: "In Progress",
            3: "Partially Installed",
            4: "Installed",
        };

        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Например, можно использовать child.id для циклического присвоения статуса
                const statusIndex: number = (child.id % 4) + 1;
                child.userData.propertyValue = {
                    statusCode: statusIndex,
                    statusText: progressStatuses[statusIndex],
                };
            }
        });
    }
}
