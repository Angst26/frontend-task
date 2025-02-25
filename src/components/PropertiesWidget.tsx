import  { useEffect } from "react";
import * as THREE from "three";
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

interface PropertiesViewerWidgetProps {
    viewer: any;
    model: any;
}

export default function PropertiesViewerWidget({ viewer, model }: PropertiesViewerWidgetProps) {
    useEffect(() => {
        if (!viewer || !model) return;

        console.log("Viewer:", viewer);
        console.log("Model:", model);

        // Инициализация CSS2DRenderer
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.style.pointerEvents = "none";
        document.body.appendChild(labelRenderer.domElement);

        // Определяем корневой объект. Иногда модель передаётся как model, или как model.model
        const rootObject: THREE.Object3D | undefined = model.model || model;
        if (!rootObject) return;

        // Функция для рекурсивного добавления меток на объекты
        const addLabelsToObject = (object: THREE.Object3D) => {
            if (object.userData?.propertyValue) {
                const { statusText } = object.userData.propertyValue;
                const div = document.createElement("div");
                div.className = "label";
                div.textContent = statusText;
                div.style.background = "rgba(255,255,255,0.8)";
                div.style.padding = "4px 8px";
                div.style.borderRadius = "4px";
                div.style.fontSize = "14px";
                div.style.color = "#000";

                const label = new CSS2DObject(div);
                label.position.set(0, 0, 0);
                object.add(label);
            }
            object.children.forEach((child) => addLabelsToObject(child));
        };

        addLabelsToObject(rootObject);

        const animate = () => {
            requestAnimationFrame(animate);
            const scene = viewer.scene instanceof THREE.Scene ? viewer.scene : viewer.scene?.scene;
            if (scene && viewer.camera) {
                labelRenderer.render(scene, viewer.camera);
            }
        };

        animate();

        return () => {
            if (labelRenderer.domElement.parentElement) {
                labelRenderer.domElement.parentElement.removeChild(labelRenderer.domElement);
            }
        };
    }, [viewer, model]);

    return null;
}
